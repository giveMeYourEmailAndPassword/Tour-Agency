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
import Header from "../../components/Header";

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
        <div className="hidden md:block">
          <Header />
        </div>
        <HeaderFilters />
        <div className="max-w-[1440px] mx-auto mt-4">
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
      <div className="hidden md:block">
        <Header />
      </div>
      <HeaderFilters />
      <div className="max-w-[1440px] mx-auto mt-4">
        <div className="flex items-start">
          <div className="w-[400px] flex-shrink-0">
            <Filters />
          </div>
          {tours.length > 0 ? (
            <div className="ml-2 flex-grow pb-4">
              <SearchResults />
              {/* Кнопка "Показать еще туры" для десктопа */}
              {tourDataStatus?.state === "finished" &&
                tours.length < tourDataStatus?.hotelsfound && (
                  <div className="w-full flex justify-center mt-8">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="px-6 py-3 bg-[#FF621F] text-white rounded-lg hover:bg-[#E55A1C] transition-colors disabled:bg-gray-400 w-[200px]"
                    >
                      {isFetchingNextPage ? "Загрузка..." : "Показать еще туры"}
                    </button>
                  </div>
                )}
            </div>
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
