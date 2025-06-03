import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { BsFire } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale"; // Русская локализация
import { Skeleton } from "@heroui/react";
import { useState } from "react";
import { countryCodeMap } from "../constants/countryCodeMap";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotTours = async () => {
  const response = await axios.get(`${API_BASE_URL}/hot-tours`);
  return response.data;
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
              className="bg-white shadow-md rounded-md flex flex-col  w-full max-w-sm mx-auto"
            >
              <Skeleton className="h-48 rounded-lg" />

              <div className="flex flex-col">
                <Skeleton className="h-7 w-[280px] mt-[-27px]" />

                <div className="flex flex-col gap-2 px-2 pb-2 pt-1">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>

                  <div>
                    <Skeleton className="h-4 w-full" />
                  </div>

                  <Skeleton className="h-12 w-full rounded-md" />
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
            className="bg-white shadow-md rounded-md flex flex-col w-full cursor-pointer max-w-sm mx-auto"
            onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)}
          >
            {/* Фотография отеля */}
            <div className="relative">
              <img
                src={
                  tour.hotelpicture
                    ? `https:${tour.hotelpicture}`
                    : "/default-image.jpg"
                }
                alt={tour.hotelname}
                width={320}
                height={200}
                className="rounded-lg object-cover h-48 w-full"
              />
              <div className="absolute top-4 right-4 z-10 bg-white/85 px-2 py-1 rounded-full">
                <span className="text-orange-500 text-sm font-medium">
                  -{" "}
                  {Math.round(
                    ((tour.priceold - tour.price) / tour.priceold) * 100
                  )}
                  %
                </span>
              </div>
            </div>

            <div className="flex flex-col relative">
              {/* Звездность и рейтинг отеля */}
              <div className="flex items-center gap-2 justify-between px-2 bg-blue-500 py-1 absolute w-full -top-[27px]">
                <div className="flex gap-0.5">
                  {Array.from({ length: parseInt(tour.hotelstars) }, (_, i) => (
                    <GoStarFill key={i} className="text-white" />
                  ))}
                </div>
                <span className="text-white text-sm font-bold h-5">
                  {tour.hotelrating === "0" ? "" : tour.hotelrating + " / 5"}
                </span>
              </div>

              <div className="flex flex-col gap-2 px-2 pb-2 pt-1">
                {/* Название отеля с обрезкой текста */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold truncate">
                    {tour.hotelname.length > 20
                      ? `${tour.hotelname.substring(0, 26)}...`
                      : tour.hotelname}
                  </h3>

                  {/* Город и регион */}
                  <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
                    {countryCodeMap[tour.countryname] && (
                      <img
                        src={`https://flagcdn.com/${countryCodeMap[
                          tour.countryname
                        ].toLowerCase()}.svg`}
                        alt={tour.countryname}
                        className="w-4 h-3 object-cover rounded-sm"
                      />
                    )}
                    {tour.countryname}, {tour.hotelregionname}
                  </p>
                </div>

                <div>
                  {/* Информация о вылете */}
                  <p className="text-blue-500 text-sm">
                    из {tour.departurenamefrom}, {formatDate(tour.flydate)}. На{" "}
                    {tour.nights} ночей
                  </p>
                </div>

                {/* Цены */}
                <div className="flex items-center gap-2 bg-blue-200 p-2 rounded-md justify-between">
                  <div className="flex flex-col">
                    <span className="text-black line-through">
                      {tour.priceold * 2}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                  </div>
                  <p className="text-black flex gap-2 items-baseline">
                    за двоих
                    <span className="text-lg text-orange-500 font-semibold">
                      {tour.price * 2}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
