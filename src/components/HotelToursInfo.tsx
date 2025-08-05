import { useState, useEffect } from "react";
import useHotelToursInfo from "../Hooks/useHotelToursInfo";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { IoAirplane } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";

interface Tour {
  tours: {
    tour: Array<{
      meal: string;
      nights: number;
      flydate: string;
    }>;
  };
  room: string;
  price: string;
  currency: string;
}

export default function HotelToursInfo() {
  const [selectedTours, setSelectedTours] = useState<Tour[]>([]);
  const { hotel, isLoading, error } = useHotelToursInfo();

  useEffect(() => {
    const savedTours = localStorage.getItem("selectedHotelTours");
    if (savedTours) {
      setSelectedTours(JSON.parse(savedTours));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1152px] mx-auto p-6 bg-white rounded-lg border border-[#DBE0E5]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
            <Skeleton className="w-40 h-6" />
          </div>
          <Skeleton className="w-full h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-[1152px] mx-auto p-6 bg-white rounded-lg border border-[#DBE0E5]">
        <div className="text-red-600 text-center">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
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
    <div className="max-w-[1152px] mx-auto p-6 bg-white rounded-lg border border-[#DBE0E5]">
      <div className="flex flex-col gap-3">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={i < parseInt(hotel.stars) ? starFilled : starOutline}
                  alt={
                    i < parseInt(hotel.stars) ? "filled star" : "outline star"
                  }
                  className="w-4 h-4"
                />
              ))}
            </div>
            {hotel.rating !== "0" && (
              <div className="bg-[#FF621F] text-white text-xs font-medium px-2 py-0.5 rounded-[20px]">
                {hotel.rating}
              </div>
            )}
          </div>
          <div className="text-base text-[#6B7280]">вылет из Бишкека</div>
        </div>

        {/* Название и местоположение */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-[#2E2E32]">{hotel.name}</h1>
          <div className="flex justify-between items-center pb-1 border-b border-[#DBE0E5]">
            <p className="text-base text-[#6B7280]">
              {hotel.country}, {hotel.region}
            </p>
            <div className="flex gap-3">
              {hotel.meal && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[#2E2E32]">Питание</span>
                  <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                </div>
              )}
              {hotel.beach && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-[#2E2E32]">
                    Береговая линия
                  </span>
                  <FaUmbrellaBeach className="w-3.5 h-3.5 text-[#2E2E32]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Галерея */}
        <div className="flex gap-4">
          <div className="w-[452px] h-[339px] rounded-sm overflow-hidden">
            <img
              src={`https:${hotel.images.image[0]}`}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {hotel.images.image.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="w-[106px] h-[78px] rounded-sm overflow-hidden"
              >
                <img
                  src={`https:${image}`}
                  alt={`${hotel.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Описание и туры */}
        <div className="flex gap-4">
          <div className="w-[636px]">
            <div className="pb-2 border-b border-[#DBE0E5] mb-4">
              <p className="text-lg text-[#6B7280]">{hotel.description}</p>
            </div>

            {/* Варианты туров */}
            <div className="space-y-4">
              {selectedTours.map((tour: Tour, index: number) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-base font-semibold text-[#2E2E32]">
                    Вариант {index + 1}
                  </h3>
                  <div className="flex justify-between items-start">
                    <div className="w-[240px] space-y-2">
                      <p className="text-xs font-medium text-[#2E2E32]">
                        {getMealType(tour.tours.tour[0].meal)},{" "}
                        {tour.tours.tour[0].nights} ночей
                      </p>
                      <p className="text-xs font-semibold text-[#2E2E32]">
                        {tour.room}
                      </p>
                    </div>
                    <div className="w-[240px] space-y-2">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-semibold text-[#6B7280]">
                          {formatDate(tour.tours.tour[0].flydate)} –{" "}
                          {getEndDate(
                            tour.tours.tour[0].flydate,
                            tour.tours.tour[0].nights
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <IoAirplane className="w-3.5 h-3.5 text-[#2E2E32]" />
                        <span className="text-xs font-medium text-[#2E2E32]">
                          Pegasus Airlines
                        </span>
                        <span className="text-xs text-[#B3B9C0]">
                          Kompas (KZ)
                        </span>
                      </div>
                    </div>
                    <button className="bg-[#FF621F] text-white px-2 py-2 rounded-lg flex items-center gap-3">
                      <span className="text-base font-bold">
                        {tour.price}
                        {tour.currency === "EUR"
                          ? "€"
                          : tour.currency === "USD"
                          ? "$"
                          : tour.currency}
                      </span>
                      <IoAirplane className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
