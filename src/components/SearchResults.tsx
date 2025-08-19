import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import utensils from "../assets/utensils.svg";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { useNavigate } from "react-router-dom";

interface Tour {
  hotelcode: string;
  picturelink: string;
  hotelname: string;
  hotelstars: string;
  hotelrating: string;
  countryname: string;
  regionname: string;
  price: string;
  currency: string;
  hoteldescription: string;
  tours: {
    tour: Array<{
      tourid: string;
      meal: string;
      flydate: string;
      nights: number;
    }>;
  };
}

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

export default function SearchResults() {
  const { tours, loading, error } = useContext(DataContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex-grow pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
          {[...Array(36)].map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
            >
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="w-full h-44 md:h-36 rounded" />
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

  if (error) {
    return (
      <div className="mx-2 flex-grow">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="mx-2 flex-grow">
        <div className="text-center text-gray-500">Нет результатов поиска.</div>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-0 md:ml-2 flex-grow pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {tours.map((tour: Tour, index: number) => (
          <div
            key={index}
            onClick={() => {
              const hotelTours = tours.filter(
                (t) => t.hotelcode === tour.hotelcode
              );

              navigate(`/hotel/${tour.hotelcode}`, {
                state: {
                  hotelTours: hotelTours,
                  hotelDescription: tour.hoteldescription,
                },
              });
            }}
            className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer transition-all duration-300"
          >
            <div className="w-full flex flex-col gap-2">
              {/* Изображение */}
              <div className="w-full h-44 md:h-36 rounded">
                <img
                  src={tour.picturelink}
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
                </div>

                <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                  {truncateHotelName(tour.hotelname)}
                </h3>
                <p className="text-[#6B7280] text-base leading-[1.29]">
                  {tour.countryname}, {tour.regionname}
                </p>
              </div>

              {/* Теги */}
              <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[#2E2E32]">
                    {getMealType(tour.tours.tour[0].meal)}
                  </span>
                  <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Цена и даты */}
              <div className="w-full flex justify-between items-center">
                <span className="text-xl font-bold text-[#2E2E32]">
                  {tour.price}
                  {tour.currency === "EUR"
                    ? "€"
                    : tour.currency === "USD"
                    ? "$"
                    : tour.currency}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-[#2E2E32]">
                    {formatDate(tour.tours.tour[0].flydate)} -{" "}
                    {getEndDate(
                      tour.tours.tour[0].flydate,
                      tour.tours.tour[0].nights
                    )}
                  </span>
                  <span className="text-sm text-[#6B7280]">
                    кол-во ночей: {tour.tours.tour[0].nights}
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
