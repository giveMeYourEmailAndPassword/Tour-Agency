import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import useHotelToursInfo from "../Hooks/useHotelToursInfo";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import bookingIcon from "../assets/booking.svg";
import planeDeparture from "../assets/plane_departure.svg";
import calendarIcon from "../assets/calendar.svg";
import moonStarsIcon from "../assets/moon_stars.svg";
import personLuggageIcon from "../assets/person_luggage.svg";
import bedAltIcon from "../assets/bed_alt.svg";
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
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Header from "./Header";

interface Tour {
  tours: {
    tour: Array<{
      meal: string;
      nights: number;
      flydate: string;
      room: string;
      adults: number;
      tourid: string; // Добавляем tourid
      price?: string; // Добавляем опциональную цену для варианта
      currency?: string; // Добавляем опциональную валюту для варианта
      operatorname?: string; // Добавляем название оператора
    }>;
  };
  price: string;
  currency: string;
}

export default function HotelToursInfo() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Добавляем useNavigate
  const {
    searchTours,
    tours,
    addToFavorite,
    removeFromFavorite,
    favoriteTours,
  } = useContext(DataContext);

  // Используем useState вместо let для правильного отслеживания изменений
  const [selectedTours, setSelectedTours] = useState(
    location.state?.hotelTours || []
  );
  const [hotelDescription] = useState(location.state?.hotelDescription || "");
  const [isRestoringSearch, setIsRestoringSearch] = useState(false);
  const [showAllVariants, setShowAllVariants] = useState(false);

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
        // Добавляем новый параметр
        param11: searchParams.get("charterOnly") === "true",
      };

      console.log("📋 Restored params:", restoredParams);

      // Запускаем поиск с восстановленными параметрами
      // searchTours(restoredParams);
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

  // Авто-прокрутка
  useEffect(() => {
    if (!isAutoPlaying || !hotel?.images?.image) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) =>
        prev === hotel.images.image.length - 1 ? 0 : prev + 1
      );
    }, 3000); // Переключение каждые 3 секунды

    return () => clearInterval(interval);
  }, [isAutoPlaying, hotel?.images?.image?.length, hotel?.images?.image]);

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

  // Функция для проверки, находится ли тур в избранном
  const isTourFavorite = (
    tour: Tour,
    _tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const tourId = tourVariant.tourid; // Используем tourid из данных
    const hotelCode = location.pathname.split("/")[2];
    return favoriteTours.some(
      (favTour) => favTour.hotelcode === hotelCode && favTour.tourId === tourId
    );
  };

  // Функция для добавления/удаления из избранного
  const handleFavoriteClick = (
    tour: Tour,
    _tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const tourId = tourVariant.tourid; // Используем tourid из данных
    const hotelCode = location.pathname.split("/")[2];

    const tourData = {
      hotelcode: hotelCode,
      tourId: tourId,
    };

    if (isTourFavorite(tour, _tourIndex, variantIndex)) {
      removeFromFavorite(hotelCode, tourId);
    } else {
      addToFavorite(tourData);
    }
  };

  // Добавляем функцию для перехода в Booking
  const handleBookingClick = (
    tour: Tour,
    _tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const hotelCode = location.pathname.split("/")[2];

    // Сохраняем данные о туре в localStorage для страницы бронирования
    const bookingData = {
      hotelName: hotel?.name || "",
      departure: getDepartureCity(),
      flyDate: tourVariant.flydate,
      nights: tourVariant.nights,
      adults: tourVariant.adults.toString(),
      price: tourVariant.price || tour.price,
      currency: tourVariant.currency || tour.currency,
      country: hotel?.country || "",
      region: hotel?.region || "",
      mealType: getMealType(tourVariant.meal),
      roomType: tourVariant.room,
      hotelcode: hotelCode,
      operatorLink: tourVariant.operatorname || "Pegasus Airlines",
    };

    localStorage.setItem(
      `booking_${hotelCode}_${tourVariant.tourid}`,
      JSON.stringify(bookingData)
    );

    // Переходим на страницу бронирования
    navigate(`/hotel/${hotelCode}/${tourVariant.tourid}/booking`);
  };

  // Функция для определения города вылета
  const getDepartureCity = () => {
    const departure = searchParams.get("departure");
    switch (departure) {
      case "80":
        return "Бишкека";
      case "60":
        return "Алматы";
      default:
        return "Бишкека"; // значение по умолчанию
    }
  };

  if (isLoading || isRestoringSearch) {
    return (
      <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
        <Header />
        <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
          <div className="max-w-[1560px] mx-auto px-6 py-4">
            <div className="flex justify-between gap-3">
              {/* Левая колонка с галереей */}
              <div className="flex flex-col gap-1 flex-[0.9]">
                {/* Основное фото */}
                <Skeleton className="w-full h-[400px] rounded-xl" />
                {/* Дополнительные фото */}
                <div className="grid grid-cols-4 gap-1 h-[100px]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-full h-full rounded-xl"
                    />
                  ))}
                </div>
                {/* Информация об отеле */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="mt-4 space-y-3">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-4/5 h-4" />
                  </div>
                ))}
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
                    {Array.from({ length: 7 }).map((_, index) => (
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
                          <div className="flex items-center gap-2">
                            {/* Скелетон кнопки избранного */}
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            {/* Скелетон кнопки цены */}
                            <Skeleton className="w-24 h-8 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Скелетон кнопки "Показать еще" если вариантов много */}
                    <div className="flex justify-center pt-4">
                      <Skeleton className="w-48 h-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
        <Header />
        <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
          <div className="max-w-[1560px] mx-auto px-6 py-4">
            <div className="text-red-600 text-center">
              Не удалось загрузить информацию об отеле
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли туры для отображения
  if (!selectedTours || selectedTours.length === 0) {
    return (
      <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
        <Header />
        <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
          <div className="max-w-[1560px] mx-auto px-6 py-4">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">
                Информация об отеле
              </h2>
              <p>Туры для данного отеля не найдены или загружаются...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
      <Header />
      <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
        <div className="max-w-[1440px] mx-auto py-4">
          {/* Заголовок */}
          <div className="flex flex-col gap-3">
            {/* Галерея и контент */}
            <div className="flex justify-between gap-3">
              <div className="flex flex-col gap-1 flex-[1]">
                {/* Основное фото */}
                <div className="w-full h-[400px] rounded-xl overflow-hidden relative group">
                  <img
                    src={`https:${hotel.images.image[mainImageIndex]}`}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 select-none"
                    onClick={() => handleImageClick(mainImageIndex)}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
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
                          index === mainImageIndex
                            ? "bg-white w-4"
                            : "bg-gray-300"
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
                        className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 select-none ${
                          mainImageIndex === index + 1
                            ? "opacity-70"
                            : "opacity-100"
                        }`}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
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

                  {(hotel as any).placement && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Расположение:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {(hotel as any).placement}
                      </div>
                    </div>
                  )}

                  {(hotel as any).territory && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Территория отеля:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {formatList((hotel as any).territory)}
                      </div>
                    </div>
                  )}

                  {(hotel as any).inroom && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        В номере:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {formatList((hotel as any).inroom)}
                      </div>
                    </div>
                  )}

                  {(hotel as any).roomtypes && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Типы номеров:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {formatList((hotel as any).roomtypes)}
                      </div>
                    </div>
                  )}

                  {(hotel as any).services && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Услуги отеля:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {Array.isArray((hotel as any).services)
                          ? (hotel as any).services.join(", ")
                          : formatList((hotel as any).services)}
                      </div>
                    </div>
                  )}

                  {(hotel as any).meallist && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Питание:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {formatList((hotel as any).meallist)}
                      </div>
                    </div>
                  )}

                  {(hotel as any).build && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32]">
                        Год постройки:
                      </h3>
                      <div className="text-base text-[#6B7280]">
                        {(hotel as any).build}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Варианты туров */}
              <div className="w-[45%]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
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
                      вылет из {getDepartureCity()}
                    </span>
                    <img
                      src={planeDeparture}
                      alt="Plane Departure"
                      className="w-4 h-4"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-[#2E2E32]">
                    {hotel.name}
                  </h1>
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
                  <h3 className="text-lg font-semibold text-[#2E2E32] mb-3">
                    Варианты туров
                  </h3>
                  <div className="space-y-2">
                    {(() => {
                      // Подсчитываем общее количество вариантов
                      const totalVariants = selectedTours.reduce(
                        (total: number, tour: Tour) =>
                          total + tour.tours.tour.length,
                        0
                      );

                      // Определяем, какие варианты показывать
                      const variantsToShow = showAllVariants
                        ? selectedTours
                        : selectedTours.map((tour: Tour) => ({
                            ...tour,
                            tours: {
                              ...tour.tours,
                              tour: tour.tours.tour.slice(0, 7),
                            },
                          }));

                      // Подсчитываем количество показанных вариантов
                      const shownVariants = variantsToShow.reduce(
                        (total: number, tour: Tour) =>
                          total + tour.tours.tour.length,
                        0
                      );

                      return (
                        <>
                          {variantsToShow.map((tour: Tour, tourIndex: number) =>
                            tour.tours.tour.map(
                              (tourVariant, variantIndex: number) => (
                                <div
                                  key={`${tourIndex}-${variantIndex}`}
                                  className="bg-white rounded-[10px] p-4 border border-gray-100"
                                >
                                  {/* Заголовок блока */}
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-lg font-semibold text-[#2E2E32]">
                                      Вариант {variantIndex + 1}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {/* Кнопка избранного */}
                                      <button
                                        onClick={() =>
                                          handleFavoriteClick(
                                            tour,
                                            tourIndex,
                                            variantIndex
                                          )
                                        }
                                        className={`p-2 rounded-lg border-2 transition-colors ${
                                          isTourFavorite(
                                            tour,
                                            tourIndex,
                                            variantIndex
                                          )
                                            ? "border-[#FF621F] text-[#FF621F] hover:bg-orange-50"
                                            : "border-gray-300 text-gray-400 hover:border-[#FF621F] hover:text-[#FF621F]"
                                        }`}
                                        title={
                                          isTourFavorite(
                                            tour,
                                            tourIndex,
                                            variantIndex
                                          )
                                            ? "Убрать из избранного"
                                            : "Добавить в избранное"
                                        }
                                      >
                                        {isTourFavorite(
                                          tour,
                                          tourIndex,
                                          variantIndex
                                        ) ? (
                                          <FaHeart size={16} />
                                        ) : (
                                          <FaRegHeart size={16} />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Основная информация о туре */}
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Левая колонка */}
                                    <div className="space-y-4">
                                      {/* Даты поездки */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                          <img
                                            src={calendarIcon}
                                            alt="Calendar"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-base font-medium text-[#2E2E32] mb-1">
                                            Даты поездки
                                          </p>
                                          <p className="text-sm text-[#6B7280]">
                                            {formatDate(tourVariant.flydate)} —{" "}
                                            {getEndDate(
                                              tourVariant.flydate,
                                              tourVariant.nights
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Туристы */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                          <img
                                            src={personLuggageIcon}
                                            alt="Person with luggage"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-base font-medium text-[#2E2E32] mb-1">
                                            Туристы
                                          </p>
                                          <p className="text-sm text-[#6B7280]">
                                            {tourVariant.adults} взрослых
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Правая колонка */}
                                    <div className="space-y-4 mb-2">
                                      {/* Номер */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                          <img
                                            src={bedAltIcon}
                                            alt="Bed"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-base font-medium text-[#2E2E32] mb-1">
                                            Номер
                                          </p>
                                          <p className="text-sm text-[#6B7280]">
                                            {tourVariant.room}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Длительность */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                          <img
                                            src={moonStarsIcon}
                                            alt="Moon with stars"
                                            className="w-5 h-5"
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-base font-medium text-[#2E2E32] mb-1">
                                            Длительность
                                          </p>
                                          <p className="text-sm text-[#6B7280]">
                                            {tourVariant.nights} ночей
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Дополнительная информация */}

                                  {/* Кнопки действий */}
                                  <div className="flex gap-2">
                                    <div className="p-2 bg-gray-50 rounded-lg w-[50%] flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <IoAirplane className="w-4 h-4 text-[#2E2E32]" />
                                        <span className="text-sm font-medium text-[#2E2E32]">
                                          {tourVariant.operatorname ||
                                            "Pegasus Airlines"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                                        <span className="text-sm text-[#6B7280]">
                                          {getMealType(tourVariant.meal)}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleBookingClick(
                                          tour,
                                          tourIndex,
                                          variantIndex
                                        )
                                      }
                                      className="w-[50%] bg-[#FF621F] text-white px-4 py-2 rounded-[10px] flex items-center justify-center gap-4 hover:bg-[#E55A1A] transition-colors font-medium"
                                    >
                                      <span className="text-base font-bold">
                                        {tourVariant.price || tour.price}
                                        {tourVariant.currency === "EUR"
                                          ? "€"
                                          : tourVariant.currency === "USD"
                                          ? "$"
                                          : tourVariant.currency ||
                                            tour.currency === "EUR"
                                          ? "€"
                                          : tour.currency === "USD"
                                          ? "$"
                                          : tour.currency}
                                      </span>
                                      <img
                                        src={bookingIcon}
                                        alt="Booking"
                                        className="w-6 h-6"
                                      />
                                    </button>
                                  </div>
                                </div>
                              )
                            )
                          )}

                          {/* Кнопка "Показать все варианты" или "Скрыть" */}
                          {totalVariants > 7 && (
                            <div className="flex justify-center pt-4">
                              <button
                                onClick={() =>
                                  setShowAllVariants(!showAllVariants)
                                }
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors font-medium"
                              >
                                {showAllVariants
                                  ? `Скрыть варианты (показано ${totalVariants})`
                                  : `Показать еще ${
                                      totalVariants - shownVariants
                                    } вариантов (показано ${shownVariants} из ${totalVariants})`}
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
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
