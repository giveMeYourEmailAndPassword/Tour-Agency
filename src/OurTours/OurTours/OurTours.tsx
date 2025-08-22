import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../../components/DataProvider";
import { Skeleton } from "@heroui/react";
import HeaderFilters from "../../components/HeaderFilters";
import Filters from "../../components/Filters";
import SearchResults from "../../components/SearchResults";
import {
  getCityDeclension,
  getCountryDeclension,
} from "../PronounsOfTheCountry/PronounsOfTheCountry";

export default function OurTours() {
  const {
    tours,
    loading,
    error,
    tourDataStatus,
    cities,
    countries,
    params,
    fetchNextPage,
    isFetchingNextPage,
    searchTours,
    setData,
  } = useContext(DataContext);

  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // Обработка кнопки "назад" - перенаправление в главное меню
  useEffect(() => {
    const handlePopState = () => {
      // Перенаправляем в главное меню при нажатии "назад"
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Эффект для установки параметров и запуска поиска при изменении URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Устанавливаем параметры из URL
    if (searchParams.has("departure"))
      setData("param1", searchParams.get("departure"));
    if (searchParams.has("country"))
      setData("param2", searchParams.get("country"));

    if (searchParams.has("nightsFrom") || searchParams.has("nightsTo")) {
      setData("param3", {
        startDay: searchParams.get("nightsFrom")
          ? parseInt(searchParams.get("nightsFrom")!)
          : undefined,
        endDay: searchParams.get("nightsTo")
          ? parseInt(searchParams.get("nightsTo")!)
          : undefined,
      });
    }

    if (searchParams.has("dateFrom") || searchParams.has("dateTo")) {
      setData("param4", {
        startDate: searchParams.get("dateFrom") || undefined,
        endDate: searchParams.get("dateTo") || undefined,
      });
    }

    if (searchParams.has("adults") || searchParams.has("children")) {
      setData("param5", {
        adults: searchParams.get("adults")
          ? parseInt(searchParams.get("adults")!)
          : 2,
        childrenList: searchParams.get("children")
          ? searchParams.get("children")!.split(",").map(Number)
          : [],
      });
    }

    if (searchParams.has("hotelTypes"))
      setData("param6", searchParams.get("hotelTypes")!.split(","));
    if (searchParams.has("meal"))
      setData("param7", [searchParams.get("meal")!]);
    if (searchParams.has("rating"))
      setData("param8", [searchParams.get("rating")!]);
    if (searchParams.has("stars")) {
      // Правильно парсим параметр stars как массив чисел
      const starsParam = searchParams.get("stars")!;
      const starsArray = starsParam.split(",").map(Number);
      setData("param9", starsArray);
    }
    if (searchParams.has("services"))
      setData("param10", searchParams.get("services")!.split(","));

    // Запускаем поиск только при первом монтировании или если параметры изменились
    if (searchParams.has("departure") && searchParams.has("country")) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        searchTours();
      }
    }
  }, [location.search, setData]);

  // Получаем выбранный город и страну
  const selectedCity =
    cities.find((city) => city.id === params?.param1)?.label || "";
  const selectedCountry =
    countries.find((country) => country.id === params?.param2)?.label || "";

  // Формируем заголовок
  const title = selectedCity
    ? `Туры ${
        selectedCountry && countries.length > 0
          ? `в ${getCountryDeclension(selectedCountry, "to")}`
          : "(Выберите страну)"
      } из ${getCityDeclension(selectedCity, "from")}`
    : "\u00A0".repeat(14);

  // Добавляем состояние для отслеживания попыток поиска
  const [searchAttempts, setSearchAttempts] = useState(0);

  // Добавляем эффект для автоматического перезапуска поиска
  useEffect(() => {
    if (tours.length === 0 && !loading && searchAttempts < 3) {
      const timer = setTimeout(() => {
        setSearchAttempts((prev) => prev + 1);
        searchTours();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [tours.length, loading, searchAttempts]);

  if (error) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        {error}
      </p>
    );
  }

  if (
    tourDataStatus?.state === "finished" &&
    tourDataStatus?.toursfound === 0
  ) {
    return (
      <div className="w-full min-h-screen">
        <HeaderFilters />
        <div className="max-w-[1560px] mx-auto mt-4">
          <div className="flex items-start">
            <Filters />
          </div>
        </div>
        <div className="max-w-[1560px] min-h-[40vh] flex flex-wrap gap-4 p-12 justify-center items-center mx-auto">
          <p className="text-xl text-gray-500 mt-[-80px]">
            По вашему запросу ничего не найдено
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <HeaderFilters />
      <div className="max-w-[1560px] mx-auto mt-4">
        <div className="flex items-start">
          <Filters />
          {tours.length > 0 ? (
            <SearchResults />
          ) : (
            <div className="ml-2 flex-grow pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
                {[...Array(36)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
                  >
                    <div className="w-full flex flex-col gap-2">
                      <Skeleton className="w-full h-36 rounded" />
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex justify-between items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            <Skeleton className="w-24 h-4" />
                          </div>
                          <Skeleton className="w-24 h-4" />
                        </div>
                        <Skeleton className="w-full h-7" />
                        <Skeleton className="w-3/4 h-5" />
                      </div>
                      <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                        <Skeleton className="w-20 h-6" />
                      </div>
                      <div className="w-full flex justify-between items-center">
                        <Skeleton className="w-20 h-3" />
                        <div className="flex flex-col items-end gap-1">
                          <Skeleton className="w-32 h-[11px]" />
                          <Skeleton className="w-24 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
