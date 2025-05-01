import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type Params = { [key: string]: any };
type City = { id: string; label: string };
type Countries = { id: string; label: string };
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
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const DataContext = createContext<DataContextType>(
  {} as DataContextType
);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState<Params>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [tourDataStatus, setTourDataStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [countries, setCountries] = useState<
    Array<{ id: string; label: string }>
  >([]);

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

  // Добавим сохранение всех важных данных в sessionStorage
  const saveToSession = useCallback(
    (tours: any[], requestId: string | null, params: Params) => {
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          tours,
          requestId,
          params,
          timestamp: Date.now(), // добавим timestamp для возможной проверки актуальности данных
        })
      );
    },
    []
  );

  // Добавим загрузку данных из sessionStorage
  const loadFromSession = useCallback(() => {
    const savedData = sessionStorage.getItem("searchData");
    if (savedData) {
      const { tours, requestId, params, timestamp } = JSON.parse(savedData);
      setTours(tours);
      setRequestId(requestId);
      setParams(params);
    }
  }, []);

  // Добавим новую функцию для поиска туров
  const searchTours = useCallback(async () => {
    if (!areParamsReady(params)) {
      return;
    }

    setLoading(true);
    setError(null);
    setTours([]);

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

  // Модифицируем функцию startPolling
  const startPolling = useCallback(
    (reqId: string) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 20;

      const intervalId = setInterval(async () => {
        try {
          attempts++;
          const tourResponse = await fetch(
            `${API_BASE_URL}/results/${reqId}?onpage=12`
          );
          const tourData = await tourResponse.json();

          if (tourData.data?.result?.hotel) {
            setTours(tourData.data.result.hotel);
            // Сохраняем в sessionStorage при каждом обновлении туров
            saveToSession(tourData.data.result.hotel, reqId, params);
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
    [params, saveToSession]
  );

  // Загружаем сохраненные данные при монтировании компонента
  useEffect(() => {
    loadFromSession();
  }, [loadFromSession]);

  return (
    <DataContext.Provider
      value={{
        params,
        requestId,
        tours,
        loading,
        error,
        tourDataStatus,
        setData,
        cities,
        countries,
        searchTours,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
