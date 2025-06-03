import { FavoriteTourData } from "../../components/DataProvider";
import useHotelDetails from "../../Hooks/UseHotelDetails";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../components/DataProvider";
import { FaTrash } from "react-icons/fa";
import { GoStarFill } from "react-icons/go";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale";
import { countryCodeMap } from "../../constants/countryCodeMap";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";

interface FavoriteModalProps {
  tours: FavoriteTourData[];
}

function FavoriteTourCardSkeleton() {
  return (
    <div className="bg-white shadow-md rounded-md flex flex-col w-full max-w-sm mx-auto">
      <Skeleton className="h-48 rounded-lg" />

      <div className="flex flex-col">
        <Skeleton className="h-7 w-full mt-[-27px]" />

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
  );
}

function FavoriteTourCard({ tour }: { tour: FavoriteTourData }) {
  const navigate = useNavigate();
  const { data, isLoading } = useHotelDetails(tour.hotelcode, tour.tourId);
  const { removeFromFavorite } = useContext(DataContext);

  const tourData = data?.tour?.data?.tour;
  const hotelData = data?.hotel?.data?.hotel;

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  if (isLoading) {
    return <FavoriteTourCardSkeleton />;
  }

  if (!tourData || !hotelData) {
    return (
      <div className="bg-white shadow-md rounded-md relative">
        <div className="flex items-center justify-center h-[20.8rem]">
          <div className="text-gray-400 text-2xl">Тур продан</div>
        </div>
        <button
          onClick={() => removeFromFavorite(tour.hotelcode, tour.tourId)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Удалить из избранного"
        >
          <FaTrash size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-white shadow-md rounded-md flex flex-col w-full md:w-80 cursor-pointer"
      onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourId}`)}
    >
      <div className="relative">
        <img
          src={
            (hotelData.hotelpicturebig &&
            hotelData.hotelpicturebig.startsWith("//")
              ? `https:${hotelData.hotelpicturebig}`
              : hotelData.hotelpicturebig) ||
            (tourData.hotelpicturebig &&
            tourData.hotelpicturebig.startsWith("//")
              ? `https:${tourData.hotelpicturebig}`
              : tourData.hotelpicturebig) ||
            "/default-hotel-image.jpg" // fallback изображение
          }
          alt={hotelData.name}
          className="rounded-lg object-cover h-48 w-full"
          onError={(e) => {
            e.currentTarget.src = "/default-hotel-image.jpg"; // если изображение не загрузилось
          }}
        />
        {tourData.priceold > tourData.price && (
          <div className="absolute top-4 right-4 z-10 bg-white/85 px-2 py-1 rounded-full">
            <span className="text-orange-500 text-sm font-medium">
              -{" "}
              {Math.round(
                ((tourData.priceold - tourData.price) / tourData.priceold) * 100
              )}
              %
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeFromFavorite(tour.hotelcode, tour.tourId);
          }}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors p-1"
          title="Удалить из избранного"
        >
          <FaTrash size={16} />
        </button>
      </div>

      <div className="flex flex-col relative">
        <div className="flex items-center gap-2 justify-between px-2 bg-blue-400 py-1 absolute w-full h-7 -top-[27px]">
          <div className="flex gap-0.5">
            {Array.from({ length: parseInt(hotelData.stars) }, (_, i) => (
              <GoStarFill key={i} className="text-white" />
            ))}
          </div>
          <span className="text-white text-sm font-bold">
            {hotelData.rating === "0" ? "" : `${hotelData.rating} / 5`}
          </span>
        </div>

        <div className="flex flex-col gap-2 px-2 pb-2 pt-1">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold truncate">
              {hotelData.name.length > 26
                ? `${hotelData.name.substring(0, 26)}...`
                : hotelData.name}
            </h3>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-1">
              {countryCodeMap[hotelData.country] && (
                <img
                  src={`https://flagcdn.com/${countryCodeMap[
                    hotelData.country
                  ].toLowerCase()}.svg`}
                  alt={hotelData.country}
                  className="w-4 h-3 object-cover rounded-sm"
                />
              )}
              {hotelData.country}, {hotelData.region}
            </p>
          </div>

          <p className="text-blue-500 text-sm">
            из {tourData.departurename}, {formatDate(tourData.flydate)}. На{" "}
            {tourData.nights} ночей
          </p>

          <div className="flex items-center bg-blue-100 p-2 rounded-md justify-end">
            <p className="text-black flex gap-2 items-baseline">
              за {tourData.placement.split(" ")[0]}{" "}
              {tourData.placement.split(" ")[0] === "2"
                ? "двоих"
                : tourData.placement.split(" ")[0] === "3"
                ? "троих"
                : "взрослых"}
              <span className="text-lg text-orange-500 font-semibold">
                {tourData.price}
                {tourData.currency === "EUR"
                  ? "€"
                  : tourData.currency === "USD"
                  ? "$"
                  : tourData.currency}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoriteModal({ tours }: FavoriteModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {tours.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-xl text-black">У вас пока нет избранных туров</p>
          <p className="mt-2 text-black">
            Добавьте туры в избранное, чтобы они отображались здесь
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {isLoading
            ? [...Array(tours.length)].map((_, index) => (
                <div key={index}>
                  <FavoriteTourCardSkeleton />
                </div>
              ))
            : tours.map((tour) => (
                <FavoriteTourCard
                  key={`${tour.hotelcode}_${tour.tourId}`}
                  tour={tour}
                />
              ))}
        </div>
      )}
    </div>
  );
}
