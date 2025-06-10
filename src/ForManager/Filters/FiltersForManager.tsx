import NightsFrom from "../../components/selects/NightsFrom";
import Tourists from "../../components/selects/Tourists";
import FindMultyToursBtn from "./FindMultyToursBtn";
import NewFlyingDate from "../../components/selects/NewFlyingDate";
import StarsFilter from "../../components/filters/StarsFilter";
import HotelType from "../../components/filters/HotelType";
import Nourushment from "../../components/filters/Nourishment";
import Raiting from "../../components/filters/Raiting";
import HotelService from "../../components/filters/HotelService";
import NewDepartureCity from "../../components/selects/NewDepartureCity";
import NewFlyingCountry from "../../components/selects/NewFlyingCountry";
import { useEffect } from "react";

export default function FiltersForManager() {
  useEffect(() => {
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
          <FindMultyToursBtn />
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
