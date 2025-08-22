import { useLocation, useSearchParams } from "react-router-dom";
import useHotelToursInfo from "../Hooks/useHotelToursInfo";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import planeDeparture from "../assets/plane_departure.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { IoAirplane } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { DataContext } from "./DataProvider";

interface Tour {
  tours: {
    tour: Array<{
      meal: string;
      nights: number;
      flydate: string;
      room: string;
      adults: number;
    }>;
  };
  price: string;
  currency: string;
}

export default function HotelToursInfo() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { searchTours, tours } = useContext(DataContext);

  // Используем useState вместо let для правильного отслеживания изменений
  const [selectedTours, setSelectedTours] = useState(
    location.state?.hotelTours || []
  );
  const [hotelDescription, setHotelDescription] = useState(
    location.state?.hotelDescription || ""
  );
  const [isRestoringSearch, setIsRestoringSearch] = useState(false);

  useEffect(() => {
    // Если нет данных в state, но есть параметры в URL - восстанавливаем поиск
    if (selectedTours.length === 0 && searchParams.toString()) {
      console.log("🚀 Starting search restoration...");
      setIsRestoringSearch(true);

      // Восстанавливаем параметры поиска из URL
      const restoredParams = {
        param1: searchParams.get("departure"),
        param2: searchParams.get("country"),
        param3: {
          startDay: searchParams.get("nightsFrom")
            ? parseInt(searchParams.get("nightsFrom")!)
            : undefined,
          endDay: searchParams.get("nightsTo")
            ? parseInt(searchParams.get("nightsTo")!)
            : undefined,
        },
        param4: {
          startDate: searchParams.get("dateFrom") || undefined,
          endDate: searchParams.get("dateTo") || undefined,
        },
        param5: {
          adults: searchParams.get("adults")
            ? parseInt(searchParams.get("adults")!)
            : 2,
          childrenList: searchParams.get("children")
            ? searchParams.get("children")!.split(",").map(Number)
            : [],
        },
        param6: searchParams.get("hotelTypes")
          ? searchParams.get("hotelTypes")!.split(",")
          : [],
        param7: searchParams.get("meal") ? [searchParams.get("meal")!] : [],
        param8: searchParams.get("rating") ? [searchParams.get("rating")!] : [],
        param9: searchParams.get("stars")
          ? parseInt(searchParams.get("stars")!)
          : undefined,
        param10: searchParams.get("services")
          ? searchParams.get("services")!.split(",")
          : [],
      };

      console.log("📋 Restored params:", restoredParams);

      // Запускаем поиск с восстановленными параметрами
      searchTours(restoredParams);
    }
  }, [searchParams, selectedTours.length, searchTours]);

  // Если восстанавливаем поиск, используем результаты из контекста
  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - isRestoringSearch:",
      isRestoringSearch,
      "tours.length:",
      tours.length
    );

    if (isRestoringSearch && tours.length > 0) {
      // Фильтруем туры только для текущего отеля
      const hotelCode = location.pathname.split("/")[2]; // Получаем hotelcode из URL
      console.log("🏨 Hotel code from URL:", hotelCode);
      console.log("📊 All tours before filtering:", tours);

      const filteredTours = tours.filter(
        (tour) => tour.hotelcode === parseInt(hotelCode) // Преобразуем в число для сравнения
      );

      console.log("🎯 Filtered tours:", filteredTours);

      // Обновляем состояние через setState
      setSelectedTours(filteredTours);
      setIsRestoringSearch(false);

      console.log("✅ State updated, isRestoringSearch set to false");
    }
  }, [tours, isRestoringSearch, location.pathname]);

  const { hotel, isLoading, error } = useHotelToursInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  // Авто-прокрутка
  useEffect(() => {
    if (!isAutoPlaying || !hotel?.images?.image) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) =>
        prev === hotel.images.image.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Переключение каждые 3 секунды

    return () => clearInterval(interval);
  }, [isAutoPlaying, hotel?.images?.image?.length]);

  // Остановка авто-прокрутки при взаимодействии
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    // Возобновление авто-прокрутки через 5 секунд после взаимодействия
    setTimeout(() => setIsAutoPlaying(true), 5000);
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

  // Функция для форматирования строк с разделителями
  const formatList = (text: string) => {
    return text
      .split(";")
      .map((item) => item.trim())
      .join(", ");
  };

  const slides =
    hotel?.images?.image?.map((img: string) => ({
      src: `https:${img}`,
    })) || [];

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Функции для навигации
  const goToPrevious = () => {
    if (!hotel) return;
    setMainImageIndex((prev) =>
      prev === 0 ? hotel.images.image.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!hotel) return;
    setMainImageIndex((prev) =>
      prev === hotel.images.image.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading || isRestoringSearch) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 bg-white">
        <div className="flex justify-between gap-4">
          {/* Левая колонка с галереей */}
          <div className="flex flex-col gap-1 flex-[0.9]">
            {/* Основное фото */}
            <Skeleton className="w-full h-[400px] rounded-xl" />
            {/* Дополнительные фото */}
            <div className="grid grid-cols-4 gap-1 h-[100px]">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-full rounded-xl" />
              ))}
            </div>
            {/* Информация об отеле */}
            <div className="mt-4 space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-4/5 h-4" />
            </div>
          </div>

          {/* Правая колонка с информацией */}
          <div className="w-full flex-1">
            {/* Заголовок и рейтинг */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-12 h-4 rounded-full" />
              </div>
              <Skeleton className="w-32 h-4" />
            </div>

            {/* Название отеля */}
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-1/2 h-4 mb-4" />

            {/* Варианты туров */}
            <div className="mt-6">
              <Skeleton className="w-32 h-6 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <div className="flex justify-between items-start">
                      <div className="w-[330px] space-y-2">
                        <Skeleton className="w-48 h-3" />
                        <Skeleton className="w-40 h-3" />
                      </div>
                      <div className="w-[330px] space-y-2">
                        <Skeleton className="w-36 h-3" />
                        <Skeleton className="w-32 h-3" />
                      </div>
                      <Skeleton className="w-24 h-8 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 bg-white">
        <div className="text-red-600 text-center">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
    );
  }

  // Проверяем, есть ли туры для отображения
  if (!selectedTours || selectedTours.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto p-6 bg-white">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">Информация об отеле</h2>
          <p>Туры для данного отеля не найдены или загружаются...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-4 bg-white">
      {/* Заголовок */}
      <div className="flex flex-col gap-3">
        {/* Название и местоположение */}

        {/* Галерея и контент */}
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1 flex-[0.9]">
            {/* Основное фото */}
            <div className="w-full h-[400px] rounded-xl overflow-hidden relative group">
              <img
                src={`https:${hotel.images.image[mainImageIndex]}`}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-500 select-none pointer-events-none"
                onClick={() => handleImageClick(mainImageIndex)}
              />
              {/* Кнопки навигации */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserInteraction();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              >
                <IoChevronBackOutline size={21} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserInteraction();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              >
                <IoChevronForwardOutline size={21} />
              </button>
              {/* Индикатор слайдов */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {hotel.images.image.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === mainImageIndex ? "bg-white w-4" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Дополнительные фото */}
            <div className="grid grid-cols-4 gap-1 h-[100px]">
              {hotel.images.image.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="w-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setMainImageIndex(index + 1);
                    handleUserInteraction();
                  }}
                >
                  <img
                    src={`https:${image}`}
                    alt={`${hotel.name} ${index + 1}`}
                    className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 select-none pointer-events-none ${
                      mainImageIndex === index + 1
                        ? "opacity-70"
                        : "opacity-100"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Информация об отеле */}
            <div className="mt-4 space-y-3">
              <div className="">
                <h2 className="text-lg font-semibold text-[#2E2E32]">
                  Информация об отеле:
                </h2>
                <div className="text-base text-[#6B7280]">
                  {hotelDescription} {""}
                  {hotel.description}
                </div>
              </div>

              {hotel.placement && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Расположение:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {hotel.placement}
                  </div>
                </div>
              )}

              {hotel.territory && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Территория отеля:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {formatList(hotel.territory)}
                  </div>
                </div>
              )}

              {hotel.inroom && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    В номере:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {formatList(hotel.inroom)}
                  </div>
                </div>
              )}

              {hotel.roomtypes && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Типы номеров:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {formatList(hotel.roomtypes)}
                  </div>
                </div>
              )}

              {hotel.services && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Услуги отеля:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {formatList(hotel.services)}
                  </div>
                </div>
              )}

              {hotel.meallist && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Питание:
                  </h3>
                  <div className="text-base text-[#6B7280]">
                    {formatList(hotel.meallist)}
                  </div>
                </div>
              )}

              {hotel.build && (
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Год постройки:
                  </h3>
                  <div className="text-base text-[#6B7280]">{hotel.build}</div>
                </div>
              )}
            </div>
          </div>

          {/* Варианты туров */}
          <div className="w-full flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={i < parseInt(hotel.stars) ? starFilled : starOutline}
                      alt={
                        i < parseInt(hotel.stars)
                          ? "filled star"
                          : "outline star"
                      }
                      className="w-4 h-4"
                    />
                  ))}
                </div>
                {hotel.rating !== "0" && (
                  <div className="bg-[#FF621F] text-white text-xs font-medium px-2 py-0.5 rounded-[20px]">
                    {hotel.rating.length === 1
                      ? `${hotel.rating}.0`
                      : hotel.rating}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-base text-[#6B7280]">
                <span className="text-[#FF621F] text-base">
                  вылет из Бишкека
                </span>
                <img
                  src={planeDeparture}
                  alt="Plane Departure"
                  className="w-4 h-4"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-[#2E2E32]">{hotel.name}</h1>
              <div className="flex justify-between items-center pb-1">
                <p className="text-base text-[#6B7280]">
                  {hotel.country}, {hotel.region}
                </p>
                <div className="flex gap-3">
                  {/* Добавляем проверку безопасности */}
                  {selectedTours[0]?.tours?.tour?.[0]?.meal && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#2E2E32]">
                        {getMealType(selectedTours[0].tours.tour[0].meal)}
                      </span>
                      <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                    </div>
                  )}
                  {hotel.beach && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#2E2E32]">
                        Береговая линия
                      </span>
                      <FaUmbrellaBeach className="w-3.5 h-3.5 text-[#2E2E32]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Варианты туров */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#2E2E32] mb-4">
                Варианты туров
              </h3>
              <div className="space-y-4">
                {selectedTours.map((tour: Tour, tourIndex: number) =>
                  tour.tours.tour.map((tourVariant, variantIndex: number) => (
                    <div
                      key={`${tourIndex}-${variantIndex}`}
                      className="space-y-2"
                    >
                      <h4 className="text-base font-semibold text-[#2E2E32]">
                        Вариант {variantIndex + 1}
                      </h4>
                      <div className="flex justify-between items-start">
                        <div className="w-[330px] space-y-2">
                          <p className="text-xs font-medium text-[#2E2E32]">
                            {getMealType(tourVariant.meal)},{" "}
                            {tourVariant.nights} ночей
                          </p>
                          <p className="text-xs font-semibold text-[#2E2E32]">
                            {`Номер ${tourVariant.room}, ${tourVariant.adults} взрослых`}
                          </p>
                        </div>
                        <div className="w-[330px] space-y-2">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-semibold text-[#6B7280]">
                              {formatDate(tourVariant.flydate)} –{" "}
                              {getEndDate(
                                tourVariant.flydate,
                                tourVariant.nights
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoAirplane className="w-3.5 h-3.5 text-[#2E2E32]" />
                            <span className="text-xs font-medium text-[#2E2E32]">
                              Pegasus Airlines
                            </span>
                            <span className="text-xs text-[#B3B9C0]">
                              Kompas (KZ)
                            </span>
                          </div>
                        </div>
                        <button className="bg-[#FF621F] text-white px-2 py-1 rounded-lg flex items-center gap-2">
                          <span className="text-base font-semibold">
                            {tour.price}
                            {tour.currency === "EUR"
                              ? "€"
                              : tour.currency === "USD"
                              ? "$"
                              : tour.currency}
                          </span>
                          <IoAirplane className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        plugins={[Thumbnails]}
        index={currentIndex}
      />
    </div>
  );
}
