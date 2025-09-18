import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import plane_departure from "../../assets/plane_departure.svg";
import { departures } from "../data/destinations";

export default function NewDepartureCity() {
  const { setData, params } = useContext(DataContext);
  const [selectedCity, setSelectedCity] = useState(params.param1 || "80"); // Изменение здесь
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // При монтировании проверяем наличие города в URL
  useEffect(() => {
    if (params.param1) {
      const cityExists = departures.some(
        (city) => String(city.id) === params.param1
      );
      if (cityExists) {
        setSelectedCity(params.param1);
      }
    }
  }, [params.param1]); // Добавляем зависимость

  useEffect(() => {
    setData("param1", selectedCity);
  }, [selectedCity, setData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: any) => {
    setSelectedCity(String(city.id));
    setIsOpen(false);
  };

  const selectedCityData = departures.find(
    (city) => String(city.id) === selectedCity
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-7 py-1 border border-[#DBE0E5] rounded-lg bg-white hover:bg-gray-50 duration-300 w-[200px]"
      >
        <img src={plane_departure} alt="plane_departure" className="w-6 h-6" />
        <div className="flex flex-col justify-between flex-1">
          <span className="text-sm font-normal text-[#7E8389]">
            Город вылета
          </span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {selectedCityData?.name}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-[#DBE0E5] z-10">
          {departures.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className={`w-full text-left px-4 pr-10 py-2 hover:bg-gray-50 duration-300
                ${selectedCity === String(city.id) ? "bg-orange-100" : ""}
              `}
            >
              <span className="text-[#2E2E32] text-base">{city.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
