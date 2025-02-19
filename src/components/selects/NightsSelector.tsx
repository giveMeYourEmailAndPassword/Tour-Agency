import React from "react";

export default function NightsSelector() {
  const nights = Array.from({ length: 28 }, (_, i) => i + 1); // Ночи от 1 до 28
  const [selectedNights, setSelectedNights] = React.useState<number[]>([]); // Состояние выбранных ночей

  const toggleNight = (night: number) => {
    setSelectedNights(
      (prev) =>
        prev.includes(night)
          ? prev.filter((n) => n !== night) // Удалить из выбранных, если уже есть
          : [...prev, night] // Добавить в выбранные
    );
  };

  return (
    <div className="p-4">
      <p className="mb-2 font-bold">НОЧЕЙ ОТ:</p>
      <div className="grid grid-cols-7 gap-2">
        {nights.map((night) => (
          <button
            key={night}
            className={`w-12 h-12 flex items-center justify-center rounded-md text-sm font-medium 
              ${
                selectedNights.includes(night)
                  ? "bg-blue-500 text-white" // Выбранная ночь
                  : "bg-blue-100 text-black" // Обычная ночь
              }
              hover:bg-blue-300`}
            onClick={() => toggleNight(night)}
          >
            {night} <span className="text-xs">НОЧИ</span>
          </button>
        ))}
      </div>
    </div>
  );
}
