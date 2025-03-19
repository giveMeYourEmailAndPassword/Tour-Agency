import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";

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
  const formatDate = (dateString: string) => {
    // Парсим строку в объект Date
    const date = parse(dateString, "dd.MM.yyyy", new Date());

    // Форматируем дату в нужный формат
    return format(date, "d MMMM", { locale: ru }); // "24 октября"
  };

  return (
    <div className="space-y-4">
      {/* Заголовки */}
      <div className="flex justify-between items-start">
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
          <div style={{ width: "100px" }}></div>
        </div>
      </div>

      {tours.map((tour, index) => (
        <div key={index} className="border-t pt-4">
          <div className="flex justify-between items-start">
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
    </div>
  );
};
