import { BsFire } from "react-icons/bs";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";
import useSimilarHotTours from "../Hooks/useSimilarHotTours";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";

interface Tour {
  hotelcode: string;
  tourid: string;
  hotelpicture: string;
  hotelname: string;
  hotelstars: string;
  hotelrating: string;
  countryname: string;
  hotelregionname: string;
  meal: string;
  beach?: boolean;
  operatorname?: string;
  departurename: string;
  flydate: string;
  nights: string;
  price: string;
  priceold: string;
  currency: string;
}

interface SimilarHotToursProps {
  countrycode: string;
  departurecode: string;
  currentHotelCode: string;
  currentHotelName: string;
}

export default function SimilarHotTours({
  countrycode,
  departurecode,
  currentHotelCode,
  currentHotelName,
}: SimilarHotToursProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSimilarHotTours(
    countrycode,
    departurecode
  );

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
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
      "BED & BREAKFAST": "Завтрак",
    };
    return mealTypes[meal] || meal;
  };

  const getEndDate = (startDate: string, nights: number) => {
    const date = parse(startDate, "dd.MM.yyyy", new Date());
    return format(addDays(date, nights), "d MMMM", { locale: ru });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          Похожие туры <BsFire className="text-orange-500" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-md">
              <Skeleton className="h-48 rounded-lg" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return null; // Лучше возвращать null вместо тестового текста
  }

  const similarTours =
    data?.hottours?.tour
      ?.filter(
        (tour) =>
          tour.hotelcode !== currentHotelCode &&
          tour.hotelname !== currentHotelName
      )
      ?.slice(0, 4) || [];

  if (similarTours.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        Похожие туры <BsFire className="text-orange-500" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {similarTours.map((tour: Tour, index: number) => (
          <div
            key={index}
            className="w-full p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer transition-shadow duration-300"
            onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)}
          >
            <div className="w-full flex flex-col gap-2">
              {/* Изображение */}
              <div className="w-full h-48 md:h-44 rounded overflow-hidden">
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
                    из {tour.departurename}
                  </span>
                </div>

                <div>
                  <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                    {tour.hotelname.length > 22
                      ? `${tour.hotelname.substring(0, 22)}...`
                      : tour.hotelname}
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
                  <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                </div>
                {tour.beach && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[#2E2E32]">
                      Береговая линия
                    </span>
                    <FaUmbrellaBeach className="w-3.5 h-3.5 text-[#2E2E32]" />
                  </div>
                )}
              </div>

              {/* Цена и даты */}
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {Number(tour.priceold) > Number(tour.price) && (
                    <span className="text-[#6B7280] line-through text-sm">
                      {tour.priceold}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                  )}
                  <span className="text-xl font-bold text-[#2E2E32]">
                    {tour.price}
                    {tour.currency === "EUR"
                      ? "€"
                      : tour.currency === "USD"
                      ? "$"
                      : tour.currency}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-[#2E2E32]">
                    {formatDate(tour.flydate)} -{" "}
                    {getEndDate(tour.flydate, parseInt(tour.nights))}
                  </span>
                  <span className="text-sm text-[#6B7280]">
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
