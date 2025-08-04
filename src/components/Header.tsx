import React from "react";
import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import StarsFilter from "./selects/StarsFilter";
import Tourists from "./selects/Tourists";
import FindTourBtn from "./selects/FindTour";
import calendar from "../assets/calendar.svg";
import NewFlyingDate from "./selects/NewFlyingDate";

interface HeaderProps {
  onSearch: () => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <div className="w-full bg-white">
      <div className="max-w-[1332px] mx-auto">
        <div className="flex items-center justify-between gap-2 px-6 py-4 w-full">
          {/* Город вылета */}
          <NewDepartureCity />

          {/* Страна, город */}
          <NewFlyingCountry />

          {/* Даты вылета */}
          <NewFlyingDate />

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
