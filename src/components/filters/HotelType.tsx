import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../DataProvider";

const HOTEL_TYPES = [
  { value: "any", label: "Любой" },
  { value: "hotel", label: "Отель" },
  { value: "guesthouse", label: "Гостевой дом" },
  { value: "apartments", label: "Апартаменты" },
  { value: "villa", label: "Вилла" },
];

export default function HotelType() {
  const { setData, params } = useContext(DataContext);

  // Инициализируем состояния с учетом параметров URL
  const [selectedValues, setSelectedValues] = useState(
    () => params.param6 || ["any"]
  );
  const [isExpanded, setIsExpanded] = useState(true);

  // Добавляем эффект для отслеживания изменений из URL
  useEffect(() => {
    if (params.param6) {
      const newValues = params.param6;
      if (JSON.stringify(newValues) !== JSON.stringify(selectedValues)) {
        setSelectedValues(newValues);
      }
    }
  }, [params.param6]);

  const handleChange = (value: string) => {
    let newSelectedValues = [...selectedValues];
    if (value === "any") {
      // Если выбирается "Любой", то он единственный в списке
      newSelectedValues = selectedValues.includes("any") ? [] : ["any"];
    } else {
      // Если выбирается другой чекбокс, удаляем "any"
      newSelectedValues = newSelectedValues.filter((v) => v !== "any");

      if (newSelectedValues.includes(value)) {
        // Убираем значение, если оно было выбрано
        newSelectedValues = newSelectedValues.filter((v) => v !== value);
      } else {
        // Добавляем значение, если его ещё нет
        newSelectedValues.push(value);
      }

      // Если ничего не выбрано или выбраны все типы, возвращаем "any"
      if (
        newSelectedValues.length === 0 ||
        newSelectedValues.length === HOTEL_TYPES.length - 1
      ) {
        newSelectedValues = ["any"];
      }
    }

    setSelectedValues(newSelectedValues);
    setData("param6", newSelectedValues);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        className="flex items-center justify-between text-[#2E2E32] text-base font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Тип отеля</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 12.5L10 7.5L5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-0.5">
          {HOTEL_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  selectedValues.includes(value)
                    ? "bg-[#FF621F] border-[#FF621F]"
                    : "border-[#7E8389]"
                }`}
                onClick={() => handleChange(value)}
              >
                {selectedValues.includes(value) && (
                  <svg
                    width="11"
                    height="8"
                    viewBox="0 0 11 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.33301 4L3.99967 6.66667L9.33301 1.33334"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-base text-[#2E2E32]">{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
