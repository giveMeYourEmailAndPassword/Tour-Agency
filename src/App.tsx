import Header from "./components/Header";
import Filters from "./components/Filters";
import { useState } from "react";
import FiltersMobile from "./components/FiltersMobile";
import SearchResults from "./components/SearchResults";

export default function App() {
  const [showResults, setShowResults] = useState(false);

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
              {showResults ? (
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
