import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { BsFire } from "react-icons/bs";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import utensils from "../assets/utensils.svg";
import { destinations } from "./data/destinations";
import GallaryCountries from "./GallaryCountries";
import { getCountryDeclension } from "../utils/getCountryDeclension";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotTours = async ({
  queryKey,
}: {
  queryKey: [string, { country: string | null }];
}) => {
  const [, { country }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/hot-tours`, {
    params: country ? { countries: country } : {},
  });
  return response.data;
};

// Функция для обрезки названия отеля после 2-х слов
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 2) {
    return words.slice(0, 2).join(" ");
  }
  return name;
};

export default function HotTours() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotTours", { country: selectedCountry || null }],
    queryFn: fetchHotTours as any,
    // чтобы не мигала сетка при переключении стран
    keepPreviousData: true,
  });

  const filteredTours = selectedCity
    ? data?.hottours?.tour.filter(
        (tour: any) => tour.departurecode === selectedCity
      )
    : data?.hottours?.tour || [];

  const selectedCountryData = destinations.find(
    (country) => String(country.id) === selectedCountry
  );

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    closeDropdown();
  };

  const openDropdown = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsCountryDropdownOpen(true);

    // Небольшая задержка для плавной анимации
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const closeDropdown = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsCountryDropdownOpen(false);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isCountryDropdownOpen) {
          closeDropdown();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCountryDropdownOpen]);

  if (isLoading) {
    return (
      <div className="flex-grow pb-4">
        <div className="flex flex-col gap-2 md:gap-3  mb-4">
          <div className="flex items-end gap-1">
            <h2 className="text-2xl md:text-3xl font-medium md:font-semibold">
              Горящие туры
              {selectedCity === "80"
                ? " из Бишкека"
                : selectedCity === "60"
                ? " из Алматы"
                : ""}
              {(() => {
                const cn =
                  destinations.find((d) => d.id === selectedCountry)?.name ||
                  "";
                return cn ? ` ${getCountryDeclension(cn, "accusative")}` : "";
              })()}
            </h2>
            <BsFire className="md:text-3xl text-2xl text-orange-500" />
          </div>
          <div className="flex md:gap-2 gap-1">
            <button
              className={`px-5 py-2 rounded-full font-semibold ${
                selectedCity === ""
                  ? "text-white bg-orange-500"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
              onClick={() => setSelectedCity("")}
            >
              Все
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold ${
                selectedCity === "80"
                  ? "text-white bg-orange-500"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
              onClick={() => setSelectedCity("80")}
            >
              из Бишкека
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold ${
                selectedCity === "60"
                  ? "text-white bg-orange-500"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
              onClick={() => setSelectedCity("60")}
            >
              из Алматы
            </button>
          </div>
          {/* Мобильный dropdown для стран */}
          <div className="md:hidden">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={isCountryDropdownOpen ? closeDropdown : openDropdown}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCountry === ""
                    ? "text-white bg-orange-500"
                    : "text-white bg-orange-500"
                }`}
              >
                <span>{selectedCountryData?.name || "Все страны"}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isCountryDropdownOpen ? "rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Анимированный контент */}
              <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isCountryDropdownOpen
                    ? "max-h-96 opacity-100 mt-2"
                    : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <div className="bg-white border border-[#DBE0E5] rounded-lg shadow-lg p-2 space-y-1">
                  {destinations.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect(String(country.id))}
                      className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-orange-50 ${
                        selectedCountry === String(country.id)
                          ? "text-white bg-orange-500"
                          : "text-black hover:text-orange-500"
                      }`}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Десктопные кнопки для стран */}
          <div className="hidden md:flex flex-wrap gap-1 md:gap-2">
            <button
              className={`px-7 py-2 rounded-full font-semibold ${
                selectedCountry === ""
                  ? "text-white bg-orange-500"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
              onClick={() => setSelectedCountry("")}
            >
              Все страны
            </button>
            {destinations.map((d) => (
              <button
                key={d.id}
                className={`px-7 py-2 rounded-full font-semibold ${
                  selectedCountry === d.id
                    ? "text-white bg-orange-500"
                    : "text-black bg-slate-100 text-opacity-50"
                }`}
                onClick={() => setSelectedCountry(d.id)}
                title={d.name}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
            >
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="w-full h-44 md:h-44 rounded" />
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Skeleton className="w-24 h-4" />
                    </div>
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-full h-7" />
                  <Skeleton className="w-3/4 h-5" />
                </div>
                <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                  <Skeleton className="w-20 h-6" />
                </div>
                <div className="w-full flex justify-between items-center">
                  <Skeleton className="w-20 h-2" />
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="w-32 h-2" />
                    <Skeleton className="w-24 h-2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-500">Ошибка загрузки данных.</div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  const getEndDate = (startDate: string, nights: number) => {
    const date = parse(startDate, "dd.MM.yyyy", new Date());
    return format(addDays(date, nights), "d MMMM", { locale: ru });
  };

  // Добавить новую функцию для форматирования периода дат
  const formatDateRange = (startDate: string, nights: number) => {
    const start = parse(startDate, "dd.MM.yyyy", new Date());
    const end = addDays(start, nights);

    const startMonth = format(start, "MMMM", { locale: ru });
    const endMonth = format(end, "MMMM", { locale: ru });

    if (startMonth === endMonth) {
      const startDay = format(start, "d", { locale: ru });
      const endDay = format(end, "d", { locale: ru });
      return `${startDay} - ${endDay} ${startMonth}`;
    } else {
      return `${format(start, "d MMMM", { locale: ru })} - ${format(
        end,
        "d MMMM",
        { locale: ru }
      )}`;
    }
  };

  const getMealType = (meal: string) => {
    const mealTypes: { [key: string]: string } = {
      "": "Без питания",
      BB: "Завтрак",
      HB: "Полупансион",
      FB: "Полный пансион",
      AI: "Всё включено",
      UAI: "Ультра всё включено",
      RO: "Без питания",
    };
    return mealTypes[meal] || meal;
  };

  return (
    <div className="flex-grow pb-4">
      <div className="flex flex-col gap-2 md:gap-3 mb-4">
        <div className="flex items-end gap-1">
          <h2 className="text-2xl md:text-3xl font-medium md:font-semibold">
            Горящие туры
            {selectedCity === "80"
              ? " из Бишкека"
              : selectedCity === "60"
              ? " из Алматы"
              : ""}
            {(() => {
              const cn =
                destinations.find((d) => d.id === selectedCountry)?.name || "";
              return cn ? ` ${getCountryDeclension(cn, "accusative")}` : "";
            })()}
          </h2>
          <BsFire className="md:text-3xl text-2xl text-orange-500" />
        </div>
        {/* Города вылета */}
        <div className="flex md:gap-2 gap-1">
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              selectedCity === ""
                ? "text-white bg-orange-500"
                : "text-black bg-slate-100 text-opacity-50"
            }`}
            onClick={() => setSelectedCity("")}
          >
            Все
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              selectedCity === "80"
                ? "text-white bg-orange-500"
                : "text-black bg-slate-100 text-opacity-50"
            }`}
            onClick={() => setSelectedCity("80")}
          >
            из Бишкека
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold ${
              selectedCity === "60"
                ? "text-white bg-orange-500"
                : "text-black bg-slate-100 text-opacity-50"
            }`}
            onClick={() => setSelectedCity("60")}
          >
            из Алматы
          </button>
        </div>

        {/* Мобильный dropdown для стран */}
        <div className="md:hidden">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={isCountryDropdownOpen ? closeDropdown : openDropdown}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCountry === ""
                  ? "text-white bg-orange-500"
                  : "text-white bg-orange-500"
              }`}
            >
              <span>
                {selectedCountry === ""
                  ? "Все страны"
                  : selectedCountryData?.name || "Все страны"}
              </span>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isCountryDropdownOpen ? "rotate-90" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Анимированный контент */}
            <div
              ref={contentRef}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCountryDropdownOpen
                  ? "max-h-96 opacity-100 mt-2"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="bg-white border border-[#DBE0E5] rounded-lg p-2 space-y-1 overflow-y-auto max-h-96">
                {/* Кнопка "Все страны" */}
                <button
                  onClick={() => handleCountrySelect("")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-orange-50 ${
                    selectedCountry === ""
                      ? "text-white bg-orange-500"
                      : "text-black hover:text-orange-500"
                  }`}
                >
                  Все страны
                </button>

                {/* Список стран */}
                {destinations.map((country) => (
                  <button
                    key={country.id}
                    onClick={() => handleCountrySelect(String(country.id))}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-orange-50 ${
                      selectedCountry === String(country.id)
                        ? "text-white bg-orange-500"
                        : "text-black hover:text-orange-500"
                    }`}
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Десктопные кнопки для стран */}
        <div className="hidden md:flex flex-wrap gap-1 md:gap-2">
          <button
            className={`px-7 py-2 rounded-full font-semibold ${
              selectedCountry === ""
                ? "text-white bg-orange-500"
                : "text-black bg-slate-100 text-opacity-50"
            }`}
            onClick={() => setSelectedCountry("")}
          >
            Все страны
          </button>
          {destinations.map((d) => (
            <button
              key={d.id}
              className={`px-7 py-2 rounded-full font-semibold ${
                selectedCountry === d.id
                  ? "text-white bg-orange-500"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
              onClick={() => setSelectedCountry(d.id)}
              title={d.name}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {filteredTours.map((tour: any, index: number) => (
          <>
            {index === 8 && (
              <div className="xl:col-span-4 lg:col-span-2 col-span-1">
                <GallaryCountries />
              </div>
            )}
            <div
              key={index}
              className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer transition-all duration-300"
              onClick={() =>
                navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)
              }
            >
              <div className="w-full flex flex-col gap-2">
                {/* Изображение */}
                <div className="w-full h-48 md:h-44 rounded">
                  <img
                    src={
                      tour.hotelpicture
                        ? `https:${tour.hotelpicture}`
                        : "/default-image.jpg"
                    }
                    alt={tour.hotelname}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Информация об отеле */}
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < parseInt(tour.hotelstars)
                              ? starFilled
                              : starOutline
                          }
                          alt={
                            i < parseInt(tour.hotelstars)
                              ? "filled star"
                              : "outline star"
                          }
                          className="w-4 h-4"
                        />
                      ))}
                      {tour.hotelrating !== "0" && (
                        <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                          {tour.hotelrating.length === 1
                            ? `${tour.hotelrating}.0`
                            : tour.hotelrating}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-[#FF621F]">
                      из {tour.departurenamefrom}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                      {truncateHotelName(tour.hotelname)}
                    </h3>
                    <p className="text-[#6B7280] text-base leading-[1.29]">
                      {tour.countryname}, {tour.hotelregionname}
                    </p>
                  </div>
                </div>

                {/* Теги */}
                <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[#2E2E32]">
                      {getMealType(tour.meal)}
                    </span>
                    <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Цена и даты */}
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {Number(tour.priceold) > Number(tour.price) && (
                      <span className="text-[#6B7280] line-through text-sm">
                        {tour.priceold * 2}
                        {tour.currency === "EUR"
                          ? "€"
                          : tour.currency === "USD"
                          ? "$"
                          : tour.currency}
                      </span>
                    )}
                    <span className="text-xl font-bold text-[#2E2E32]">
                      {tour.price * 2}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#2E2E32]">
                      {formatDateRange(tour.flydate, parseInt(tour.nights))}
                    </span>
                    <span className="text-sm text-[#6B7280]">
                      кол-во ночей: {tour.nights}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
