import React, { useState, useContext } from "react";
import { DataContext } from "../DataProvider";

const RATINGS = [
  { value: "0", label: "Любой" },
  { value: "2", label: "3,0 и более" },
  { value: "3", label: "3,5 и более" },
  { value: "4", label: "4,0 и более" },
  { value: "5", label: "4,5 и более" },
];

export default function Raiting() {
  const { setData, params } = useContext(DataContext);
  const [selectedValue, setSelectedValue] = useState(
    () => params.param8?.[0] || "0"
  );

  const handleChange = (value: string) => {
    // Если выбрано текущее значение, не делаем ничего
    if (selectedValue === value) {
      return;
    }

    setSelectedValue(value);
    setData("param8", [value]); // Передаем значение как массив
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[#2E2E32] text-base font-semibold">Рейтинг</span>
      <div className="flex flex-col gap-0.5">
        {RATINGS.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedValue === value
                  ? "bg-[#FF621F] border-[#FF621F]"
                  : "border-[#7E8389]"
              }`}
              onClick={() => handleChange(value)}
            >
              {selectedValue === value && (
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
    </div>
  );
}
