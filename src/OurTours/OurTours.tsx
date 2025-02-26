import { useContext } from "react";
import { DataContext } from "../components/DataProvider";
import { GoStarFill } from "react-icons/go";

export default function OurTours() {
  const { tours, loading, error } = useContext(DataContext);

  if (loading) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        Загрузка туров...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        {error}
      </p>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        Туры не найдены
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-8 p-12 justify-center items-center bg-gray-50">
      {tours.length > 0 ? (
        tours.map((hotel, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl flex flex-col
             w-[30rem] h-[34rem]"
          >
            <div className="relative h-64 mb-4">
              <img
                src={hotel.picturelink || "/placeholder.jpg"}
                alt={hotel.hotelname}
                className="rounded-xl w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <GoStarFill
                      key={index}
                      className="w-4 h-4"
                      color={index < hotel.hotelstars ? "#FFD700" : "#E5E7EB"}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 h-[3.2rem]">
                    {hotel.hotelname}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {hotel.regionname}
                  </p>
                </div>

                <p className="text-gray-600 line-clamp-3 h-[4.5rem]">
                  {hotel.hoteldescription || "Нет описания"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <div className="text-gray-900">
                  От{" "}
                  <span className="text-2xl font-bold text-blue-600">
                    {hotel.price ? `$${hotel.price}` : "Цена не указана"}
                  </span>
                  <span className="text-sm text-gray-500"> за человека</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500">Нет доступных туров</p>
      )}
    </div>
  );
}
