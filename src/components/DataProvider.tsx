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
        const response = await fetch(
          "https://tourvisor.ru/xml/list.php?type=departure&authlogin=Ikram.kv@gmail.com&authpass=YkCfsYMj4322"
        );
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
      if (!params.param1) return; // Если не выбран город, ничего не делать
      try {
        const response = await fetch(
          `https://tourvisor.ru/xml/list.php?type=country&cndep=${params.param1}&authlogin=Ikram.kv@gmail.com&authpass=YkCfsYMj4322`
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

  // Генерация requestId, если заданы необходимые параметры
  useEffect(() => {
    if (
      !params.param1 ||
      !params.param2 ||
      !params.param4?.startDate ||
      !params.param4?.endDate
    ) {
      return;
    }

    const generateRequestId = async () => {
      setLoading(true);
      setError(null);

      try {
        const paramsToGet = new URLSearchParams({
          authlogin: import.meta.env.VITE_AUTH_LOGIN || "",
          authpass: import.meta.env.VITE_AUTH_PASS || "",
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
          format: "json",
          currency: "1",
        });

        const requestResponse = await fetch(
          `https://tourvisor.ru/xml/search.php?${paramsToGet.toString()}`
        );
        const requestData = await requestResponse.json();

        if (requestData.result?.requestid) {
          setRequestId(requestData.result.requestid);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        setError("Ошибка при загрузке данных");
        setLoading(false);
      }
    };

    generateRequestId();
  }, [params]);

  // Опрос результатов по requestId
  useEffect(() => {
    if (!requestId) return;

    let intervalId: NodeJS.Timeout | null = null;

    const fetchTours = async () => {
      try {
        const tourResponse = await fetch(
          `https://tourvisor.ru/xml/result.php?authlogin=${
            import.meta.env.VITE_AUTH_LOGIN
          }&authpass=${
            import.meta.env.VITE_AUTH_PASS
          }&requestid=${requestId}&onpage=12&format=json`
        );
        const tourData = await tourResponse.json();
        const status = tourData.data?.status;

        if (tourData.data?.result?.hotel) {
          setTours(tourData.data.result.hotel);
          setLoading(false); // Убираем загрузку, как только получили первые отели
        }

        // Останавливаем опрос только когда поиск завершен
        if (status?.state === "finished") {
          setTourDataStatus(status);
          clearInterval(intervalId as NodeJS.Timeout);
        }
      } catch (error) {
        console.error("Ошибка при запросе:", error);
        setError("Ошибка при получении туров");
        clearInterval(intervalId as NodeJS.Timeout);
        setLoading(false);
      }
    };
    intervalId = setInterval(fetchTours, 1500);
    fetchTours();

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
