import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { useState, useContext } from "react";
import { IoMoonOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaUtensils } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { DataContext } from "../../components/DataProvider";

interface Tour {
  price: number;
  nights: number;
  operatorcode: number;
  operatorname: string;
  flydate: string;
  placement: string;
  adults: number;
  child: number;
  room: string;
  tourname: string;
  regular: number;
  hotelstatus: number;
  mealcode: number;
  mealrussian: string;
  meal: string;
  tourid: string;
  currency: string;
  priceue: number;
  visa: number;
  fuelcharge: number;
  hotelcode?: number;
}

interface MobileToursContentProps {
  tours: Tour[];
  hotelcode: number;
}

export default function MobileToursContent({
  tours,
  hotelcode,
}: MobileToursContentProps) {
  const [showAll, setShowAll] = useState(false);
  const { addToFavorite, removeFromFavorite, favoriteTours } =
    useContext(DataContext);

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  const displayedTours = showAll ? tours : tours.slice(0, 3);

  const handleTourClick = (tour: Tour) => {
    window.location.href = `/OurTours/hotel/${hotelcode}/${tour.tourid}`;
  };

  const handleFavoriteClick = (tourId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tourData = {
      hotelcode: hotelcode.toString(),
      tourId,
    };

    const isFavorite = favoriteTours.some(
      (tour) =>
        tour.hotelcode === hotelcode.toString() && tour.tourId === tourId
    );

    if (isFavorite) {
      removeFromFavorite(hotelcode.toString(), tourId);
    } else {
      addToFavorite(tourData);
    }
  };

  return (
    <div className="mt-2 space-y-1">
      {displayedTours.map((tour, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded-lg p-3 space-y-1 active:bg-gray-200"
          onClick={() => handleTourClick(tour)}
        >
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-900">
              {formatDate(tour.flydate)}
            </p>
            <p className="text-lg font-bold text-black">
              {tour.price}
              {tour.currency === "EUR"
                ? "€"
                : tour.currency === "USD"
                ? "$"
                : tour.currency}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-1">
              <IoMoonOutline className="text-indigo-600" />
              <span>{tour.nights} ночей</span>
            </div>
            <div className="flex items-center gap-1">
              <FaUtensils className="text-purple-600" />
              <span>{tour.mealrussian}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-medium text-gray-500">
                {tour.operatorname}
              </p>
              <p className="text-sm text-gray-500">
                {tour.room} / {tour.adults} взр
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleFavoriteClick(tour.tourid, e)}
                className="flex items-center justify-center w-8 h-8 border-2 rounded-full transition-colors bg-white"
              >
                {favoriteTours.some(
                  (favTour) =>
                    favTour.hotelcode === hotelcode.toString() &&
                    favTour.tourId === tour.tourid
                ) ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-slate-500 text-lg" />
                )}
              </button>

              <div className="flex items-center justify-center border-2 w-8 h-8 rounded-full bg-white">
                <IoIosArrowForward className="text-slate-500 text-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {tours.length > 3 && !showAll && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(true);
          }}
          className="w-full py-2 text-sm text-blue-600 font-medium bg-gray-50 
                     rounded-lg active:bg-gray-100"
        >
          Показать еще {tours.length - 3} туров
        </button>
      )}
    </div>
  );
}
