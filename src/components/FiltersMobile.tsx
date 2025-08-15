import MobileDepartureCity from "./filters/mobileFilters/MobileDepartureCity";
import MobileFlyingDate from "./filters/mobileFilters/MobileFlyingDate";
import MobileTourist from "./filters/mobileFilters/MobileTourist";
import MobileNightsFrom from "./filters/mobileFilters/MobileNightsFrom";
import MobileStarsFilter from "./filters/mobileFilters/MobileStarsFilter";
import MobileFlyingCountry from "./filters/mobileFilters/MobileFlyingCountry";
import MobileOtherFilters from "./filters/mobileFilters/otherFilters/MobileOtherFilters";
import FindTourMobile from "./filters/mobileFilters/FindTourMobile";

export default function FiltersMobile() {
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
        <FindTourMobile />
      </div>
    </div>
  );
}
