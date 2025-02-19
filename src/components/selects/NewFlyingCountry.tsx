import React, { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { DataContext } from "../DataProvider";

interface Country {
  id: number;
  label: string;
}

export default function NewFlyingCountry() {
  const { setData, countries } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState<number>(24);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      countries.length > 0 &&
      !countries.find((country) => country.id === selectedCountry)
    ) {
      setSelectedCountry(countries[24].id); // Исправлено
    }
  }, [countries]);

  useEffect(() => {
    setData("param2", selectedCountry);
  }, [selectedCountry, setData]);

  const handleCountrySelect = (country: { id: number; label: string }) => {
    setSelectedCountry(country.id);
    setIsOpen(false);
  };

  const selectedCountryData = countries.find(
    (country: Country) => country.id === selectedCountry
  ); // Исправлено

  return (
    <Popover
      placement="top"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger className="w-64 h-full bg-white hover:bg-slate-100 rounded-xl !z-0 !scale-100 !opacity-100">
        <Button className="px-4">
          <div className="flex flex-col items-start justify-between w-full">
            {selectedCountryData && (
              <span className="text-slate-600 mb-[1px] text-sm">Страна</span>
            )}
            <div className="flex items-center gap-2">
              <h1
                className={`text-lg ${
                  selectedCountryData
                    ? "text-black font-medium"
                    : "text-slate-600"
                }`}
              >
                {selectedCountryData ? selectedCountryData.label : ""}
              </h1>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[50rem] py-2">
        <div className="grid grid-cols-4 gap-1 items-start w-full">
          {countries.length > 0 ? (
            countries.map((country) => (
              <button
                className={`text-black text-lg text-start hover:bg-gray-200 rounded-xl py-1 pl-4 ${
                  selectedCountry === country.id ? "font-semibold" : ""
                }`}
                key={country.id}
                onClick={() => handleCountrySelect(country)}
              >
                {country.label}
              </button>
            ))
          ) : (
            <button className="text-black text-lg text-start hover:bg-gray-200 rounded-xl py-1 pl-4">
              Загрузка..
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
