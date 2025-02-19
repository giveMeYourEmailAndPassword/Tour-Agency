import { useContext, useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";
import { DataContext } from "../DataProvider";

export default function FlyingCountry() {
  const { setData, countries } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState<string>("4");

  useEffect(() => {
    setData("param2", selectedCountry);
  }, [selectedCountry, setData]);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || "4"; // Извлекаем значение вручную
    console.log("Выбрано значение:", value); // Лог для отладки

    setSelectedCountry(value);
    setData("param2", value); // Обновляем контекст
  };

  return (
    <>
      <Select
        className="w-64 text-6xl "
        label="Страна"
        size="lg"
        classNames={{
          label: "text-lg",
          value: "text-lg font-medium",
          selectorIcon: "text-black",
          trigger: "bg-white shadow-none data-[hover=true]:bg-slate-100",
          listbox: "max-h-52 overflow-y-auto scrollbar-custom", // Ограничиваем высоту списка и включаем прокрутку
          popoverContent: "asdasd",
        }}
        selectedKeys={[selectedCountry]}
        onChange={(value) => handleSelect(value)}
      >
        {countries && countries.length > 0 ? (
          countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.label}
            </SelectItem>
          ))
        ) : (
          <SelectItem key="loading" value="loading">
            Загрузка...
          </SelectItem>
        )}
      </Select>
    </>
  );
}
