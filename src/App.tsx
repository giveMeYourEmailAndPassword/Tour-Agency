import { useContext } from "react";
import { useLocation } from "react-router-dom";
import HeaderFilters from "./components/HeaderFilters";
import FiltersMobile from "./components/FiltersMobile";
import { DataContext } from "./components/DataProvider";
import { useSearchParams } from "./Hooks/useSearchParams";
import Header from "./components/Header";
import HotTours from "./components/HotTours";

export default function App() {
  useContext(DataContext);
  useLocation();

  useSearchParams();

  return (
    <div className={`min-h-screen flex flex-col md:bg-white bg-gray-100`}>
      <Header />
      <div className="hidden md:flex flex-col items-center gap-4 mt-8">
        <h1 className="text-2xl md:text-5xl font-semibold">Найти туры</h1>
        <p className="text-sm md:text-xl text-gray-500">
          Лучшие предложения для вашего отдыха по выгодным ценам
        </p>
        <HeaderFilters onSearch={() => {}} />
      </div>

      <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="md:block hidden mt-4">
            <div className="flex items-start">
              <div className="ml-2 flex-col pb-4 mt-8 w-full">
                <HotTours />
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <FiltersMobile />
            <div className="mx-2 flex-grow">
              <HotTours />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
