import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../../components/DataProvider";
import { Skeleton } from "@heroui/react";
import HeaderMOT from "./HeaderMOT";
import starFilled from "../../assets/star_fill.svg";
import starOutline from "../../assets/star_unfill.svg";
import utensils from "../../assets/utensils.svg";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { ProgressBar } from "../../components/Loading/ProgressBar";

// Добавляем вспомогательные функции из SearchResults
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 3) {
    return words.slice(0, 4).join(" ") + "...";
  }
  return name;
};

const formatDate = (dateString: string) => {
  const date = parse(dateString, "dd.MM.yyyy", new Date());
  return format(date, "d MMMM", { locale: ru });
};

const getEndDate = (startDate: string, nights: number) => {
  const date = parse(startDate, "dd.MM.yyyy", new Date());
  return format(addDays(date, nights), "d MMMM", { locale: ru });
};

const getMealType = (meal: string) => {
  const mealTypes: { [key: string]: string } = {
    "": "Без питания",
    BB: "Завтрак",
    HB: "Полупансион",
    FB: "Полный пансион",
    AI: "Всё включено",
    UAI: "Ультра всё включено",
    RO: "Без питания",
  };
  return mealTypes[meal] || meal;
};

export default function MobileOurTours() {
  const {
    tours,
    loading,
    error,
    tourDataStatus,
    fetchNextPage,
    isFetchingNextPage,
    searchTours,
    setData,
  } = useContext(DataContext);

  const location = useLocation();
  const initialSearchDone = useRef(false);

  // Эффект для установки параметров и запуска поиска
  useEffect(() => {
    if (initialSearchDone.current) return;

    const searchParams = new URLSearchParams(location.search);

    // Устанавливаем параметры из URL
    if (searchParams.has("departure"))
      setData("param1", searchParams.get("departure"));
    if (searchParams.has("country"))
      setData("param2", searchParams.get("country"));

    if (searchParams.has("nightsFrom") || searchParams.has("nightsTo")) {
      setData("param3", {
        startDay: searchParams.get("nightsFrom")
          ? parseInt(searchParams.get("nightsFrom")!)
          : undefined,
        endDay: searchParams.get("nightsTo")
          ? parseInt(searchParams.get("nightsTo")!)
          : undefined,
      });
    }

    if (searchParams.has("dateFrom") || searchParams.has("dateTo")) {
      setData("param4", {
        startDate: searchParams.get("dateFrom") || undefined,
        endDate: searchParams.get("dateTo") || undefined,
      });
    }

    if (searchParams.has("adults") || searchParams.has("children")) {
      setData("param5", {
        adults: searchParams.get("adults")
          ? parseInt(searchParams.get("adults")!)
          : 2,
        childrenList: searchParams.get("children")
          ? searchParams.get("children")!.split(",").map(Number)
          : [],
      });
    }

    if (searchParams.has("hotelTypes"))
      setData("param6", searchParams.get("hotelTypes")!.split(","));
    if (searchParams.has("meal"))
      setData("param7", [searchParams.get("meal")!]);
    if (searchParams.has("rating"))
      setData("param8", [searchParams.get("rating")!]);
    if (searchParams.has("stars"))
      setData("param9", parseInt(searchParams.get("stars")!));
    if (searchParams.has("services"))
      setData("param10", searchParams.get("services")!.split(","));

    // Запускаем поиск только если есть необходимые параметры и поиск еще не был выполнен
    if (searchParams.has("departure") && searchParams.has("country")) {
      initialSearchDone.current = true;
      searchTours();
    }
  }, [location.search, setData, searchTours]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <ProgressBar />
        <HeaderMOT />
        <div className="mx-2 flex-grow pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
            {[...Array(36)].map((_, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
              >
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="w-full h-44 md:h-36 rounded" />
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex justify-between items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        <Skeleton className="w-24 h-4" />
                      </div>
                      <Skeleton className="w-24 h-4" />
                    </div>
                    <Skeleton className="w-full h-7" />
                    <Skeleton className="w-3/4 h-5" />
                  </div>
                  <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                    <Skeleton className="w-20 h-6" />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <Skeleton className="w-20 h-7" />
                    <div className="flex flex-col items-end gap-1">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <ProgressBar />
        <HeaderMOT />
        <div className="mx-2 flex-grow">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (
    tourDataStatus?.state === "finished" &&
    tourDataStatus?.toursfound === 0
  ) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <ProgressBar />
        <HeaderMOT />
        <div className="mx-2 flex-grow">
          <div className="text-center text-gray-500">
            По вашему запросу ничего не найдено
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <ProgressBar />
      <HeaderMOT />
      <div className="mx-2 flex-grow pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
          {tours.map((hotel, index) => (
            <div
              key={index}
              className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]"
            >
              <div className="w-full flex flex-col gap-2">
                {/* Изображение */}
                <div className="w-full h-44 md:h-36 rounded">
                  <img
                    src={hotel.picturelink}
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
                          src={i < hotel.hotelstars ? starFilled : starOutline}
                          alt={
                            i < hotel.hotelstars
                              ? "filled star"
                              : "outline star"
                          }
                          className="w-4 h-4"
                        />
                      ))}
                      {hotel.hotelrating !== "0" && (
                        <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                          {hotel.hotelrating.length === 1
                            ? `${hotel.hotelrating}.0`
                            : hotel.hotelrating}
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                    {truncateHotelName(hotel.hotelname)}
                  </h3>
                  <p className="text-[#6B7280] text-base leading-[1.29]">
                    {hotel.regionname}
                    {hotel.subregionname == 0 ? "" : `, ${hotel.subregionname}`}
                  </p>
                </div>

                {/* Теги */}
                <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[#2E2E32]">
                      {getMealType(hotel.tours.tour[0].meal)}
                    </span>
                    <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Цена и даты */}
                <div className="w-full flex justify-between items-center">
                  <span className="text-xl font-bold text-[#2E2E32]">
                    {hotel.price}
                    {hotel.currency === "EUR"
                      ? "€"
                      : hotel.currency === "USD"
                      ? "$"
                      : hotel.currency}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#2E2E32]">
                      {formatDate(hotel.tours.tour[0].flydate)} -{" "}
                      {getEndDate(
                        hotel.tours.tour[0].flydate,
                        hotel.tours.tour[0].nights
                      )}
                    </span>
                    <span className="text-sm text-[#6B7280]">
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
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 mt-2"
            >
              {isFetchingNextPage ? "Загрузка..." : "Показать еще туры"}
            </button>
          )}
      </div>
    </div>
  );
}
