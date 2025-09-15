import { useState, useContext } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import HeaderFilters from "./components/HeaderFilters";
import Filters from "./components/Filters";
import FiltersMobile from "./components/FiltersMobile";
import { DataContext } from "./components/DataProvider";
import { useSearchParams } from "./Hooks/useSearchParams";
import Header from "./components/Header";
import HotTours from "./components/HotTours";

export default function App() {
  const { params } = useContext(DataContext);
  const location = useLocation();

  useSearchParams();

  return (
    <div className={`min-h-screen flex flex-col md:bg-white bg-gray-100`}>
      <Header />
      <div className="hidden md:block">
        <HeaderFilters />
      </div>

      <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="md:block hidden mt-4">
            <div className="flex items-start">
              <div className="ml-2 flex-grow pb-4">
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
