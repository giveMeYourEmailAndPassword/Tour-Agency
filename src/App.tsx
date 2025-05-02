import Header from "./components/Header";
import Filters from "./components/Filters";
import { TbPointFilled } from "react-icons/tb";
import HotTours from "./components/HotTours";
import { useState, useRef } from "react";

export default function App() {
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
      <div className="w-full bg-blue-500">
        {/* Навигация - выносим за пределы max-w контейнера */}
        <div className="w-full border-b border-blue-400">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex justify-end gap-4 md:pr-8 lg:pr-12 xl:pr-36 items-center">
              <TbPointFilled className="text-sm text-blue-400" />
              <div
                className="flex items-center border-b-2 border-blue-500 hover:border-white duration-300
               py-4 hover:cursor-pointer"
              >
                <a
                  className="text-base text-white"
                  href="#hot-tours"
                  onClick={scrollToHotTours}
                >
                  Горящие туры
                </a>
              </div>

              <TbPointFilled className="text-sm text-blue-400" />

              <div
                className="flex items-center border-b-2 border-blue-500 hover:border-white duration-300
               py-4 hover:cursor-pointer"
              >
                <a className="text-base text-white" href="">
                  Корзина
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="max-w-[1560px] mx-auto">
          <div className="pt-14 pb-28">
            <div className="px-4 md:px-8 lg:px-12 xl:pl-36 mt-12 mb-7 flex flex-col gap-4">
              <h1 className="text-4xl lg:text-5xl text-white font-bold max-w-[60rem]">
                Воплощай свои МЕЧТЫ в реальность вместе с нами
              </h1>
              <h2 className="text-xl font-medium text-white">
                Открывай мир с лёгкостью и вдохновением
              </h2>
            </div>

            {/* Фильтры */}
            <Filters />
          </div>
        </div>
      </div>

      {/* Горящие туры */}
      <div ref={hotToursRef}>
        <HotTours />
      </div>
    </div>
  );
}
