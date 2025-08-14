import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import MobileDepartureCity from "./filters/mobileFilters/MobileDepartureCity";
import MobileFlyingDate from "./filters/mobileFilters/MobileFlyingDate";
import MobileTourist from "./filters/mobileFilters/MobileTourist";
import MobileNightsFrom from "./filters/mobileFilters/MobileNightsFrom";
import MobileStarsFilter from "./filters/mobileFilters/MobileStarsFilter";
import MobileFlyingCountry from "./filters/mobileFilters/MobileFlyingCountry";
import MobileOtherFilters from "./filters/mobileFilters/otherFilters/MobileOtherFilters";

export default function FiltersMobile() {
  const [isOtherFiltersOpen, setIsOtherFiltersOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 p-3">
      <div className="flex flex-col gap-2">
        {/* Город вылета */}
        <MobileDepartureCity />

        {/* Страна, город */}
        <MobileFlyingCountry />

        {/* Даты вылета */}
        <MobileFlyingDate />

        {/* Туристы */}
        <MobileTourist />

        {/* Ночей и Звезд */}
        <div className="flex gap-1">
          <MobileNightsFrom />
          <MobileStarsFilter />
        </div>

        {/* Дополнительные фильтры */}
        <MobileOtherFilters />

        {/* Кнопка поиска */}
        <button className="w-full flex justify-center items-center gap-2 py-3 px-6 bg-[#FF621F] rounded-lg">
          <span className="text-lg font-medium text-white">Найти туры</span>
          <FiSearch className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
