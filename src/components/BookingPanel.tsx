import { IoMoonOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaUtensils } from "react-icons/fa";
import { useContext } from "react";
import { DataContext } from "../components/DataProvider";

interface BookingPanelProps {
  price: string;
  currency: string;
  nights: number;
  meal: string;
  hotelcode?: string;
  tourId?: string;
  hotelName: string;
  departure: string;
  flyDate: string;
  adults: string;
  country: string;
  region: string;
  operatorLink: string;
  roomType: string;
}

export default function BookingPanel({
  price,
  currency,
  nights,
  meal,
  hotelcode = "",
  tourId = "",
  hotelName,
  departure,
  flyDate,
  adults,
  country,
  region,
  operatorLink,
  roomType,
}: BookingPanelProps) {
  const { addToFavorite, removeFromFavorite, favoriteTours } =
    useContext(DataContext);

  // Проверяем, есть ли тур в избранном
  const isFavorite = favoriteTours.some(
    (tour) => tour.hotelcode === hotelcode && tour.tourId === tourId
  );

  const handleBooking = () => {
    if (hotelcode && tourId) {
      // Сохраняем данные в localStorage перед переходом
      const bookingDetails = {
        hotelName,
        departure,
        flyDate,
        nights,
        adults,
        price,
        currency,
        country,
        region,
        hotelcode,
        operatorLink,
        mealType: meal,
        roomType,
      };
      localStorage.setItem(
        `booking_${hotelcode}_${tourId}`,
        JSON.stringify(bookingDetails)
      );

      window.location.href = `/hotel/${hotelcode}/${tourId}/booking?success=false`;
    }
  };

  const handleFavoriteClick = () => {
    const tourData = {
      hotelcode,
      tourId,
    };

    if (isFavorite) {
      removeFromFavorite(hotelcode, tourId);
    } else {
      addToFavorite(tourData);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_3px_12px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-[1420px] mx-auto md:px-28 py-2 flex items-center justify-between">
        {/* Информация о туре */}
        <div className="hidden md:flex items-center gap-2 md:gap-8 md:mx-0">
          <div className="flex items-center gap-1 md:gap-2">
            <IoMoonOutline className="text-indigo-600 text-sm md:text-xl" />
            <span className="text-gray-700 font-medium text-xs md:text-base">
              {nights} ночей
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <FaUtensils className="text-purple-600 text-sm md:text-xl" />
            <span className="text-gray-700 font-medium text-xs md:text-base">
              {meal}
            </span>
          </div>
        </div>

        {/* Цена и кнопки */}
        <div className="flex items-center md:gap-4 w-full md:w-auto justify-between md:justify-start">
          {/* Цена */}
          <div className="flex flex-col ml-4 md:items-end text-center">
            <span className="text-gray-500 text-sm md:text-base">за двоих</span>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              {price}
              {currency === "EUR" ? "€" : currency === "USD" ? "$" : currency}
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-1 md:gap-3">
            <button
              onClick={handleFavoriteClick}
              className={`md:flex hidden px-4 py-2 border-2 rounded-xl font-medium transition-colors
                ${
                  isFavorite
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
            >
              {isFavorite ? "Убрать из избранного" : "В избранное"}
            </button>

            <button
              onClick={handleFavoriteClick}
              className="flex md:hidden items-center justify-center w-10 h-10 border-2 rounded-xl transition-colors"
            >
              {isFavorite ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-blue-600 text-xl" />
              )}
            </button>

            <button
              onClick={handleBooking}
              className="mr-3 md:mr-0 px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-xl font-medium 
                hover:bg-blue-500 transition-colors shadow-md"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
