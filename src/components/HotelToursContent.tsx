import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";

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
}

interface HotelToursContentProps {
  tours: Tour[];
}

export const HotelToursContent = ({ tours }: HotelToursContentProps) => {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  const displayedTours = showAll ? tours : tours.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Заголовки */}
      <div className="flex justify-between items-start mb-[-10px]">
        <div className="flex-1">
          <div className="grid grid-cols-3">
            <p className="text-xs font-medium text-gray-500">
              РЕЙС / ПРОГРАММА
            </p>
            <p className="text-xs font-medium text-gray-500">ДАТА / НЧ</p>
            <p className="text-xs font-medium text-gray-500">НОМЕР / ПИТАНИЕ</p>
          </div>
        </div>
        <div className="text-right ml-4">
          {/* Пустой div для выравнивания с ценой */}
          <div style={{ width: "120px" }}></div>
        </div>
      </div>

      {displayedTours.map((tour, index) => (
        <div key={index} className="border-t pt-4">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium text-black">{tour.tourname}</p>
                  <p className="text-sm text-black">{tour.operatorname}</p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    {formatDate(tour.flydate)}
                  </p>
                  <p className="text-sm text-black">{tour.nights} ночей</p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    {tour.room} / {tour.adults} взр
                  </p>
                  <p className="text-sm text-black">{tour.mealrussian}</p>
                </div>
              </div>
            </div>

            <div className="text-right ml-4">
              <p className="text-2xl font-bold text-black">
                {tour.price}
                {tour.currency === "EUR"
                  ? "€"
                  : tour.currency === "USD"
                  ? "$"
                  : tour.currency}
              </p>
              <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-700 transition">
                Забронировать
              </button>
            </div>
          </div>
        </div>
      ))}

      {tours.length > 5 && !showAll && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="bg-slate-200 rounded-full px-4 py-2 text-black/50 hover:bg-slate-300"
          >
            Показать больше туров
          </button>
        </div>
      )}
    </div>
  );
};
