import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type Params = { [key: string]: any };
type City = { key: string; label: string };
type Countries = { key: string; label: string };
type DataContextType = {
  params: Params;
  requestId: string | null;
  tours: any[];
  loading: boolean;
  error: string | null;
  setData: (key: keyof Params, value: any) => void;
  cities: City[];
  countries: Countries[];
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const DataContext = createContext<DataContextType>(/* ... */);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState<Params>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tours, setTours] = useState<any[]>([]);
  const [tourDataStatus, setTourDataStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{ key: string; label: string }>>(
    []
  );
  const [countries, setCountries] = useState<
    Array<{ key: string; label: string }>
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
  const DEBOUNCE_DELAY = 1000;
  const POLL_INTERVAL = 3000; // Увеличим интервал опроса

  // Создадим отдельную функцию для проверки готовности параметров
  const areParamsReady = (params: Params) => {
    return (
      params.param1 &&
      params.param2 &&
      params.param4?.startDate &&
      params.param4?.endDate
    );
  };

  // Модифицируем useEffect для генерации requestId
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!areParamsReady(params)) {
      return;
    }

    const generateRequestId = async () => {
      setLoading(true);
      setError(null);

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
        }
      } catch (error) {
        console.error("Ошибка:", error);
        setError("Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    // Добавляем дебаунс
    timeoutId = setTimeout(generateRequestId, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [params.param1, params.param2, params.param4]);

  // Модифицируем useEffect для опроса результатов
  useEffect(() => {
    if (!requestId) return;

    let intervalId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // Максимальное количество попыток

    const fetchTours = async () => {
      try {
        attempts++;
        const tourResponse = await fetch(
          `${API_BASE_URL}/results/${requestId}?onpage=12`
        );
        const tourData = await tourResponse.json();
        const status = tourData.data?.status;

        if (tourData.data?.result?.hotel) {
          setTours(tourData.data.result.hotel);
          setLoading(false);
        }

        // Останавливаем опрос если поиск завершен или превышено количество попыток
        if (status?.state === "finished" || attempts >= MAX_ATTEMPTS) {
          setTourDataStatus(status);
          if (intervalId) clearInterval(intervalId);
          setLoading(false);
        }
      } catch (error) {
        console.error("Ошибка при запросе:", error);
        setError("Ошибка при получении туров");
        if (intervalId) clearInterval(intervalId);
        setLoading(false);
      }
    };

    intervalId = setInterval(fetchTours, POLL_INTERVAL);
    fetchTours(); // Первый запрос

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [requestId]);

  // Сохранение туров в localStorage
  useEffect(() => {
    if (tours.length > 0) {
      const savedTours = localStorage.getItem("toursData");
      if (savedTours !== JSON.stringify(tours)) {
        localStorage.setItem("toursData", JSON.stringify(tours));
      }
    }
  }, [tours]);

  // Загрузка туров из localStorage при монтировании
  useEffect(() => {
    const savedTours = localStorage.getItem("toursData");
    if (savedTours) {
      setTours(JSON.parse(savedTours));
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        params,
        requestId,
        tours,
        loading,
        error,
        setData,
        cities,
        countries,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
