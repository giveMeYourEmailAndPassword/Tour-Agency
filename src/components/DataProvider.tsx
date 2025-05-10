import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

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
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const DataContext = createContext<DataContextType>(
  {} as DataContextType
);

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

  // Добавьте новые состояния для избранного
  const [favoriteTours, setFavoriteTours] = useState<FavoriteTourData[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const setData = useCallback((key: keyof Params, value: any) => {
    setParams((prevParams) => ({ ...prevParams, [key]: value }));
  }, []);

  // Обработчик изменения города отправления
  const setDepartureCity = useCallback(
    (cityId: string) => {
      setData("param1", cityId); // Сохраняем выбранный город в params
    },
    [setData]
  );

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

  // Добавим новую функцию для поиска туров
  const searchTours = useCallback(async () => {
    if (!areParamsReady(params)) {
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

      const requestResponse = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await requestResponse.json();

      if (responseData.result?.requestid) {
        setRequestId(responseData.result.requestid);
        // Сразу начинаем поллинг, не пытаясь получить первый результат
        startPolling(responseData.result.requestid);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка при загрузке данных");
      setLoading(false);
    }
  }, [params]);

  // Модифицируем fetchToursPage
  const fetchToursPage = async ({ pageParam = 1 }) => {
    if (!requestId) return null;

    try {
      const tourResponse = await fetch(
        `${API_BASE_URL}/results/${requestId}?page=${pageParam}`
      );
      const tourData = await tourResponse.json();

      if (tourData.data?.result?.hotel) {
        const newTours = [...allTours, ...tourData.data.result.hotel];
        setAllTours(newTours);
        saveToSession(newTours, requestId, params);
      }

      return tourData.data;
    } catch (error) {
      console.error("Ошибка при загрузке страницы:", error);
      return null;
    }
  };

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["tours", requestId],
    queryFn: fetchToursPage,
    enabled: !!requestId && tourDataStatus?.state === "finished",
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.result?.hotel?.length) return undefined;
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(tourDataStatus?.toursfound / 10);
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialData: () => {
      const savedData = sessionStorage.getItem("searchData");
      if (savedData) {
        const { tours } = JSON.parse(savedData);
        return {
          pages: [{ result: { hotel: tours } }],
          pageParams: [1],
        };
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // Модифицируем startPolling
  const startPolling = useCallback(
    (reqId: string) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 20;

      const intervalId = setInterval(async () => {
        try {
          attempts++;
          const tourResponse = await fetch(
            `${API_BASE_URL}/results/${reqId}?page=1`
          );
          const tourData = await tourResponse.json();

          if (tourData.data?.result?.hotel) {
            setTours(tourData.data.result.hotel);
            setAllTours(tourData.data.result.hotel);
            saveToSession(tourData.data.result.hotel, reqId, params);

            // Обновляем кэш React Query
            queryClient.setQueryData(["tours", reqId], {
              pages: [{ result: { hotel: tourData.data.result.hotel } }],
              pageParams: [1],
            });

            setLoading(false);
          }

          if (
            tourData.data?.status?.state === "finished" ||
            attempts >= MAX_ATTEMPTS
          ) {
            setTourDataStatus(tourData.data.status);
            clearInterval(intervalId);
            setLoading(false);
          }
        } catch (error) {
          console.error("Ошибка при запросе:", error);
          setError("Ошибка при получении туров");
          clearInterval(intervalId);
          setLoading(false);
        }
      }, POLL_INTERVAL);
    },
    [params, saveToSession, queryClient]
  );

  // Добавляем функцию для загрузки следующей страницы
  const loadNextPage = useCallback(async () => {
    if (isFetchingNextPage) return;
    setCurrentPage((prev) => prev + 1);
    await fetchNextPage();
  }, [fetchNextPage, isFetchingNextPage]);

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

  return (
    <DataContext.Provider
      value={{
        params,
        requestId,
        tours: allTours,
        loading,
        error,
        tourDataStatus,
        setData,
        cities,
        countries,
        searchTours,
        fetchNextPage: loadNextPage,
        hasNextPage,
        isFetchingNextPage,
        favoriteTours,
        addToFavorite,
        removeFromFavorite,
        isFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
