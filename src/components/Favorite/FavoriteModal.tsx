import { FavoriteTourData } from "../../components/DataProvider";

interface FavoriteModalProps {
  tours: FavoriteTourData[];
}

export default function FavoriteModal({ tours }: FavoriteModalProps) {
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {tours.map((tour) => (
            <div
              key={`${tour.hotelcode}_${tour.tourId}`}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg">{tour.hotelName}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Вылет: {tour.departure}</p>
                <p>Дата: {tour.flyDate}</p>
                <p>Ночей: {tour.nights}</p>
                <p>Питание: {tour.meal}</p>
              </div>
              <div className="font-bold text-right mt-2">
                {tour.price} {tour.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
