import { useContext, useState } from "react";
import { DataContext } from "../components/DataProvider";
import { GoStarFill } from "react-icons/go";
import { useFormatDate } from "../Hooks/useFormatDate";

export default function OurTours() {
  const { tours, loading, error, tourDataStatus } = useContext(DataContext);
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const { formatDate } = useFormatDate();

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

  console.log(tourDataStatus);

  const toggleTours = (hotelIndex: number) => {
    setExpandedCards((prev: { [key: number]: boolean }) => ({
      ...prev,
      [hotelIndex]: !prev[hotelIndex],
    }));
  };

  return (
    <div className="flex flex-wrap gap-8 p-12 justify-center items-stretch bg-gray-50">
      {tours.length && tours[0]?.tours?.tour ? (
        tours.map((hotel, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl flex flex-col
             w-[32rem] min-h-[45rem]"
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

            <div className="flex flex-col flex-1">
              <div className="space-y-4 flex-grow">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 h-[3.2rem]">
                    {hotel.hotelname}
                  </h3>
                  <p className="text-blue-600 font-medium">
                    {hotel.regionname}
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => window.open(hotel.fulldesclink, "_blank")}
                  >
                    Об отеле
                  </button>
                  {hotel.iscoords && (
                    <button
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => {
                        /* Добавить логику открытия карты */
                      }}
                    >
                      На карте
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-semibold mb-2">Информация о туре:</h4>
                  <div className="min-h-[15rem]">
                    {hotel.tours.tour
                      .slice(0, expandedCards[index] ? undefined : 3)
                      .map((tour: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-4 rounded-lg mb-3 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <p className="font-medium text-gray-900">
                                {tour.tourname}
                              </p>
                              <p className="text-gray-600">
                                Дата:{" "}
                                {formatDate(tour.flydate, {
                                  inputFormat: "dd.MM.yyyy",
                                  outputFormat: "d MMMM",
                                })}
                              </p>
                              <p className="text-gray-600">
                                Ночей: {tour.nights}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
                              {tour.price}$
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {hotel.tours.tour.length > 3 && (
                    <button
                      onClick={() => toggleTours(index)}
                      className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      {expandedCards[index] ? (
                        <>
                          <span>Показать меньше</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>
                            Показать еще {hotel.tours.tour.length - 3} туров
                          </span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <div className="text-gray-600 text-sm">
                  <p>До моря: {hotel.seadistance}м</p>
                  <p>Рейтинг: {hotel.hotelrating}/5</p>
                </div>
                {hotel.isreviews && (
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => window.open(hotel.reviewlink, "_blank")}
                  >
                    Отзывы
                  </button>
                )}
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
