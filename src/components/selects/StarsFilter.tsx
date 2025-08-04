import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import star from "../../assets/star.svg";

const STARS = [
  { id: 0, name: "1-5 звeзд" },
  { id: 1, name: "1+ звезда" },
  { id: 2, name: "2+ звезды" },
  { id: 3, name: "3+ звезды" },
  { id: 4, name: "4+ звезды" },
  { id: 5, name: "5 звeзд" },
];

export default function StarsFilter() {
  const { setData } = useContext(DataContext);
  const [selectedStars, setSelectedStars] = useState(0); // По умолчанию "1-5 звёзд"
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setData("param9", selectedStars);
  }, [selectedStars, setData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStarsSelect = (stars) => {
    setSelectedStars(stars.id);
    setIsOpen(false);
  };

  const selectedStarsData = STARS.find((stars) => stars.id === selectedStars);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg bg-white hover:bg-gray-50 duration-300 w-[180px]"
      >
        <img src={star} alt="star" className="w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal text-[#7E8389]">Звезд</span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {selectedStarsData?.name}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-[#DBE0E5] z-10">
          {STARS.map((stars) => (
            <button
              key={stars.id}
              onClick={() => handleStarsSelect(stars)}
              className={`w-full text-left px-4 pr-10 py-2 hover:bg-gray-50 duration-300 flex items-center justify-between
                ${selectedStars === stars.id ? "bg-orange-100" : ""}
              `}
            >
              <span className="text-[#2E2E32] text-base">{stars.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
