import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import MobileDepartureCity from "./filters/mobileFilters/MobileDepartureCity";
import MobileFlyingDate from "./filters/mobileFilters/MobileFlyingDate";
import MobileTourist from "./filters/mobileFilters/MobileTourist";

export default function FiltersMobile() {
  const [isOtherFiltersOpen, setIsOtherFiltersOpen] = useState(false);

  return (
    <div className="w-full h-[640px] bg-gray-100 p-3">
      <div className="flex flex-col gap-2">
        {/* Город вылета */}
        <MobileDepartureCity />

        {/* Страна, город */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]">
          <img src="/src/assets/marker.svg" alt="marker" className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-xs font-light text-[#7E8389]">
              Страна, город
            </span>
            <span className="text-base font-medium text-[#2E2E32]">
              Вьетнам, Нячанг
            </span>
          </div>
        </div>

        {/* Даты вылета */}
        <MobileFlyingDate />

        {/* Туристы */}
        <MobileTourist />

        {/* Ночей и Звезд */}
        <div className="flex gap-1">
          <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]">
            <img
              src="/src/assets/moon_stars.svg"
              alt="nights"
              className="w-5 h-5"
            />
            <div className="flex flex-col">
              <span className="text-xs font-light text-[#7E8389]">Ночей</span>
              <span className="text-base font-medium text-[#2E2E32]">
                от 7 до 10
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]">
            <img src="/src/assets/star.svg" alt="stars" className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-xs font-light text-[#7E8389]">Звезд</span>
              <span className="text-base font-medium text-[#2E2E32]">
                1-5 звезд
              </span>
            </div>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <button
          className="w-full flex justify-between items-center py-3"
          onClick={() => setIsOtherFiltersOpen(!isOtherFiltersOpen)}
        >
          <span className="text-lg font-medium text-[#6B7280]">
            Дополнительные фильтры
          </span>
          <img
            src="/src/assets/arrow.svg"
            alt="expand"
            className={`w-6 h-6 transition-transform ${
              isOtherFiltersOpen ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>

        {/* Кнопка поиска */}
        <button className="w-full flex justify-center items-center gap-2 py-3 px-6 bg-[#FF621F] rounded-lg">
          <span className="text-lg font-medium text-white">Найти туры</span>
          <FiSearch className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
