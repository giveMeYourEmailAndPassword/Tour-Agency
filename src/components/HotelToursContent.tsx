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
  return (
    <div className="space-y-4">
      {tours.map((tour, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex gap-2 items-center">
                <span className="text-lg font-semibold">{tour.tourname}</span>
                <span className="text-sm text-gray-500">
                  ({tour.operatorname})
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <p>Дата вылета: {tour.flydate}</p>
                <p>Ночей: {tour.nights}</p>
                <p>Тип номера: {tour.room}</p>
                <p>Питание: {tour.mealrussian}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {tour.price}
                {tour.currency === "EUR"
                  ? "€"
                  : tour.currency === "USD"
                  ? "$"
                  : tour.currency}
              </p>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition">
                Забронировать
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
