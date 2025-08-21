import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../components/DataProvider";
import { Skeleton } from "@heroui/react";
import Header from "../../components/Header";
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
  } = useContext(DataContext);

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
        <Header />
        <div className="w-full bg-blue-500 mt-4">
          <div className="max-w-[1560px] mx-auto mb-8">
            <div className="flex flex-col gap-12 h-96 pt-12">
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-semibold md:font-bold max-w-[80rem] px-4 md:px-36">
                {title}
              </h1>
            </div>
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
      <Header />
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
                          <div className="flex flex-col items-end gap-1">
                            <Skeleton className="w-32 h-[11px]" />
                            <Skeleton className="w-24 h-3" />
                          </div>
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
