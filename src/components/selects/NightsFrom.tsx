import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../DataProvider";
import { FaMoon } from "react-icons/fa";

const NIGHTS = [5, 7, 9, 11, 14, 16];
const MIN_NIGHTS = 5;
const MAX_NIGHTS = 16;

export default function NightsFrom() {
  const { setData } = useContext(DataContext);
  const [selectedNights, setSelectedNights] = useState(7);
  const [isOpen, setIsOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState([7, 9]);
  const [isDragging, setIsDragging] = useState<null | "start" | "end">(null);
  const dropdownRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    setData("param3", { start: sliderValue[0], end: sliderValue[1] });
  }, [sliderValue, setData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const width = rect.width;
      const left = rect.left;
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - left) / width) * 100)
      );
      const nightValue = Math.round(
        (percentage * (MAX_NIGHTS - MIN_NIGHTS)) / 100 + MIN_NIGHTS
      );

      setSliderValue((prev) => {
        if (isDragging === "start") {
          return [
            Math.max(MIN_NIGHTS, Math.min(nightValue, prev[1] - 1)),
            prev[1],
          ];
        } else {
          return [
            prev[0],
            Math.min(MAX_NIGHTS, Math.max(nightValue, prev[0] + 1)),
          ];
        }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNightSelect = (night) => {
    setSelectedNights(night);
    // Устанавливаем диапазон с учетом границ
    const start = Math.max(MIN_NIGHTS, night - 2);
    const end = Math.min(MAX_NIGHTS, night + 2);
    setSliderValue([start, end]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-6 py-1 border border-[#DBE0E5] rounded-lg min-w-[180px] bg-white hover:bg-gray-50 duration-300 w-[190px]"
      >
        <FaMoon className="text-[#FF621F] w-6 h-6 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-normal text-[#7E8389]">Ночей</span>
          <span className="text-lg font-medium text-[#2E2E32]">
            {sliderValue[0] === sliderValue[1]
              ? `${sliderValue[0]} ночей`
              : `${sliderValue[0]}-${sliderValue[1]} ночей`}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[234px] bg-white rounded-lg shadow-lg border border-[#DBE0E5] p-5">
          {/* Слайдер */}
          <div className="relative h-6 mb-8" ref={sliderRef}>
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-[#DBE0E5] rounded-lg">
              <div
                className="absolute h-full bg-[#FF621F] rounded-lg"
                style={{
                  left: `${
                    ((sliderValue[0] - MIN_NIGHTS) * 100) /
                    (MAX_NIGHTS - MIN_NIGHTS)
                  }%`,
                  width: `${
                    ((sliderValue[1] - sliderValue[0]) * 100) /
                    (MAX_NIGHTS - MIN_NIGHTS)
                  }%`,
                }}
              />
            </div>
            {/* Ползунки */}
            <button
              onMouseDown={() => setIsDragging("start")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center border border-[#DBE0E5] hover:border-[#FF621F] transition-colors"
              style={{
                left: `${
                  ((sliderValue[0] - MIN_NIGHTS) * 100) /
                  (MAX_NIGHTS - MIN_NIGHTS)
                }%`,
              }}
            >
              <div className="flex flex-col gap-[2px]">
                <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
              </div>
            </button>
            <button
              onMouseDown={() => setIsDragging("end")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center border border-[#DBE0E5] hover:border-[#FF621F] transition-colors"
              style={{
                left: `${
                  ((sliderValue[1] - MIN_NIGHTS) * 100) /
                  (MAX_NIGHTS - MIN_NIGHTS)
                }%`,
              }}
            >
              <div className="flex flex-col gap-[2px]">
                <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
                <div className="w-[2px] h-[6px] bg-[#DBE0E5]" />
              </div>
            </button>
          </div>

          {/* Кнопки выбора количества ночей */}
          <div className="grid grid-cols-2 gap-2">
            {NIGHTS.map((night) => (
              <button
                key={night}
                onClick={() => handleNightSelect(night)}
                className={`py-2 px-3 text-lg font-medium rounded-[30px] border transition-colors
                  ${
                    night === selectedNights
                      ? "border-[#FF621F] text-[#2E2E32]"
                      : "border-[#DBE0E5] text-[#2E2E32] hover:border-[#FF621F]"
                  }`}
              >
                {night} дней
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
