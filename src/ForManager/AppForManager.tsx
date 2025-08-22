import Header from "../components/HeaderFilters";
import { TbPointFilled } from "react-icons/tb";
import HotTours from "../components/HotTours";
import { useState, useRef } from "react";
import FloatingControls from "../components/FloatingControls";
import FiltersMobile from "../components/FiltersMobile";
import FiltersForManager from "./Filters/FiltersForManager";

export default function AppForManager() {
  const [params, setParams] = useState({});
  const hotToursRef = useRef(null);

  const setData = (key, value) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  };

  const scrollToHotTours = (e) => {
    e.preventDefault();
    hotToursRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Секция с синим фоном */}
      <div className="w-full bg-blue-500 mt-1 md:mt-0">
        {/* Навигация - выносим за пределы max-w контейнера */}
        <div className="w-full border-b border-blue-400">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex justify-end gap-1 md:gap-4 pr-4 md:pr-8 lg:pr-12 xl:pr-36 items-center">
              <TbPointFilled className="text-sm text-blue-400" />
              <div
                className="flex items-center justify-center border-b-2 border-blue-500 hover:border-white duration-300
               md:py-4 py-3 hover:cursor-pointer"
              >
                <a
                  className="md:text-base text-sm text-white"
                  href="#hot-tours"
                  onClick={scrollToHotTours}
                >
                  Горящие туры
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="max-w-[1560px] mx-auto">
          <div className="md:pt-10 lg:pt-14 md:pb-28">
            <div className="px-4 md:px-8 lg:px-12 xl:pl-36 mt-6 md:mt-12 mb-3 md:flex flex-col md:gap-4 gap-1 hidden">
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold max-w-[60rem]">
                Для менеджеров
              </h1>
              <h2 className="text-base md:text-xl font-medium text-white">
                Здесь вы можете управлять вашими турами
              </h2>
            </div>

            <div className="md:hidden px-4 md:px-8 lg:px-12 xl:pl-36 mt-6 md:mt-12 mb-2 flex-col md:gap-4 gap-1">
              <h2 className="text-2xl font-bold text-white">Для менеджеров</h2>
            </div>

            {/* Фильтры */}
            <div className="md:block hidden">
              <FiltersForManager />
            </div>
            <div className="block md:hidden">
              <FiltersMobile />
            </div>
          </div>
        </div>
      </div>

      {/* Горящие туры */}
      <div ref={hotToursRef} className="pt-3">
        <HotTours />
      </div>

      <FloatingControls />
    </div>
  );
}
