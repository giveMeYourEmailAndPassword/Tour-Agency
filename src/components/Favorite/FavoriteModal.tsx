import { FavoriteTourData } from "../../components/DataProvider";
import useHotelDetails from "../../Hooks/UseHotelDetails";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../components/DataProvider";
import { FaTrash } from "react-icons/fa";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";
import starFilled from "../../assets/star_fill.svg";
import starOutline from "../../assets/star_unfill.svg";
import utensils from "../../assets/utensils.svg";

interface FavoriteModalProps {
  tours: FavoriteTourData[];
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

function FavoriteTourCardSkeleton() {
  return (
    <div className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]">
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
  );
}

function FavoriteTourCard({ tour }: { tour: FavoriteTourData }) {
  const navigate = useNavigate();
  const { data, isLoading } = useHotelDetails(tour.hotelcode, tour.tourId);
  const { removeFromFavorite } = useContext(DataContext);

  const tourData = data?.tour?.data?.tour;
  const hotelData = data?.hotel?.data?.hotel;

  if (isLoading) {
    return <FavoriteTourCardSkeleton />;
  }

  if (!tourData || !hotelData) {
    return (
      <div className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] relative">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full h-44 md:h-36 rounded bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-2xl">Тур продан</div>
          </div>
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
        <button
          onClick={() => removeFromFavorite(tour.hotelcode, tour.tourId)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-md"
          title="Удалить из избранного"
        >
          <FaTrash size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer transition-all duration-300 relative"
      onClick={() => navigate(`/hotel/${tour.hotelcode}/${tour.tourId}`)}
    >
      <div className="w-full flex flex-col gap-2">
        {/* Изображение */}
        <div className="w-full h-44 md:h-36 rounded relative">
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
              "/default-hotel-image.jpg"
            }
            alt={hotelData.name}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/default-hotel-image.jpg";
            }}
          />
          {tourData.priceold > tourData.price && (
            <div className="absolute top-2 right-2 z-10 bg-white/85 px-2 py-1 rounded-full">
              <span className="text-orange-500 text-sm font-medium">
                -{" "}
                {Math.round(
                  ((tourData.priceold - tourData.price) / tourData.priceold) *
                    100
                )}
                %
              </span>
            </div>
          )}
        </div>

        {/* Информация об отеле */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={i < parseInt(hotelData.stars) ? starFilled : starOutline}
                  alt={
                    i < parseInt(hotelData.stars)
                      ? "filled star"
                      : "outline star"
                  }
                  className="w-4 h-4"
                />
              ))}
              {hotelData.rating !== "0" && (
                <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                  {hotelData.rating.length === 1
                    ? `${hotelData.rating}.0`
                    : hotelData.rating}
                </div>
              )}
            </div>
          </div>

          <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
            {truncateHotelName(hotelData.name)}
          </h3>
          <p className="text-[#6B7280] text-base leading-[1.29]">
            {hotelData.country}, {hotelData.region}
          </p>
        </div>

        {/* Теги */}
        <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#2E2E32]">
                {getMealType(tourData.meal || "")}
              </span>
              <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#2E2E32]">
                {tourData.child > 0
                  ? `${tourData.adults} взр. ${tourData.child} дет.`
                  : `${tourData.adults} взрослых`}
              </span>
            </div>
          </div>
        </div>

        {/* Цена и даты */}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold text-[#2E2E32]">
            {tourData.price}
            {tourData.currency === "EUR"
              ? "€"
              : tourData.currency === "USD"
              ? "$"
              : tourData.currency}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[#2E2E32]">
              {formatDate(tourData.flydate)} -{" "}
              {getEndDate(tourData.flydate, tourData.nights)}
            </span>
            <span className="text-sm text-[#6B7280]">
              кол-во ночей: {tourData.nights}
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка удаления из избранного */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFromFavorite(tour.hotelcode, tour.tourId);
        }}
        className="absolute top-7 right-7 text-white hover:text-red-500 transition-colors p-1.5 bg-black/50 hover:bg-black/70 rounded-md"
        title="Удалить из избранного"
      >
        <FaTrash size={12} />
      </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
