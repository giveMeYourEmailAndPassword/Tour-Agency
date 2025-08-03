import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import { FaPlane } from "react-icons/fa";
import { departures } from "../data/destinations";

export default function NewDepartureCity() {
  const { setData } = useContext(DataContext);
  const [selectedCity, setSelectedCity] = useState("80"); // Бишкек по умолчанию
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setData("param1", selectedCity);
  }, [selectedCity, setData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
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
        className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px] bg-white hover:bg-gray-50 duration-300"
      >
        <FaPlane className="text-[#FF621F] w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
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
