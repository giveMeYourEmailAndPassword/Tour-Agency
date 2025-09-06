import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./DataProvider";
import { BsFire } from "react-icons/bs";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import utensils from "../assets/utensils.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotTours = async (departureCity: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/hot-tours?departure=${departureCity}`
  );
  return response.data;
};

// Функция для обрезки названия отеля после 3-го пробела
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 3) {
    return words.slice(0, 3).join(" ") + "...";
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

export default function SwiperHotTours() {
  const { params } = useContext(DataContext);
  const navigate = useNavigate();

  // Получаем город отправления из контекста
  const departureCity = params.param1 || "80"; // По умолчанию Бишкек

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotTours", departureCity],
    queryFn: () => fetchHotTours(departureCity),
    enabled: !!departureCity,
  });

  if (isLoading) {
    return (
      <div className="w-full my-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <BsFire className="text-3xl" />
            <h2 className="text-2xl font-bold">Горящие туры</h2>
          </div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex-1 bg-white/20 rounded-xl p-4 animate-pulse"
              >
                <div className="h-32 bg-white/30 rounded-lg mb-3"></div>
                <div className="h-4 bg-white/30 rounded mb-2"></div>
                <div className="h-4 bg-white/30 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.hottours?.tour?.length) {
    return null; // Не показываем компонент если нет данных
  }

  const hotTours = data.hottours.tour.slice(0, 6); // Берем только первые 6 туров

  return (
    <div className="w-full my-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <BsFire className="text-3xl" />
          <h2 className="text-2xl font-bold">Горящие туры</h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next-hot",
            prevEl: ".swiper-button-prev-hot",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-hot",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="hot-tours-swiper"
        >
          {hotTours.map((tour: any, index: number) => (
            <SwiperSlide key={index}>
              <div
                onClick={() =>
                  navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)
                }
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-105"
              >
                {/* Изображение */}
                <div className="w-full h-32 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={
                      tour.hotelpicture
                        ? `https:${tour.hotelpicture}`
                        : "/default-image.jpg"
                    }
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
                        className="w-3 h-3"
                      />
                    ))}
                    {tour.hotelrating !== "0" && (
                      <div className="bg-white/30 text-white text-xs font-medium px-1.5 py-0.5 rounded-full ml-1">
                        {tour.hotelrating}
                      </div>
                    )}
                  </div>

                  <h3 className="text-white text-sm font-bold leading-tight">
                    {truncateHotelName(tour.hotelname)}
                  </h3>

                  <p className="text-white/80 text-xs">
                    {tour.countryname}, {tour.hotelregionname}
                  </p>

                  {/* Питание */}
                  <div className="flex items-center gap-1">
                    <img src={utensils} alt="meal" className="w-3 h-3" />
                    <span className="text-white/90 text-xs">
                      {getMealType(tour.meal)}
                    </span>
                  </div>

                  {/* Цена и даты */}
                  <div className="flex justify-between items-end">
                    <span className="text-white text-lg font-bold">
                      {tour.price * 2}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                    <div className="text-right">
                      <div className="text-white text-xs font-medium">
                        {formatDate(tour.flydate)} -{" "}
                        {getEndDate(tour.flydate, parseInt(tour.nights))}
                      </div>
                      <div className="text-white/70 text-xs">
                        {tour.nights} ночей
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Кастомные кнопки навигации */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="swiper-button-prev-hot bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300">
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
          <button className="swiper-button-next-hot bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300">
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

        {/* Кастомная пагинация */}
        <div className="swiper-pagination-hot flex justify-center mt-4"></div>
      </div>

      <style jsx>{`
        .hot-tours-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .hot-tours-swiper .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
    </div>
  );
}
