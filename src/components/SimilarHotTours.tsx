import { BsFire } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";
import useSimilarHotTours from "../Hooks/useSimilarHotTours";

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
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        Похожие туры <BsFire className="text-orange-500" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {similarTours.map((tour: any, index: number) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-md flex flex-col cursor-pointer"
            onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)}
          >
            <div className="relative">
              <img
                src={
                  tour.hotelpicture
                    ? `https:${tour.hotelpicture}`
                    : "/default-image.jpg"
                }
                alt={tour.hotelname}
                className="rounded-lg object-cover h-48 w-full"
              />
              {tour.priceold > tour.price && (
                <div className="absolute top-4 right-4 z-10 bg-white/85 px-2 py-1 rounded-full">
                  <span className="text-orange-500 text-sm font-medium">
                    -{" "}
                    {Math.round(
                      ((tour.priceold - tour.price) / tour.priceold) * 100
                    )}
                    %
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col relative">
              <div className="flex items-center gap-2 justify-between px-2 bg-blue-400 py-1 absolute w-full -top-[27px]">
                <div className="flex gap-0.5">
                  {Array.from({ length: parseInt(tour.hotelstars) }, (_, i) => (
                    <GoStarFill key={i} className="text-white" />
                  ))}
                </div>
                <span className="text-white text-sm font-medium">
                  {tour.hotelrating === "0" ? "" : `${tour.hotelrating} / 5`}
                </span>
              </div>

              <div className="flex flex-col gap-2 px-2 pb-2 pt-1">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold truncate">
                    {tour.hotelname.length > 26
                      ? `${tour.hotelname.substring(0, 26)}...`
                      : tour.hotelname}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {tour.hotelregionname}
                  </p>
                </div>

                <p className="text-blue-500 text-sm">
                  из {tour.departurename}, {formatDate(tour.flydate)}. На{" "}
                  {tour.nights} ночей
                </p>

                <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-md justify-between">
                  {tour.priceold > tour.price && (
                    <span className="text-black line-through">
                      {tour.priceold * 2}
                      {tour.currency === "EUR"
                        ? "€"
                        : tour.currency === "USD"
                        ? "$"
                        : tour.currency}
                    </span>
                  )}
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
