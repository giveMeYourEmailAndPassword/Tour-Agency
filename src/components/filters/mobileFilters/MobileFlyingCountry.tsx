import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DataContext } from "../../DataProvider";
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

export default function MobileFlyingCountry() {
  const { setData, countries } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (countries.length > 0) {
      const turkey = countries.find((country) => country.label === "Турция");
      if (turkey) {
        setSelectedCountry(turkey.id);
        setData("param2", turkey.id);
      } else {
        setSelectedCountry(countries[0].id);
        setData("param2", countries[0].id);
      }
    }
  }, [countries, setData]);

  const popularCountries = countries.filter((country) =>
    popularCountryIds.includes(Number(country.id))
  );

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: { id: number; label: string }) => {
    setSelectedCountry(country.id);
    setData("param2", country.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const selectedCountryData = countries.find(
    (country: Country) => country.id === selectedCountry
  );

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        radius="none"
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-t-md md:rounded-t-xl !z-0 !scale-100 !opacity-100 py-1"
      >
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

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery("");
        }}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="h-[85vh] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите страну</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите название страны"
                className="w-full pl-8 pr-8 py-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-base"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <RxCross2 className="text-lg" />
                </button>
              )}
            </div>

            <div className="overflow-y-auto scrollbar-custom2 h-full">
              {!searchQuery && (
                <>
                  <div className="mb-2">
                    <h3 className="text-base font-medium mb-2">Популярное</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {popularCountries.map((country) => (
                        <button
                          key={country.id}
                          onClick={() => handleCountrySelect(country)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl"
                        >
                          <img
                            src={`https://flagcdn.com/${
                              countryCodeMap[country.id]?.toLowerCase() ||
                              "default"
                            }.svg`}
                            alt={country.label}
                            className="w-6 h-4"
                          />
                          <span>{country.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 my-4" />
                </>
              )}

              <div>
                <h3 className="text-base font-medium mb-2">
                  {!searchQuery ? "Все страны" : "Результаты поиска"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect(country)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl"
                    >
                      <img
                        src={`https://flagcdn.com/${
                          countryCodeMap[country.id]?.toLowerCase() || "default"
                        }.svg`}
                        alt={country.label}
                        className="w-6 h-4"
                      />
                      <span>{country.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
