import React, { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { DataContext } from "../DataProvider";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface Country {
  id: number;
  label: string;
}

const countryCodeMap: Record<number, string> = {
  46: "GE", // Абхазия
  31: "AT", // Австрия
  55: "AZ", // Азербайджан
  17: "AD", // Андорра
  88: "AR", // Аргентина
  53: "AM", // Армения
  59: "BH", // Бахрейн
  57: "BY", // Беларусь
  20: "BG", // Болгария
  39: "BR", // Бразилия
  37: "HU", // Венгрия
  90: "VE", // Венесуэла
  16: "VN", // Вьетнам
  38: "DE", // Германия
  6: "GR", // Греция
  54: "GE", // Грузия
  11: "DO", // Доминикана
  1: "EG", // Египет
  30: "IL", // Израиль
  3: "IN", // Индия
  7: "ID", // Индонезия
  29: "JO", // Иордания
  92: "IR", // Иран
  14: "ES", // Испания
  24: "IT", // Италия
  78: "KZ", // Казахстан
  40: "KH", // Камбоджа
  79: "QA", // Катар
  51: "KE", // Кения
  15: "CY", // Кипр
  60: "KG", // Киргизия
  13: "CN", // Китай
  10: "CU", // Куба
  80: "LB", // Ливан
  27: "MU", // Маврикий
  36: "MY", // Малайзия
  8: "MV", // Мальдивы
  50: "MT", // Мальта
  23: "MA", // Марокко
  18: "MX", // Мексика
  81: "MM", // Мьянма
  82: "NP", // Непал
  9: "AE", // ОАЭ
  64: "OM", // Оман
  87: "PA", // Панама
  35: "PT", // Португалия
  47: "RU", // Россия
  93: "SA", // Саудовская Аравия
  28: "SC", // Сейшелы
  58: "RS", // Сербия
  25: "SG", // Сингапур
  43: "SI", // Словения
  2: "TH", // Таиланд
  41: "TZ", // Танзания
  5: "TN", // Тунис
  4: "TR", // Турция
  56: "UZ", // Узбекистан
  26: "PH", // Филиппины
  32: "FR", // Франция
  22: "HR", // Хорватия
  21: "ME", // Черногория
  12: "LK", // Шри-Ланка
  70: "KR", // Южная Корея
  49: "JP", // Япония
  19: "CZ", // Чехия
  45: "NL", // Нидерланды
  74: "BE", // Бельгия
  71: "AL", // Албания
  44: "GB", // Великобритания
  52: "CH", // Швейцария
};

const popularCountryIds = [11, 1, 2, 9, 8, 4, 24];

export default function NewFlyingCountry() {
  const { setData, countries } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Перемещаем объявление popularCountries сюда
  const popularCountries = countries.filter((country) =>
    popularCountryIds.includes(Number(country.id))
  );

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (countries.length > 0) {
      // Ищем Турцию в списке стран
      const turkey = countries.find((country) => country.label === "Турция");
      if (turkey) {
        setSelectedCountry(turkey.id);
      } else {
        // Если Турция не найдена, используем первую страну из списка
        setSelectedCountry(countries[0].id);
      }
    }
  }, [countries]);

  useEffect(() => {
    if (selectedCountry !== null) {
      setData("param2", selectedCountry);
    }
  }, [selectedCountry, setData]);

  useEffect(() => {
    console.log("Все страны:", countries);
    console.log("Популярные страны:", popularCountries);
  }, [countries, popularCountries]);

  const handleCountrySelect = (country: { id: number; label: string }) => {
    setSelectedCountry(country.id);
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const selectedCountryData = countries.find(
    (country: Country) => country.id === selectedCountry
  );

  return (
    <Popover
      placement="top"
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSearchQuery("");
      }}
      key={countries.length}
      shouldCloseOnScroll={false}
    >
      <PopoverTrigger className="w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-md md:rounded-xl !z-0 !scale-100 !opacity-100 py-1">
        <Button className="px-2 md:px-4">
          <div className="flex flex-col items-start justify-between w-full">
            {selectedCountryData && (
              <span className="text-slate-600 mb-[1px] text-xs md:text-sm">
                Страна
              </span>
            )}
            <div className="flex items-center gap-1 md:gap-2">
              {selectedCountryData && (
                <img
                  src={`https://flagcdn.com/${
                    countryCodeMap[selectedCountryData.id]?.toLowerCase() ||
                    "default"
                  }.svg`}
                  alt={selectedCountryData.label}
                  className="w-6 h-4"
                />
              )}
              <h1
                className={`text-base md:text-lg ${
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

      <PopoverContent className="w-full md:w-[34rem] py-2 max-h-96 rounded-md md:rounded-xl">
        <div className="pb-2 pt-1 w-full">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Введите название страны"
              className="w-full pl-8 pr-8 py-1 border-2 border-gray-300 rounded-md md:rounded-xl focus:outline-none focus:border-blue-500 text-base"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <RxCross2 className="text-base md:text-lg" />
              </button>
            )}
          </div>
        </div>

        <div className="items-start w-full overflow-y-auto scrollbar-custom2 pr-2 h-[270px]">
          {!searchQuery && (
            <>
              <div className="flex items-center justify-start w-full pl-2">
                <p className="text-black text-base font-medium">Популярное</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 pb-2">
                {popularCountries.map((country) => (
                  <button
                    className={`text-black text-base text-start hover:bg-gray-200 rounded-md md:rounded-xl py-1 pl-4 ${
                      selectedCountry === country.id ? "font-semibold" : ""
                    }`}
                    key={country.id}
                    onClick={() => {
                      handleCountrySelect(country);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/${
                          countryCodeMap[country.id]?.toLowerCase() || "default"
                        }.svg`}
                        alt={country.label}
                        className="w-6 h-4"
                      />
                      {country.label}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-start w-full pl-2">
            <p className="text-black text-base font-medium">
              {!searchQuery ? "Все страны" : "Результаты поиска"}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  className={`text-black text-base text-start hover:bg-gray-200 rounded-md md:rounded-xl py-1 pl-4 ${
                    selectedCountry === country.id ? "font-semibold" : ""
                  }`}
                  key={country.id}
                  onClick={() => {
                    handleCountrySelect(country);
                    setSearchQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/${
                        countryCodeMap[country.id]?.toLowerCase() || "default"
                      }.svg`}
                      alt={country.label}
                      className="w-6 h-4"
                    />
                    {country.label}
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-2 flex items-center justify-center h-full text-base">
                Страны не найдены
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
