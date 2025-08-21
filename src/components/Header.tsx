import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import StarsFilter from "./selects/StarsFilter";
import Tourists from "./selects/Tourists";
import FindTourBtn from "./selects/FindTour";
import NewFlyingDate from "./selects/NewFlyingDate";

interface HeaderProps {
  onSearch: () => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1332px] mx-auto">
        {/* Мобильная версия */}
        <div className="md:hidden px-4 py-3">
          <h1 className="text-2xl font-semibold">Кругосвет</h1>
        </div>

        {/* Десктопная версия */}
        <div className="hidden md:flex items-center justify-between gap-2 px-6 py-4 w-full">
          <NewDepartureCity />
          <NewFlyingCountry />
          <NewFlyingDate />
          <NightsFrom />
          <StarsFilter />
          <Tourists />
          <FindTourBtn onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}
