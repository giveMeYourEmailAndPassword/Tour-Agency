import React, { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { DataContext } from "../../../components/DataProvider";

export default function NewDepartureCityOT() {
  const { setData, cities, params } = useContext(DataContext);
  const selectedCity = params?.param1 || "0";
  const [isOpen, setIsOpen] = useState(false);

  // Обновляем состояние при изменении параметров в контексте
  useEffect(() => {
    if (params?.param1 !== undefined) {
      setData("param1", params.param1);
    }
  }, [params?.param1]);

  useEffect(() => {
    if (cities.length > 0 && !cities.find((city) => city.id === selectedCity)) {
      setData("param1", cities[1].id);
    }
  }, [cities]);

  // Обработчик выбора города
  const handleCitySelect = (city) => {
    setData("param1", city.id);
    setIsOpen(false);
  };

  // Находим выбранный город по id
  const selectedCityData = cities.find((city) => city.id === selectedCity);

  // Фильтруем список городов, исключая Москву
  const filteredCities = cities.filter((city, index) => index !== 2);

  return (
    <>
      <Popover
        placement="top"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger className="w-64 h-full bg-white hover:bg-slate-100 rounded-xl !z-0 !scale-100 !opacity-100 py-1">
          <Button className="px-4">
            <div className="flex flex-col items-start justify-between w-full">
              {selectedCityData && (
                <span className="text-slate-600 mb-[1px] text-sm">
                  Город вылета
                </span>
              )}
              <div className="flex items-center gap-2">
                <h1
                  className={`text-lg ${
                    selectedCityData
                      ? "text-black font-medium"
                      : "text-slate-600"
                  }`}
                >
                  {selectedCityData ? selectedCityData.label : ""}
                </h1>
              </div>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-44 py-2">
          <div className="flex flex-col gap-1 items-starts w-full">
            {filteredCities && filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  className={`text-black text-lg text-start hover:bg-gray-200 rounded-xl py-1 pl-4 ${
                    selectedCity === city.id ? "font-semibold" : ""
                  }`}
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                >
                  {city.label}
                </button>
              ))
            ) : (
              <button className="text-black text-lg text-start hover:bg-gray-200 rounded-xl py-1 pl-4">
                Загрузка...
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
//
