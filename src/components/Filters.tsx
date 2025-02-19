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

export default function Filters() {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-600 rounded-xl w-[80%] h-44 gap-3 flex flex-col items-center justify-center px-4">
        <div className="flex bg-white rounded-lg p-2 gap-3 border border-r  items-center w-full">
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

        <div className="flex gap-4">
          <StarsFilter />

          <HotelType />

          <Nourushment />

          <Raiting />

          <HotelService />
        </div>
      </div>
    </div>
  );
}
