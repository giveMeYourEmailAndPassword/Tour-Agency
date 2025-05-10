import { FavoriteTourData } from "../../components/DataProvider";
import useHotelDetails from "../../Hooks/UseHotelDetails";
import { useMemo } from "react";

interface FavoriteModalProps {
  tours: FavoriteTourData[];
}

function FavoriteTourCard({ tour }: { tour: FavoriteTourData }) {
  const { data, isLoading } = useHotelDetails(tour.hotelcode, tour.tourId);

  const tourData = data?.tour?.data?.tour;
  const hotelData = data?.hotel?.data?.hotel;

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse text-gray-400">Загрузка данных...</div>
        </div>
      </div>
    );
  }

  if (!tourData || !hotelData) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Не удалось загрузить данные</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <h3 className="font-medium text-lg text-gray-900">{hotelData.name}</h3>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-600">
          Вылет из: {tourData.departurename}
        </p>
        <p className="text-sm text-gray-600">Дата: {tourData.flydate}</p>
        <p className="text-sm text-gray-600">{tourData.nights} ночей</p>
        <p className="text-sm text-gray-600">Питание: {tourData.meal}</p>
      </div>
      <div className="mt-3 text-right">
        <span className="text-lg font-bold text-gray-900">
          {tourData.price}
          {tourData.currency === "EUR"
            ? "€"
            : tourData.currency === "USD"
            ? "$"
            : tourData.currency}
        </span>
      </div>
    </div>
  );
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
