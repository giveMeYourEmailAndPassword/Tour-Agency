import Header from "./components/Header";
import Filters from "./components/Filters";
import { TbPointFilled } from "react-icons/tb";
import HotTours from "./components/HotTours";
import { useState } from "react";

export default function App() {
  const [params, setParams] = useState({});

  const setData = (key, value) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  };

  return (
    <>
      <Header />
      <div className="bg-blue-500 flex flex-col">
        <div className="flex gap-4 pl-36 items-center border-b border-blue-400">
          <TbPointFilled className="text-sm text-blue-400" />

          <div
            className="flex items-center border-b-2 border-blue-500 hover:border-white duration-300
           py-4 hover:cursor-pointer"
          >
            <a className="text-base" href="">
              Поиск туров
            </a>
          </div>

          <TbPointFilled className="text-sm text-blue-400" />

          <div
            className="flex items-center border-b-2 border-blue-500 hover:border-white duration-300
           py-4 hover:cursor-pointer"
          >
            <a className="text-base" href="">
              Горящие туры
            </a>
          </div>

          <TbPointFilled className="text-sm text-blue-400" />

          <div
            className="flex items-center border-b-2 border-blue-500 hover:border-white duration-300
           py-4 hover:cursor-pointer"
          >
            <a className="text-base" href="">
              Корзина
            </a>
          </div>
        </div>

        <div className="pt-14 pb-28">
          <div className="bg-blue-500 flex pl-36 mt-12 mb-7 flex-col gap-4">
            <h1 className="text-5xl text-white font-bold w-[60rem]">
              Воплощай свои МЕЧТЫ в реальность вместе с нами
            </h1>
            <h2 className="text-xl font-medium text-white">
              Открывай мир с лёгкостью и вдохновением
            </h2>
          </div>

          {/* компонент */}
          <Filters />
          {/*  */}
        </div>
      </div>

      {/*  */}
      <HotTours />
    </>
  );
}
