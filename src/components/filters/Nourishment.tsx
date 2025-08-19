import React, { useState, useContext } from "react";
import { DataContext } from "../DataProvider";

const NOURISHMENT_TYPES = [
  { value: "2", label: "Любое" },
  { value: "3", label: "Только завтрак (BB)" },
  { value: "4", label: "Завтрак, ужин (HB)" },
  { value: "5", label: "Полный пансион (FB)" },
  { value: "7", label: "Все включено (AL)" },
  { value: "9", label: "Ультра все включено (UAL)" },
];

export default function Nourishment() {
  const { setData, params } = useContext(DataContext);
  const [selectedValues, setSelectedValues] = useState(
    () => params.param7 || ["2"]
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (value: string) => {
    let newSelectedValues: string[];

    // Если кликаем на уже выбранное значение - ничего не делаем
    if (selectedValues[0] === value) {
      return;
    }

    // Всегда устанавливаем только одно значение
    newSelectedValues = [value];

    setSelectedValues(newSelectedValues);
    setData("param7", newSelectedValues);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        className="flex items-center justify-between text-[#2E2E32] text-base font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Питание</span>
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
          {NOURISHMENT_TYPES.map(({ value, label }) => (
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
