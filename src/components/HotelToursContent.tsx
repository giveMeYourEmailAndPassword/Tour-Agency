import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { DetailsOfTour } from "./DetailsOfTour";

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

interface HotelToursContentProps {
  tours: Tour[];
  hotelcode: number;
}

export const HotelToursContent = ({
  tours,
  hotelcode,
}: HotelToursContentProps) => {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  const displayedTours = showAll ? tours : tours.slice(0, 5);

  return (
    <div className="bg-white rounded-lg">
      {/* Заголовки */}
      <div className="flex justify-between items-center pb-3 px-4">
        <div className="flex-1">
          <div className="grid grid-cols-[2.5fr_1fr_2fr] gap-4">
            <p className="text-xs font-medium text-gray-500">
              РЕЙС / ПРОГРАММА
            </p>
            <p className="text-xs font-medium text-gray-500">ДАТА / НЧ</p>
            <p className="text-xs font-medium text-gray-500">НОМЕР / ПИТАНИЕ</p>
          </div>
        </div>
        <div className="w-[100px] text-xs font-medium text-gray-500 text-center"></div>
      </div>

      <div className="border-t border-gray-100"></div>

      {displayedTours.map((tour, index) => (
        <div
          key={index}
          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-center px-4 py-4">
            <div className="flex-1">
              <div className="grid grid-cols-[2.5fr_1fr_2fr] gap-4">
                <div>
                  <p className="font-medium text- text-black line-clamp-1">
                    {tour.tourname}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {tour.operatorname}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm text-black">
                    {formatDate(tour.flydate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {tour.nights} ночей
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm text-black">
                    {tour.room} / {tour.adults} взр
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {tour.mealrussian}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[100px] text-right">
              <DetailsOfTour tour={tour} />
            </div>
          </div>
        </div>
      ))}

      {tours.length > 5 && !showAll && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="bg-slate-100 rounded-full px-6 py-2.5 text-gray-600 hover:bg-slate-200 transition-colors"
          >
            Показать больше туров
          </button>
        </div>
      )}
    </div>
  );
};
