import { useState, useEffect, useContext } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import FiltersMobile from "./components/FiltersMobile";
import SearchResults from "./components/SearchResults";
import { DataContext } from "./components/DataProvider";

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const { searchTours, tours, params } = useContext(DataContext);
  const [isFetching, setIsFetching] = useState(false);

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
    console.log("Проверка параметров:", params);
    if (areParamsReady(params) && !isFetching) {
      console.log("Параметры готовы, выполняем запрос");
      setIsFetching(true); // Устанавливаем состояние, что запрос начался
      searchTours()
        .then(() => {
          console.log("Поиск завершен");
          setShowResults(true);
        })
        .catch((error) => {
          console.error("Ошибка при выполнении поиска туров:", error);
        })
        .finally(() => {
          setIsFetching(false); // Сбрасываем состояние после завершения запроса
        });
    } else {
      console.log(
        "Параметры не готовы или запрос уже выполняется, запрос не выполнен"
      );
    }
  }, [params, searchTours]); // Убедитесь, что isFetching не является зависимостью

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={() => setShowResults(true)} />

      {/* Секция с белым фоном */}
      <div className="w-full mt-1 md:mt-0 bg-white">
        <div className="max-w-[1560px] mx-auto">
          {/* Фильтры и результаты поиска */}
          <div className="md:block hidden mt-4">
            <div className="flex items-start">
              <Filters />
              {showResults && tours.length > 0 ? (
                <SearchResults />
              ) : (
                <div className="flex-1 p-8 text-center">
                  <h2 className="text-2xl font-semibold text-[#2E2E32] mb-4">
                    Это тестовая демка
                  </h2>
                  <p className="text-[#6B7280]">
                    Для начала выберите параметры поиска и нажмите кнопку поиска
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <FiltersMobile />
          </div>
        </div>
      </div>
    </div>
  );
}
