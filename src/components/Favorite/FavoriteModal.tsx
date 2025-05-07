import { useState } from "react";

interface FavoriteTour {
  id: number;
  title: string;
  price: number;
  dates: {
    startDate: string;
    endDate: string;
  };
}

export default function FavoriteModal() {
  const [favoriteTours, setFavoriteTours] = useState<FavoriteTour[]>([]);

  return (
    <div className="w-full">
      {favoriteTours.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-xl text-black">У вас пока нет избранных туров</p>
          <p className="mt-2 text-black">
            Добавьте туры в избранное, чтобы они отображались здесь
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {favoriteTours.map((tour) => (
            <div
              key={tour.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg">{tour.title}</h3>
              <div className="text-sm text-gray-600 mt-2">
                {tour.dates.startDate} - {tour.dates.endDate}
              </div>
              <div className="font-bold text-right mt-2">
                {tour.price.toLocaleString()} ₽
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
