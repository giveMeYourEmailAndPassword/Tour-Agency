import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./DataProvider";
import { IoEarth } from "react-icons/io5";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { countryDeclensions } from "./data/countryDeclensions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// @ts-expect-error - Swiper CSS modules don't have type definitions
import "swiper/css";
// @ts-expect-error - Swiper navigation CSS module doesn't have type definitions
import "swiper/css/navigation";
// @ts-expect-error - Swiper pagination CSS module doesn't have type definitions
import "swiper/css/pagination";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import utensils from "../assets/utensils.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Tour {
  hotelcode: string;
  tourid: string;
  picturelink: string;
  hotelname: string;
  hotelstars: string;
  hotelrating: string;
  countryname: string;
  regionname: string;
  price: string;
  currency: string;
  tours: {
    tour: Array<{
      meal: string;
      flydate: string;
      nights: number;
    }>;
  };
}

const fetchRandomTours = async (requestId: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/results/${requestId}?page=1`
  );
  return response.data;
};

// Функция для обрезки названия отеля после 3-го пробела
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 3) {
    return words.slice(0, 3).join(" ");
  }
  return name;
};

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = parse(dateString, "dd.MM.yyyy", new Date());
  return format(date, "d MMMM", { locale: ru });
};

// Получение конечной даты
const getEndDate = (startDate: string, nights: number) => {
  const date = parse(startDate, "dd.MM.yyyy", new Date());
  return format(addDays(date, nights), "d MMMM", { locale: ru });
};

// Определение типа питания
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

// Функция для получения склонения страны
const getCountryCase = (
  countryName: string,
  useCase: "nominative" | "genitive" = "nominative"
): string => {
  console.log("getCountryCase input:", { countryName, useCase });
  const declension = countryDeclensions[countryName];
  console.log("Found declension:", declension);
  if (declension) {
    const result = declension[useCase];
    console.log("Result:", result);
    return result;
  }
  console.log("No declension found, returning original:", countryName);
  return countryName; // Возвращаем оригинальное название, если склонение не найдено
};

export default function SwiperRandomTours() {
  const { randomRequestId } = useContext(DataContext);
  const navigate = useNavigate();

  // Используем отдельный стейт для случайных туров
  const { data, isLoading, isError } = useQuery({
    queryKey: ["randomTours", randomRequestId],
    queryFn: () => fetchRandomTours(randomRequestId as string),
    enabled: !!randomRequestId,
    // Не обновляем данные при фокусе окна
    refetchOnWindowFocus: false,
    // Не обновляем данные при монтировании
    refetchOnMount: false,
    // Кэшируем данные "вечно"
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-4">
            <IoEarth className="text-2xl animate-pulse" />
            <h2 className="text-2xl font-bold">Случайные направления</h2>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-pulse"
                >
                  {/* Изображение */}
                  <div className="w-full h-44 rounded-lg mb-3 bg-white/30"></div>

                  {/* Информация об отеле */}
                  <div className="space-y-2">
                    {/* Звезды и рейтинг */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-white/30 rounded"
                        ></div>
                      ))}
                      <div className="bg-white/30 h-5 w-8 rounded-full ml-1"></div>
                    </div>

                    {/* Название отеля */}
                    <div className="h-4 bg-white/30 rounded w-3/4"></div>

                    {/* Страна и регион */}
                    <div className="h-3 bg-white/30 rounded w-1/2"></div>

                    {/* Питание */}
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-white/30 rounded"></div>
                      <div className="h-4 bg-white/30 rounded w-20"></div>
                    </div>

                    {/* Цена и даты */}
                    <div className="flex justify-between items-end">
                      <div className="h-5 bg-white/30 rounded w-16"></div>
                      <div className="text-right space-y-1">
                        <div className="h-3.5 bg-white/30 rounded w-24"></div>
                        <div className="h-3.5 bg-white/30 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки навигации внизу - скелетон для мобильных */}
          <div className="flex justify-center gap-4 mt-4 lg:hidden">
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <div className="w-5 h-5"></div>
            </div>
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <div className="w-5 h-5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Random tours data:", data); // Добавим лог для отладки

  if (isError || !data?.data?.result?.hotel?.length) {
    console.log("No random tours data or error:", { isError, data }); // Добавим лог для отладки
    return null; // Не показываем компонент если нет данных
  }

  const randomTours = data.data.result.hotel.slice(0, 16); // Берем только первые 16 туров
  console.log("First random tour:", randomTours[0]);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <IoEarth className="text-2xl" />
          <h2 className="text-2xl font-bold">
            {randomTours[0]
              ? `Лучшие отели ${getCountryCase(
                  randomTours[0].countryname,
                  "genitive"
                )}, специально для вас`
              : "Случайные направления"}
          </h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={8}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-random",
              prevEl: ".swiper-button-prev-random",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-random",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="random-tours-swiper"
          >
            {randomTours.map((tour: Tour, index: number) => (
              <SwiperSlide key={index}>
                <div
                  onClick={() =>
                    navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)
                  }
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/30"
                >
                  {/* Изображение */}
                  <div className="w-full h-44 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={tour.picturelink}
                      alt={tour.hotelname}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Информация об отеле */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
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
                        <div className="bg-white/30 text-white text-xs font-medium px-1.5 py-0.5 rounded-full ml-1">
                          {tour.hotelrating}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-white text-sm font-bold leading-tight">
                        {truncateHotelName(tour.hotelname)}
                      </h3>

                      <p className="text-white/80 text-xs">
                        {tour.countryname}, {tour.regionname}
                      </p>
                    </div>

                    {/* Питание */}
                    <div className="flex items-center gap-1">
                      <span className="text-white/90 text-sm">
                        {getMealType(tour.tours.tour[0].meal)}
                      </span>
                      <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                    </div>

                    {/* Цена и даты */}
                    <div className="flex justify-between items-end">
                      <div className="text-white text-lg font-bold">
                        {tour.price}
                        {tour.currency === "EUR"
                          ? "€"
                          : tour.currency === "USD"
                          ? "$"
                          : tour.currency}
                      </div>
                      <div className="text-right">
                        <div className="text-white text-xs font-medium">
                          {formatDate(tour.tours.tour[0].flydate)} -{" "}
                          {getEndDate(
                            tour.tours.tour[0].flydate,
                            tour.tours.tour[0].nights
                          )}
                        </div>
                        <div className="text-white/70 text-xs">
                          {tour.tours.tour[0].nights} ночей
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Кнопки навигации по бокам - только на десктопе */}
          <button className="swiper-button-prev-random absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10 hidden lg:flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="swiper-button-next-random absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10 hidden lg:flex items-center justify-center">
            <svg
              className="w-6 h-6"
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
        </div>

        {/* Кнопки навигации внизу - только на мобильных */}
        <div className="flex justify-center gap-4 mt-4 lg:hidden">
          <button className="swiper-button-prev-random bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="swiper-button-next-random bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300">
            <svg
              className="w-5 h-5"
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
        </div>
      </div>
    </div>
  );
}
