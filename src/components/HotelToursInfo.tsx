import { useLocation } from "react-router-dom";
import useHotelToursInfo from "../Hooks/useHotelToursInfo";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { IoAirplane } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

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
  const location = useLocation();
  const selectedTours = location.state?.hotelTours || [];
  const hotelDescription = location.state?.hotelDescription || "";
  const { hotel, isLoading, error } = useHotelToursInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const slides =
    hotel?.images?.image?.map((img: string) => ({
      src: `https:${img}`,
    })) || [];

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 bg-white">
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full h-[600px]" />
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 bg-white">
        <div className="text-red-600 text-center">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-4 bg-white">
      {/* Заголовок */}
      <div className="flex flex-col gap-3">
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
          <div className="flex items-center gap-2 text-base text-[#6B7280]">
            <span>вылет из Бишкека</span>
            <IoAirplane className="w-4 h-4" />
          </div>
        </div>

        {/* Название и местоположение */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-[#2E2E32]">{hotel.name}</h1>
          <div className="flex justify-between items-center pb-1 border-b border-[#DBE0E5]">
            <p className="text-base text-[#6B7280]">
              {hotel.country}, {hotel.region}
            </p>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#2E2E32]">
                  {getMealType(selectedTours[0].tours.tour[0].meal)}
                </span>
                <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
              </div>
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

        {/* Галерея и контент */}
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1 h-[560px]">
            {/* Основное фото */}
            <div className="w-full rounded-sm overflow-hidden">
              <img
                src={`https:${hotel.images.image[0]}`}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onClick={() => handleImageClick(0)}
              />
            </div>
            {/* Дополнительные фото */}
            <div className="grid grid-cols-4 gap-1">
              {hotel.images.image.slice(1, 5).map((image, index) => (
                <div key={index} className="w-full rounded-sm overflow-hidden">
                  <img
                    src={`https:${image}`}
                    alt={`${hotel.name} ${index + 1}`}
                    className="w-full h-[80%] object-cover"
                    onClick={() => handleImageClick(index + 1)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Описание и туры */}
          <div className="flex gap-4 w-[50%]">
            <div className="w-full">
              <div className="text-lg text-[#6B7280] mb-4">
                {hotelDescription} {""}
                {hotel.description}
              </div>

              {/* Варианты туров */}
              <div className="space-y-4">
                {selectedTours.map((tour: Tour, tourIndex: number) =>
                  tour.tours.tour.map((tourVariant, variantIndex: number) => (
                    <div
                      key={`${tourIndex}-${variantIndex}`}
                      className="space-y-2"
                    >
                      <h3 className="text-base font-semibold text-[#2E2E32]">
                        Вариант {variantIndex + 1}
                      </h3>
                      <div className="flex justify-between items-start">
                        <div className="w-[330px] space-y-2">
                          <p className="text-xs font-medium text-[#2E2E32]">
                            {getMealType(tourVariant.meal)},{" "}
                            {tourVariant.nights} ночей
                          </p>
                          <p className="text-xs font-semibold text-[#2E2E32]">
                            {`Номер ${tourVariant.room}, ${tourVariant.adults} взрослых`}
                          </p>
                        </div>
                        <div className="w-[330px] space-y-2">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-semibold text-[#6B7280]">
                              {formatDate(tourVariant.flydate)} –{" "}
                              {getEndDate(
                                tourVariant.flydate,
                                tourVariant.nights
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        plugins={[Thumbnails]}
        index={currentIndex}
      />
    </div>
  );
}
