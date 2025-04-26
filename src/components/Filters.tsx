import DepartureCity from "./selects/DepartureCity";
import FlyingCountry from "./selects/FlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import Tourists from "./selects/Tourists";
import FindTourBtn from "./selects/FindTour";
import NewFlyingDate from "./selects/NewFlyingDate";
import StarsFilter from "./filters/StarsFilter";
import HotelType from "./filters/HotelType";
import Nourushment from "./filters/Nourishment";
import Raiting from "./filters/Raiting";
import HotelService from "./filters/HotelService";
import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import { useEffect } from "react";

export default function Filters() {
  useEffect(() => {
    // Очищаем sessionStorage при монтировании компонента фильтров
    sessionStorage.removeItem("searchData");
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-12 xl:px-36">
      <div className="bg-blue-600 rounded-xl w-full md:py-4 gap-3 flex flex-col items-center justify-center px-4">
        {/* Основные фильтры */}
        <div className="flex lg:flex-row bg-white rounded-lg p-2 gap-3 justify-between items-center w-full">
          {/* Город вылета */}
          <NewDepartureCity />
          {/* <DepartureCity /> */}
          <div className="border border-l h-14"></div>

          {/* Страна */}
          <NewFlyingCountry />
          {/* <FlyingCountry /> */}
          <div className="border border-l h-14"></div>

          {/* Дата вылета */}
          <NewFlyingDate />
          <div className="border border-l h-14"></div>

          {/* На сколько ночей */}
          <NightsFrom />
          <div className="border border-l h-14"></div>

          {/* Туристы */}
          <Tourists />

          {/* Кнопка поиска */}
          <FindTourBtn />
        </div>

        <div className="flex justify-between w-full">
          {/* Звездность */}
          <StarsFilter />

          {/* Тип отеля */}
          <HotelType />

          {/* Питание */}
          <Nourushment />

          {/* Рейтинг */}
          <Raiting />

          {/* Услуги отеля */}
          <HotelService />
        </div>
      </div>
    </div>
  );
}
