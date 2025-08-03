import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../DataProvider";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import starFilled from "../../../assets/icons/star-filled.svg";
import starOutline from "../../../assets/icons/star-outline.svg";
import utensils from "../../../assets/icons/utensils.svg";
import bed from "../../../assets/icons/bed.svg";

// Функция для обрезки названия отеля после 3-го пробела
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 3) {
    return words.slice(0, 3).join(" ") + "...";
  }
  return name;
};

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = parse(dateString, "dd.MM.yyyy", new Date());
  return format(date, "d MMMM", { locale: ru });
};

// Получение конечной даты
const getEndDate = (startDate: string, nights: number) => {
  const date = parse(startDate, "dd.MM.yyyy", new Date());
  return format(addDays(date, nights), "d MMMM", { locale: ru });
};

// Определение типа питания
const getMealType = (meal: string) => {
  const mealTypes: { [key: string]: string } = {
    BB: "Завтрак",
    HB: "Полупансион",
    FB: "Полный пансион",
    AI: "Всё включено",
    UAI: "Ультра всё включено",
    RO: "Без питания",
  };
  return mealTypes[meal] || meal;
};

export default function SearchResult() {
  const {
    tours,
    loading,
    error,
    tourDataStatus,
    cities,
    countries,
    params,
    fetchNextPage,
    isFetchingNextPage,
    searchTours,
  } = useContext(DataContext);

  // Состояние для отслеживания попыток поиска
  const [searchAttempts, setSearchAttempts] = useState(0);

  // Эффект для автоматического перезапуска поиска
  useEffect(() => {
    if (tours.length === 0 && !loading && searchAttempts < 3) {
      const timer = setTimeout(() => {
        setSearchAttempts((prev) => prev + 1);
        searchTours();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [tours.length, loading, searchAttempts]);

  // Получаем выбранный город и страну
  const selectedCity =
    cities.find((city) => city.id === params?.param1)?.label || "";
  const selectedCountry =
    countries.find((country) => country.id === params?.param2)?.label || "";

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF621F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Произошла ошибка при загрузке данных.
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F1F4F8] py-8">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Заголовок с результатами */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#2E2E32]">
            {tours.length > 0
              ? `Найдено ${tourDataStatus?.hotelsfound || tours.length} туров`
              : searchAttempts >= 3
              ? "К сожалению, по вашему запросу ничего не найдено"
              : "Поиск туров..."}
          </h2>
        </div>

        {/* Сетка с турами */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tours.map((hotel: any, index: number) => (
            <div
              key={index}
              className="w-72 flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
            >
              <div className="w-64 flex flex-col gap-2">
                {/* Изображение */}
                <div className="w-full h-36 rounded">
                  <img
                    src={
                      hotel.picturelink
                        ? `https:${hotel.picturelink}`
                        : "/default-image.jpg"
                    }
                    alt={hotel.hotelname}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Информация об отеле */}
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < parseInt(hotel.stars) ? starFilled : starOutline
                          }
                          alt={
                            i < parseInt(hotel.stars)
                              ? "filled star"
                              : "outline star"
                          }
                          className="w-4 h-4"
                        />
                      ))}
                      {hotel.rating !== "0" && (
                        <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                          {hotel.rating}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-[#FF621F]">
                      из {selectedCity}
                    </span>
                  </div>

                  <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                    {truncateHotelName(hotel.hotelname)}
                  </h3>
                  <p className="text-[#6B7280] text-sm font-light leading-[1.29]">
                    {selectedCountry}, {hotel.regionname}
                  </p>
                </div>

                {/* Теги */}
                <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                  <div className="flex items-center gap-1">
                    <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                    <span className="text-sm text-[#2E2E32]">
                      {getMealType(hotel.tours.tour[0].meal)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src={bed} alt="room" className="w-3.5 h-3.5" />
                    <span className="text-sm text-[#2E2E32]">
                      {hotel.tours.tour[0].room}
                    </span>
                  </div>
                </div>

                {/* Цена и даты */}
                <div className="w-full flex justify-between items-center">
                  <span className="text-xl font-bold text-[#2E2E32]">
                    {hotel.tours.tour[0].price}
                    {hotel.tours.tour[0].currency === "EUR"
                      ? "€"
                      : hotel.tours.tour[0].currency === "USD"
                      ? "$"
                      : hotel.tours.tour[0].currency}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#2E2E32]">
                      {formatDate(hotel.tours.tour[0].flydate)} -{" "}
                      {getEndDate(
                        hotel.tours.tour[0].flydate,
                        parseInt(hotel.tours.tour[0].nights)
                      )}
                    </span>
                    <span className="text-xs font-light text-[#6B7280]">
                      кол-во ночей: {hotel.tours.tour[0].nights}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка "Показать еще" */}
        {tourDataStatus?.state === "finished" &&
          tours.length < tourDataStatus?.hotelsfound && (
            <div className="w-full flex justify-center mt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-[#FF621F] text-white rounded-lg hover:bg-[#E55A1C] transition-colors disabled:bg-gray-400 w-[200px]"
              >
                {isFetchingNextPage ? "Загрузка..." : "Показать еще"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
