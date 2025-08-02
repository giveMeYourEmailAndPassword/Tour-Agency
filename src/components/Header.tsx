import { FiSearch } from "react-icons/fi";
import {
  FaPlane,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaMoon,
  FaStar,
} from "react-icons/fa";
import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import NightsFrom from "./selects/NightsFrom";

export default function Header() {
  return (
    <header className="bg-white shadow-[0px_0px_16px_0px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center justify-center gap-2">
        {/* Город вылета */}
        <NewDepartureCity />

        {/* Страна, город */}
        <NewFlyingCountry />

        {/* Даты вылета */}
        <div className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px]">
          <FaCalendarAlt className="text-[#FF621F] w-6 h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-normal text-[#7E8389]">
              Даты вылета
            </span>
            <span className="text-lg font-medium text-[#2E2E32]">
              7 августа
            </span>
          </div>
        </div>

        {/* Туристы */}
        <div className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px]">
          <FaUserFriends className="text-[#FF621F] w-6 h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-normal text-[#7E8389]">Туристы</span>
            <span className="text-lg font-medium text-[#2E2E32]">
              2 взрослых
            </span>
          </div>
        </div>

        {/* Ночей */}
        <NightsFrom />

        {/* Звезд */}
        <div className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px]">
          <FaStar className="text-[#FF621F] w-6 h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-normal text-[#7E8389]">Звезд</span>
            <span className="text-lg font-medium text-[#2E2E32]">
              1-5 звезд
            </span>
          </div>
        </div>

        {/* Поиск */}
        <button className="w-[60px] h-[60px] flex items-center justify-center border border-[#FF621F] bg-[#FF621F] rounded-lg">
          <FiSearch className="w-8 h-8 text-[#FAFBF6]" />
        </button>
      </div>
    </header>
  );
}
