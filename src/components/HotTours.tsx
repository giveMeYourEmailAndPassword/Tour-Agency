import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { BsFire } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale"; // Русская локализация
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import { countryCodeMap } from "../constants/countryCodeMap";
import starFilled from "../assets/star.svg";
import starOutline from "../assets/star.svg";
import utensils from "../assets/moon_stars.svg";
import bed from "../assets/person_luggage.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotTours = async () => {
  const response = await axios.get(`${API_BASE_URL}/hot-tours`);
  return response.data;
};

// Добавим функцию для обрезки названия отеля после 3-го пробела
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 3) {
    return words.slice(0, 3).join(" ") + "...";
  }
  return name;
};

export default function HotTours() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotTours"],
    queryFn: fetchHotTours,
  });

  const filteredTours = selectedCity
    ? data?.hottours?.tour.filter(
        (tour: any) => tour.departurecode === selectedCity
      )
    : data?.hottours?.tour || [];

  filteredTours;

  if (isLoading) {
    return (
      <div className="flex flex-col my-4 md:my-14 gap-4 md:gap-8 max-w-[1560px] mx-auto px-4 md:px-8 lg:px-12 xl:px-36">
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-1">
            <h2 className="text-2xl md:text-3xl font-medium md:font-semibold">
              Горящие туры
            </h2>
            <BsFire className="md:text-3xl text-2xl text-orange-500" />
          </div>
          <div className="flex md:gap-2 gap-1">
            <button className="px-5 py-2 rounded-full font-semibold text-blue-500 bg-slate-200">
              Все
            </button>
            <button className="px-5 py-2 rounded-full font-semibold text-black bg-slate-100 text-opacity-50">
              из Бишкека
            </button>
            <button className="px-5 py-2 rounded-full font-semibold text-black bg-slate-100 text-opacity-50">
              из Алматы
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-72 flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
            >
              <div className="w-64 flex flex-col gap-2">
                <Skeleton className="w-full h-36 rounded" />

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
                  <Skeleton className="w-20 h-6" />
                </div>

                <div className="w-full flex justify-between items-center">
                  <Skeleton className="w-20 h-7" />
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-4" />
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
    // Парсим строку в объект Date
    const date = parse(dateString, "dd.MM.yyyy", new Date());

    // Форматируем дату в нужный формат
    return format(date, "d MMMM", { locale: ru }); // "24 октября"
  };

  const getEndDate = (startDate: string, nights: number) => {
    const date = parse(startDate, "dd.MM.yyyy", new Date());
    return format(addDays(date, nights), "d MMMM", { locale: ru });
  };

  // Добавим функцию для определения типа питания
  const getMealType = (meal: string) => {
    const mealTypes: { [key: string]: string } = {
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
    <div className="flex flex-col md:my-14 my-4 gap-4 md:gap-8 max-w-[1560px] mx-auto px-4 md:px-8 lg:px-12 xl:px-36">
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-1">
          <h2 className="text-2xl md:text-3xl font-medium md:font-semibold">
            Горящие туры
            {selectedCity === "80"
              ? " из Бишкека"
              : selectedCity === "60"
              ? " из Алматы"
              : ""}
          </h2>
          <BsFire className="md:text-3xl text-2xl text-orange-500" />
        </div>
        <div className="flex md:gap-2 gap-1">
          <button
            className={`px-5 py-2 rounded-full font-semibold
               ${
                 selectedCity === ""
                   ? "text-blue-500 bg-slate-200"
                   : "text-black bg-slate-100 text-opacity-50"
               }`}
            onClick={() => setSelectedCity("")}
          >
            Все
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold
              ${
                selectedCity === "80"
                  ? "text-blue-500 bg-slate-200"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
            onClick={() => setSelectedCity("80")}
          >
            из Бишкека
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold
              ${
                selectedCity === "60"
                  ? "text-blue-500 bg-slate-200"
                  : "text-black bg-slate-100 text-opacity-50"
              }`}
            onClick={() => setSelectedCity("60")}
          >
            из Алматы
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3">
        {filteredTours.map((tour: any, index: number) => (
          <div
            key={index}
            className="w-72 flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer"
            onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)}
          >
            <div className="w-64 flex flex-col gap-2">
              {/* Image */}
              <div className="w-full h-36 rounded">
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

              {/* Hotel Info */}
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
                        {tour.hotelrating}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#FF621F]">
                    из {tour.departurenamefrom}
                  </span>
                </div>

                <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                  {truncateHotelName(tour.hotelname)}
                </h3>
                <p className="text-[#6B7280] text-sm font-light leading-[1.29]">
                  {tour.countryname}, {tour.hotelregionname}
                </p>
              </div>

              {/* Tags - оставляем только питание */}
              <div className="w-full flex items-center pb-1 border-b border-[#DBE0E5]">
                <div className="flex items-center gap-1">
                  <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                  <span className="text-sm text-[#2E2E32]">
                    {getMealType(tour.meal)}
                  </span>
                </div>
              </div>

              {/* Price and Dates */}
              <div className="w-full flex justify-between items-center">
                <span className="text-xl font-bold text-[#2E2E32]">
                  {tour.price * 2}
                  {tour.currency === "EUR"
                    ? "€"
                    : tour.currency === "USD"
                    ? "$"
                    : tour.currency}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-[#2E2E32]">
                    {formatDate(tour.flydate)} -{" "}
                    {getEndDate(tour.flydate, parseInt(tour.nights))}
                  </span>
                  <span className="text-xs font-light text-[#6B7280]">
                    кол-во ночей: {tour.nights}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
