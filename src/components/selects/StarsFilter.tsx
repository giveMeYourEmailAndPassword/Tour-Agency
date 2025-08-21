import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import star from "../../assets/star.svg";

const STARS = [
  { id: 0, name: "1-5 звезд", value: [1, 2, 3, 4, 5] },
  { id: 1, name: "1 звезда", value: [1] },
  { id: 2, name: "2 звезды", value: [2] },
  { id: 3, name: "3 звезды", value: [3] },
  { id: 4, name: "4 звезды", value: [4] },
  { id: 5, name: "5 звезд", value: [5] },
];

export default function StarsFilter() {
  const { setData, params } = useContext(DataContext);

  // Инициализируем звезды с учетом параметров URL
  const [selectedStars, setSelectedStars] = useState<number[]>(() => {
    if (params.param9) {
      return Array.isArray(params.param9) ? params.param9 : [params.param9];
    }
    return [1, 2, 3, 4, 5]; // значения по умолчанию
  });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Добавляем эффект для отслеживания изменений из URL
  useEffect(() => {
    if (params.param9) {
      const newStars = Array.isArray(params.param9)
        ? params.param9
        : [params.param9];
      if (JSON.stringify(newStars) !== JSON.stringify(selectedStars)) {
        setSelectedStars(newStars);
      }
    }
  }, [params.param9]);

  useEffect(() => {
    setData("param9", selectedStars);
  }, [selectedStars, setData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStarsSelect = (stars: any) => {
    setSelectedStars(stars.value);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedStars.length === 5) return "1-5 звезд";
    if (selectedStars.length === 1)
      return `${selectedStars[0]} звезд${selectedStars[0] === 1 ? "а" : "ы"}`;
    return `${selectedStars.join(", ")} звезды`;
  };

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
            {getDisplayText()}
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
                ${
                  JSON.stringify(selectedStars) === JSON.stringify(stars.value)
                    ? "bg-orange-100"
                    : ""
                }
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
