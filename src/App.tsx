import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Header from "./components/Header";
import Filters from "./components/Filters";
import FiltersMobile from "./components/FiltersMobile";
import SearchResults from "./components/SearchResults";
import { DataContext } from "./components/DataProvider";
import { Skeleton } from "@heroui/react";
import { useSearchParams } from "./Hooks/useSearchParams";

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const { searchTours, tours, params, searchInProgress } =
    useContext(DataContext); // добавляем searchInProgress
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const navigationType = useNavigationType();
  const location = useLocation();

  useSearchParams();

  // Функция для проверки готовности параметров
  const areParamsReady = (params) => {
    return (
      params.param1 &&
      params.param2 &&
      params.param4?.startDate &&
      params.param4?.endDate
    );
  };

  useEffect(() => {
    // Если мы вернулись назад и у нас есть туры или поиск в процессе
    if (navigationType === "POP" && (tours.length > 0 || searchInProgress)) {
      setShowResults(true);
      return; // Прерываем выполнение, чтобы не начинать новый поиск
    }

    // Если это первая загрузка страницы или прямой переход
    if (
      isInitialSearch &&
      areParamsReady(params) &&
      location.pathname === "/" // Проверяем, что мы на главной странице
    ) {
      setIsInitialSearch(false);
      setIsFetching(true);
      searchTours()
        .then(() => {
          setShowResults(true);
        })
        .catch((error) => {
          console.error("Ошибка при выполнении поиска туров:", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [
    isInitialSearch,
    params,
    searchTours,
    navigationType,
    location.pathname,
    tours.length,
    searchInProgress,
  ]);

  return (
    <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
      <Header onSearch={() => setShowResults(true)} />

      {/* Секция с белым фоном */}
      <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
        <div className="max-w-[1560px] mx-auto">
          {/* Фильтры и результаты поиска */}
          <div className="md:block hidden mt-4">
            <div className="flex items-start">
              <Filters />
              {showResults && tours.length > 0 ? (
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
                            <Skeleton className="w-20 h-7" />
                            <div className="flex flex-col items-end gap-1">
                              <Skeleton className="w-32 h-4" />
                              <Skeleton className="w-24 h-4" />
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
          <div className="block md:hidden">
            <FiltersMobile />
            {showResults && tours.length > 0 ? (
              <SearchResults />
            ) : (
              <div className="mx-2 flex-grow">
                <div className="grid grid-cols-1 gap-2">
                  {[...Array(12)].map((_, index) => (
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
                          <Skeleton className="w-20 h-7" />
                          <div className="flex flex-col items-end gap-1">
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="w-24 h-4" />
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
    </div>
  );
}
