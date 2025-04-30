import React, { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { DataContext } from "../../../components/DataProvider";

interface Country {
  id: string;
  label: string;
}

const countryCodeMap: { [key: string]: string } = {
  "46": "GE", // Абхазия
  "31": "AT", // Австрия
  "55": "AZ", // Азербайджан
  "17": "AD", // Андорра
  "88": "AR", // Аргентина
  "53": "AM", // Армения
  "59": "BH", // Бахрейн
  "57": "BY", // Беларусь
  "20": "BG", // Болгария
  "39": "BR", // Бразилия
  "37": "HU", // Венгрия
  "90": "VE", // Венесуэла
  "16": "VN", // Вьетнам
  "38": "DE", // Германия
  "6": "GR", // Греция
  "54": "GE", // Грузия
  "11": "DO", // Доминикана
  "1": "EG", // Египет
  "30": "IL", // Израиль
  "3": "IN", // Индия
  "7": "ID", // Индонезия
  "29": "JO", // Иордания
  "92": "IR", // Иран
  "14": "ES", // Испания
  "24": "IT", // Италия
  "78": "KZ", // Казахстан
  "40": "KH", // Камбоджа
  "79": "QA", // Катар
  "51": "KE", // Кения
  "15": "CY", // Кипр
  "60": "KG", // Киргизия
  "13": "CN", // Китай
  "10": "CU", // Куба
  "80": "LB", // Ливан
  "27": "MU", // Маврикий
  "36": "MY", // Малайзия
  "8": "MV", // Мальдивы
  "50": "MT", // Мальта
  "23": "MA", // Марокко
  "18": "MX", // Мексика
  "81": "MM", // Мьянма
  "82": "NP", // Непал
  "9": "AE", // ОАЭ
  "64": "OM", // Оман
  "87": "PA", // Панама
  "35": "PT", // Португалия
  "47": "RU", // Россия
  "93": "SA", // Саудовская Аравия
  "28": "SC", // Сейшелы
  "58": "RS", // Сербия
  "25": "SG", // Сингапур
  "43": "SI", // Словения
  "2": "TH", // Таиланд
  "41": "TZ", // Танзания
  "5": "TN", // Тунис
  "4": "TR", // Турция
  "56": "UZ", // Узбекистан
  "26": "PH", // Филиппины
  "32": "FR", // Франция
  "22": "HR", // Хорватия
  "21": "ME", // Черногория
  "12": "LK", // Шри-Ланка
  "70": "KR", // Южная Корея
  "49": "JP", // Япония
  "19": "CZ", // Чехия
  "45": "NL", // Нидерланды
  "74": "BE", // Бельгия
  "71": "AL", // Албания
  "44": "GB", // Великобритания
  "52": "CH", // Швейцария
};

export default function NewFlyingCountryOT() {
  const { setData, countries, params } = useContext(DataContext);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    params?.param2 || null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (params?.param2) {
      setSelectedCountry(params.param2);
    }
  }, [params?.param2]);

  useEffect(() => {
    if (selectedCountry !== null) {
      setData("param2", selectedCountry);
    }
  }, [selectedCountry, setData]);

  useEffect(() => {
    if (
      countries.length > 0 &&
      selectedCountry &&
      !countries.find((country) => country.id === selectedCountry)
    ) {
      setSelectedCountry(null);
    }
  }, [countries]);

  const handleCountrySelect = (country: { id: string; label: string }) => {
    setSelectedCountry(country.id);
    setIsOpen(false);
  };

  const selectedCountryData = countries.find(
    (country: Country) => country.id === selectedCountry
  );

  return (
    <Popover
      placement="top"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      key={countries.length}
    >
      <PopoverTrigger className="w-64 h-full bg-white hover:bg-slate-100 rounded-xl !z-0 !scale-100 !opacity-100 py-1">
        <Button className="px-4">
          <div className="flex flex-col items-start justify-between w-full">
            <span className="text-slate-600 mb-[1px] text-sm">
              {selectedCountryData ? "Страна" : ""}
            </span>
            <div className="flex items-center gap-2">
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
                className={`text-lg ${
                  selectedCountryData
                    ? "text-black font-medium"
                    : "text-slate-600"
                }`}
              >
                {selectedCountryData
                  ? selectedCountryData.label
                  : countries.length === 0
                  ? "Выберите город отправления"
                  : "Выберите страну"}
              </h1>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[43rem] py-2 max-h-96 ">
        <div className="grid grid-cols-3 gap-1 items-start w-full overflow-y-auto scrollbar-custom pr-2">
          {countries.length > 0 ? (
            countries.map((country) => (
              <button
                className={`text-black text-lg text-start hover:bg-gray-200 rounded-xl py-1 pl-4 ${
                  selectedCountry === country.id ? "font-semibold" : ""
                }`}
                key={country.id}
                onClick={() => handleCountrySelect(country)}
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
            <div className="col-span-3 text-center text-slate-600 py-4"></div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
