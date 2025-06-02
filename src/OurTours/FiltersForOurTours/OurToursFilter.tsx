import { useContext } from "react";
import { DataContext } from "../../components/DataProvider";
import NewDepartureCityOT from "./Filters/NewDepartureCityOT";
import NewFlyingCountryOT from "./Filters/NewFlyingCountryOT";
import NewFlyingDateOT from "./Filters/NewFlyingDateOT";
import NightsFromOT from "./Filters/NightsFromOT";
import TouristsOT from "./Filters/TouristsOT";
import FindTourBtn from "../../components/selects/FindTour";
import StarsFilterOT from "./Filters/StarsFilterOT";
import HotelTypeOT from "./Filters/HotelTypeOT";
import NourishmentOT from "./Filters/NourushmentOT";
import NourishmentOTT from "./Filters/RaitingOT";
import HotelServiceOT from "./Filters/HotelServiceOT";

export default function OurToursFilters() {
  const { countries } = useContext(DataContext);

  if (countries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-12 xl:px-36">
      <div className="bg-blue-600 rounded-xl w-full md:py-4 gap-3 flex flex-col items-center justify-center px-4">
        {/* Основные фильтры */}
        <div className="flex lg:flex-row bg-white rounded-lg p-2 gap-3 justify-between items-center w-full">
          {/* Город вылета */}
          <NewDepartureCityOT />
          <div className="border border-l h-14"></div>
          {/* Страна */}
          <NewFlyingCountryOT />
          <div className="border border-l h-14"></div>
          {/* Дата вылета */}
          <NewFlyingDateOT />
          <div className="border border-l h-14"></div>
          {/* На сколько ночей */}
          <NightsFromOT />
          <div className="border border-l h-14"></div>
          {/* Туристы */}
          <TouristsOT />
          {/* Кнопка поиска */}
          <FindTourBtn />
        </div>

        <div className="flex justify-between w-full">
          {/* Звездность */}
          <StarsFilterOT />

          {/* Тип отеля */}
          <HotelTypeOT />

          {/* Питание */}
          <NourishmentOT />

          {/* Рейтинг */}
          <NourishmentOTT />

          {/* Услуги отеля */}
          <HotelServiceOT />
        </div>
      </div>
    </div>
  );
}
