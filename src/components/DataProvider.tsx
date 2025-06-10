import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";

type Params = { [key: string]: any };
type City = { id: string; label: string };
type Countries = { id: string; label: string };

// Добавьте новый интерфейс для избранных туров
export interface FavoriteTourData {
  hotelcode: string;
  tourId: string;
}

// Обновите тип контекста
type DataContextType = {
  params: Params;
  requestId: string | null;
  tours: any[];
  loading: boolean;
  error: string | null;
  tourDataStatus: any;
  setData: (key: keyof Params, value: any) => void;
  cities: City[];
  countries: Countries[];
  searchTours: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  favoriteTours: FavoriteTourData[];
  addToFavorite: (tour: FavoriteTourData) => void;
  removeFromFavorite: (hotelcode: string, tourId: string) => void;
  isFavorite: boolean;
  countryResults: any;
  searchMultyTours: () => Promise<void>;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const DataContext = createContext<DataContextType>(
  {} as DataContextType
);

// Создадим отдельную функцию для запроса данных
const fetchTourData = async (requestId: string, page: number) => {
  if (!requestId) {
    throw new Error("RequestId не предоставлен");
  }

  const response = await fetch(
    `${API_BASE_URL}/results/${requestId}?page=${page}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

// Добавим новый тип для результатов по странам
type CountryResults = {
  [country: string]: {
    data: {
      result: {
        hotel: Array<{
          hotelcode: number;
          price: number;
          hotelname: string;
          hotelstars: number;
          hotelrating: string;
          hoteldescription: string;
          picturelink: string;
          // ... остальные поля отеля
        }>;
      };
      status: {
        state: string;
        progress: number;
        requestid: number;
        hotelsfound: number;
        toursfound: number;
        minprice: number;
        maxprice: number;
        timepassed: number;
      };
    };
  };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [params, setParams] = useState<Params>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [allTours, setAllTours] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tourDataStatus, setTourDataStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [countries, setCountries] = useState<
    Array<{ id: string; label: string }>
  >([]);

  // Добавляем новое состояние для countryRequests
  const [countryRequests, setCountryRequests] = useState<CountryRequests>({});

  // Добавьте новые состояния для избранного
  const [favoriteTours, setFavoriteTours] = useState<FavoriteTourData[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Добавим состояние для отслеживания текущей страницы для каждой страны
  const [countryPages, setCountryPages] = useState<{
    [country: string]: number;
  }>({});

  // Добавляем состояние для результатов по странам
  const [countryResults, setCountryResults] = useState<CountryResults>({});

  // Используем useQuery для каждой страны
  const {
    data: tourData,
    error: tourError,
    isLoading: isTourLoading,
    isError: isTourError,
    refetch: refetchTours,
  } = useQuery({
    queryKey: [
      "tourData",
      params.param2,
      countryRequests[params.param2]?.requestId,
      currentPage,
    ],
    queryFn: () =>
      fetchTourData(countryRequests[params.param2]?.requestId, currentPage),
    enabled: !!params.param2 && !!countryRequests[params.param2]?.requestId,
    onSuccess: (data) => {
      if (data?.result?.hotel) {
        // Обновляем туры только если есть новые данные
        setAllTours((prev) => {
          const newTours = [...prev, ...data.result.hotel];
          // Сохраняем в сессию
          saveToSession(
            newTours,
            countryRequests[params.param2]?.requestId,
            params
          );
          return newTours;
        });

        // Обновляем статус для текущей страны
        if (data.status) {
          setTourDataStatus(data.status);
        }
      }
    },
    onError: (error) => {
      console.error("Ошибка при загрузке туров:", error);
      setError("Ошибка при загрузке туров");
    },
    retry: 2, // Количество повторных попыток при ошибке
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
    cacheTime: 1000 * 60 * 30, // Кэш хранится 30 минут
  });

  // Функция для преобразования параметров URL в объект params
  const parseUrlParams = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parsedParams: Params = {};

    // Базовые параметры
    const departure = urlParams.get("departure");
    if (departure) parsedParams.param1 = departure;

    const country = urlParams.get("country");
    if (country) parsedParams.param2 = country;

    // Ночи
    const nightsFrom = urlParams.get("nightsFrom");
    const nightsTo = urlParams.get("nightsTo");
    if (nightsFrom || nightsTo) {
      parsedParams.param3 = {
        startDay: nightsFrom ? parseInt(nightsFrom) : undefined,
        endDay: nightsTo ? parseInt(nightsTo) : undefined,
      };
    }

    // Даты
    const dateFrom = urlParams.get("dateFrom");
    const dateTo = urlParams.get("dateTo");
    if (dateFrom || dateTo) {
      parsedParams.param4 = {
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
      };
    }

    // Туристы
    const adults = urlParams.get("adults");
    const children = urlParams.get("children");
    if (adults || children) {
      parsedParams.param5 = {
        adults: adults ? parseInt(adults) : 2,
        childrenList: children
          ? children.split(",").map((age) => parseInt(age))
          : [],
      };
    }

    // Тип отеля
    const hotelTypes = urlParams.get("hotelTypes");
    if (hotelTypes) parsedParams.param6 = hotelTypes.split(",");

    // Питание
    const meal = urlParams.get("meal");
    if (meal) parsedParams.param7 = [meal];

    // Рейтинг
    const rating = urlParams.get("rating");
    if (rating) parsedParams.param8 = [rating];

    // Звезды
    const stars = urlParams.get("stars");
    if (stars) parsedParams.param9 = parseInt(stars);

    // Услуги отеля
    const services = urlParams.get("services");
    if (services) parsedParams.param10 = services.split(",");

    return parsedParams;
  }, []);

  // Модифицируем setData, чтобы он только обновлял состояние без изменения URL
  const setData = useCallback((key: keyof Params, value: any) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }, []);

  // Эффект только для загрузки параметров из URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() && window.location.pathname === "/OurTours") {
      const urlParamsObj = parseUrlParams();
      if (Object.keys(urlParamsObj).length > 0) {
        setParams(urlParamsObj);
      }
    }
  }, []); // Выполняется только при монтировании

  // Запрос списка городов
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch(`${API_BASE_URL}/cities`);
        const data = await response.json();
        const departures = data?.lists?.departures?.departure || [];
        const citiesData = departures.map((city: any) => ({
          id: city.id,
          label: city.name,
        }));
        setCities(citiesData);
      } catch (error) {
        console.error("Ошибка получения городов:", error);
      }
    }
    fetchCities();
  }, []);

  // Запрос стран по выбранному городу
  useEffect(() => {
    async function fetchCountries() {
      if (!params.param1) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/countries/${params.param1}`
        );
        const data = await response.json();
        const countriesData = data?.lists?.countries?.country || [];
        setCountries(
          countriesData.map((country: any) => ({
            id: country.id,
            label: country.name,
          }))
        );
      } catch (error) {
        console.error("Ошибка получения стран:", error);
      }
    }
    fetchCountries();
  }, [params.param1]);

  // Добавим дебаунс для запросов
  const POLL_INTERVAL = 2500; // Увеличим интервал опроса

  // Создадим отдельную функцию для проверки готовности параметров
  const areParamsReady = (params: Params) => {
    return (
      params.param1 &&
      params.param2 &&
      params.param4?.startDate &&
      params.param4?.endDate
    );
  };

  const saveToSession = useCallback(
    (tours: any[], requestId: string | null, params: Params) => {
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          tours,
          requestId,
          params,
          timestamp: Date.now(),
          currentPage: currentPage,
          tourDataStatus,
        })
      );
    },
    [currentPage, tourDataStatus]
  );

  const loadFromSession = useCallback(() => {
    const savedData = sessionStorage.getItem("searchData");
    if (savedData) {
      const {
        tours,
        requestId,
        params,
        currentPage: savedPage,
        tourDataStatus: savedStatus,
      } = JSON.parse(savedData);
      setTours(tours);
      setAllTours(tours);
      setRequestId(requestId);
      setParams(params);
      setCurrentPage(savedPage || 1);
      if (savedStatus) setTourDataStatus(savedStatus);

      // Предварительно заполняем кэш React Query
      queryClient.setQueryData(["tours", requestId], {
        pages: [{ result: { hotel: tours } }],
        pageParams: [1],
      });
    }
  }, [queryClient]);

  // Модифицируем функцию searchTours
  const searchTours = useCallback(async () => {
    if (!areParamsReady(params)) {
      return;
    }

    // Проверяем, есть ли уже активный поиск для текущих параметров
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setTours([]);
    setAllTours([]);
    setCurrentPage(1);

    try {
      const requestData = {
        departure: params.param1,
        country: params.param2,
        datefrom: params.param4.startDate,
        dateto: params.param4.endDate,
        nightsfrom: params.param3?.startDay?.toString() || "",
        nightsto: params.param3?.endDay?.toString() || "",
        adults: params.param5?.adults?.toString() || "2",
        child: (params.param5?.childrenList.length || 0).toString(),
        hoteltypes: params.param6?.join(",") ?? "any",
        mealbetter: params.param7?.[0] ?? "2",
        rating: params.param8?.[0] ?? "0",
        starsbetter: params.param9?.toString() ?? "1",
        services: params.param10?.join(",") ?? "",
      };

      // Создаем ключ для кэширования запроса
      const cacheKey = JSON.stringify(requestData);

      // Проверяем, есть ли уже запрос с такими параметрами
      const existingRequests = countryRequests[params.param2];
      if (existingRequests?.requestId) {
        return;
      }

      const requestResponse = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await requestResponse.json();

      // Обрабатываем ответ с requestId для каждой страны
      if (responseData) {
        const countryRequestsData = Object.entries(responseData).reduce(
          (acc, [country, data]: [string, any]) => ({
            ...acc,
            [country]: { requestId: data.requestId },
          }),
          {}
        );

        setCountryRequests(countryRequestsData);

        // Запускаем поллинг для каждой страны только один раз
        Object.entries(countryRequestsData).forEach(
          ([country, { requestId }]) => {
            if (requestId) {
              startPolling(requestId, country);
            }
          }
        );
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  }, [params, areParamsReady]);

  // Обновляем функцию loadNextPage
  const loadNextPage = useCallback(async () => {
    if (isTourLoading) return;

    const currentCountry = params.param2;
    if (!currentCountry) return;

    setCurrentPage((prev) => prev + 1);
    setCountryPages((prev) => ({
      ...prev,
      [currentCountry]: (prev[currentCountry] || 1) + 1,
    }));

    await refetchTours();
  }, [isTourLoading, params.param2, refetchTours]);

  // Добавляем эффект для сброса страницы при смене страны
  useEffect(() => {
    setCurrentPage(1);
    setAllTours([]);
  }, [params.param2]);

  // Обновляем проверку hasNextPage
  const hasNextPage = useMemo(() => {
    if (!tourDataStatus?.toursfound) return false;
    const totalPages = Math.ceil(tourDataStatus.toursfound / 10);
    return currentPage < totalPages;
  }, [tourDataStatus, currentPage]);

  // Загружаем сохраненные данные при монтировании компонента
  useEffect(() => {
    loadFromSession();
  }, [loadFromSession]);

  // Загрузка избранных туров при монтировании
  useEffect(() => {
    const savedTours = localStorage.getItem("favoriteTours");
    if (savedTours) {
      const tours = JSON.parse(savedTours);
      setFavoriteTours(tours);
      setIsFavorite(tours.length > 0);
    }
  }, []);

  // Функция добавления в избранное
  const addToFavorite = useCallback((tour: FavoriteTourData) => {
    setFavoriteTours((prev) => {
      const exists = prev.some(
        (t) => t.hotelcode === tour.hotelcode && t.tourId === tour.tourId
      );

      if (!exists) {
        const newTours = [...prev, tour];
        localStorage.setItem("favoriteTours", JSON.stringify(newTours));
        setIsFavorite(true);
        return newTours;
      }

      return prev;
    });
  }, []);

  // Функция удаления из избранного
  const removeFromFavorite = useCallback(
    (hotelcode: string, tourId: string) => {
      setFavoriteTours((prev) => {
        const newTours = prev.filter(
          (tour) => tour.hotelcode !== hotelcode || tour.tourId !== tourId
        );
        localStorage.setItem("favoriteTours", JSON.stringify(newTours));
        setIsFavorite(newTours.length > 0);
        return newTours;
      });
    },
    []
  );

  // Модифицируем функцию startPolling
  const startPolling = useCallback(
    (reqId: string, countryName: string) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 20;
      let isPolling = true;

      const intervalId = setInterval(async () => {
        if (!isPolling) {
          clearInterval(intervalId);
          return;
        }

        try {
          attempts++;
          const tourResponse = await fetch(
            `${API_BASE_URL}/results/${reqId}?page=1`
          );
          const tourData = await tourResponse.json();

          if (tourData.data?.result?.hotel) {
            // Обновляем результаты для конкретной страны
            setCountryResults((prev) => ({
              ...prev,
              [countryName]: tourData,
            }));

            // Если это выбранная страна, обновляем основное состояние
            if (countryName === params.param2) {
              setTours(tourData.data.result.hotel);
              setTourDataStatus(tourData.data.status);
            }
          }

          if (
            tourData.data?.status?.state === "finished" ||
            attempts >= MAX_ATTEMPTS
          ) {
            isPolling = false;
            clearInterval(intervalId);
            setLoading(false);
          }
        } catch (error) {
          console.error("Ошибка при запросе:", error);
          isPolling = false;
          clearInterval(intervalId);
          setLoading(false);
          setError("Ошибка при получении туров");
        }
      }, POLL_INTERVAL);

      return () => {
        isPolling = false;
        clearInterval(intervalId);
      };
    },
    [params.param2]
  );

  const searchMultyTours = useCallback(async () => {
    if (!areParamsReady(params)) {
      return;
    }

    // Проверяем, есть ли уже активный поиск для текущих параметров
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setTours([]);
    setAllTours([]);
    setCurrentPage(1);

    try {
      const requestData = {
        departure: params.param1,
        country: params.param2,
        datefrom: params.param4.startDate,
        dateto: params.param4.endDate,
        nightsfrom: params.param3?.startDay?.toString() || "",
        nightsto: params.param3?.endDay?.toString() || "",
        adults: params.param5?.adults?.toString() || "2",
        child: (params.param5?.childrenList.length || 0).toString(),
        hoteltypes: params.param6?.join(",") ?? "any",
        mealbetter: params.param7?.[0] ?? "2",
        rating: params.param8?.[0] ?? "0",
        starsbetter: params.param9?.toString() ?? "1",
        services: params.param10?.join(",") ?? "",
      };

      // Создаем ключ для кэширования запроса
      const cacheKey = JSON.stringify(requestData);

      // Проверяем, есть ли уже запрос с такими параметрами
      const existingRequests = countryRequests[params.param2];
      if (existingRequests?.requestId) {
        return;
      }

      const requestResponse = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await requestResponse.json();

      // Обрабатываем ответ с requestId для каждой страны
      if (responseData) {
        const countryRequestsData = Object.entries(responseData).reduce(
          (acc, [country, data]: [string, any]) => ({
            ...acc,
            [country]: { requestId: data.requestId },
          }),
          {}
        );

        setCountryRequests(countryRequestsData);

        // Запускаем поллинг для каждой страны только один раз
        Object.entries(countryRequestsData).forEach(
          ([country, { requestId }]) => {
            if (requestId) {
              startPolling(requestId, country);
            }
          }
        );
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  }, [params, areParamsReady]);

  return (
    <DataContext.Provider
      value={{
        params,
        requestId,
        tours: allTours,
        loading: isTourLoading,
        error: tourError ? String(tourError) : null,
        tourDataStatus,
        setData,
        cities,
        countries,
        searchTours,
        fetchNextPage: loadNextPage,
        hasNextPage,
        isFetchingNextPage: isTourLoading,
        favoriteTours,
        addToFavorite,
        removeFromFavorite,
        isFavorite,
        countryResults,
        searchMultyTours,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
