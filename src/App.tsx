import Header from "./components/Header";
import Filters from "./components/Filters";
import { useState, useRef } from "react";
import FiltersMobile from "./components/FiltersMobile";
import SearchResults from "./components/SearchResults";

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const hotToursRef = useRef(null);

  const scrollToHotTours = (e) => {
    e.preventDefault();
    hotToursRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
              {showResults && <SearchResults />}
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
