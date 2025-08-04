import React from "react";
import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import StarsFilter from "./selects/StarsFilter";
import Tourists from "./selects/Tourists";
import FindTourBtn from "./selects/FindTour";
import calendar from "../assets/calendar.svg";

interface HeaderProps {
  onSearch: () => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex items-center justify-between gap-2 px-6 py-4 w-full">
          {/* Город вылета */}
          <NewDepartureCity />

          {/* Страна, город */}
          <NewFlyingCountry />

          {/* Даты вылета */}

          <div className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg w-[200px]">
            <img src={calendar} alt="calendar" className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-normal text-[#7E8389]">
                Даты вылета
              </span>
              <span className="text-lg font-medium text-[#2E2E32]">
                7 августа
              </span>
            </div>
          </div>

          {/* Ночей */}

          <NightsFrom />

          {/* Звезд */}

          <StarsFilter />

          {/* Туристы */}

          <Tourists />

          {/* Поиск */}

          <FindTourBtn onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}
