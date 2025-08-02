import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import { FaMapMarkerAlt } from "react-icons/fa";

const COUNTRIES = [
  {
    id: 4,
    name: "Турция",
  },
  {
    id: 1,
    name: "Египет",
  },
  {
    id: 2,
    name: "Таиланд",
  },
  {
    id: 9,
    name: "ОАЭ",
  },
  {
    id: 8,
    name: "Мальдивы",
  },
];

export default function NewFlyingCountry() {
  const { setData } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState(4); // По умолчанию Турция
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setData("param2", selectedCountry);
  }, [selectedCountry, setData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.id);
    setIsOpen(false);
  };

  const selectedCountryData = COUNTRIES.find(
    (country) => country.id === selectedCountry
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px] bg-white hover:bg-gray-50 duration-300"
      >
        <FaMapMarkerAlt className="text-[#FF621F] w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal text-[#7E8389]">
            Страна, город
          </span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {selectedCountryData?.name}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-[#DBE0E5] z-10">
          {COUNTRIES.map((country) => (
            <button
              key={country.id}
              onClick={() => handleCountrySelect(country)}
              className={`w-full text-left px-4 pr-10 py-2 hover:bg-gray-50 duration-300
                ${
                  selectedCountry === country.id
                    ? "bg-orange-100 font-medium"
                    : ""
                }
              `}
            >
              <span className="text-[#2E2E32] text-base">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
