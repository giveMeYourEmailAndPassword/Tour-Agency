import React, { useContext, useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import { DataContext } from "../DataProvider";

export default function DepartureCity() {
  const { setData, cities } = useContext(DataContext);
  const [selectedCity, setSelectedCity] = useState<string>("80");

  // При монтировании устанавливаем значение по умолчанию
  useEffect(() => {
    setData("param1", selectedCity);
  }, [selectedCity, setData]);

  // Обработчик выбора города
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Если значение пустое (попытка отмены выбора), подставляем "80"
    const value = event.target.value || "80";
    console.log("Выбрано значение (id):", value);
    setSelectedCity(value);
    setData("param1", value);
  };

  return (
    <div className="w-64">
      <Select
        label="Город вылета"
        size="lg"
        classNames={{
          label: "text-lg",
          value: "text-lg font-medium",
          selectorIcon: "text-black",
          trigger: "bg-white shadow-none data-[hover=true]:bg-slate-100",
        }}
        onChange={handleSelect}
        selectedKeys={[selectedCity]} // контролируемое значение
      >
        {cities && cities.length > 0 ? (
          cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem key="loading" value="loading">
            Загрузка...
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
