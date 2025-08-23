import { useLocation, useSearchParams } from "react-router-dom";
import useHotelToursInfo from "../Hooks/useHotelToursInfo";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import planeDeparture from "../assets/plane_departure.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { DataContext } from "./DataProvider";
import { FaCalendar, FaUser, FaBed, FaMoon } from "react-icons/fa";
import { FaEdit, FaBookmark } from "react-icons/fa";

interface Tour {
  tours: {
    tour: Array<{
      meal: string;
      nights: number;
      flydate: string;
      room: string;
      adults: number;
      tourid: string;
      price?: string;
      currency?: string;
      operatorname?: string;
    }>;
  };
  price: string;
  currency: string;
}

export default function MobileHotelToursInfo() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    searchTours,
    tours,
    addToFavorite,
    removeFromFavorite,
    favoriteTours,
  } = useContext(DataContext);

  const [selectedTours, setSelectedTours] = useState(
    location.state?.hotelTours || []
  );
  const [hotelDescription, setHotelDescription] = useState(
    location.state?.hotelDescription || ""
  );
  const [isRestoringSearch, setIsRestoringSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showAllVariants, setShowAllVariants] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (selectedTours.length === 0 && searchParams.toString()) {
      console.log("🚀 Starting search restoration...");
      setIsRestoringSearch(true);

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
      searchTours(restoredParams);
    }
  }, [searchParams, selectedTours.length, searchTours]);

  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - isRestoringSearch:",
      isRestoringSearch,
      "tours.length:",
      tours.length
    );

    if (isRestoringSearch && tours.length > 0) {
      const hotelCode = location.pathname.split("/")[2];
      console.log("🏨 Hotel code from URL:", hotelCode);
      console.log("📊 All tours before filtering:", tours);

      const filteredTours = tours.filter(
        (tour) => tour.hotelcode === parseInt(hotelCode)
      );

      console.log("🎯 Filtered tours:", filteredTours);
      setSelectedTours(filteredTours);
      setIsRestoringSearch(false);
      console.log("✅ State updated, isRestoringSearch set to false");
    }
  }, [tours, isRestoringSearch, location.pathname]);

  const { hotel, isLoading, error } = useHotelToursInfo();

  // Авто-прокрутка
  useEffect(() => {
    if (!isAutoPlaying || !hotel?.images?.image) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) =>
        prev === hotel.images.image.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, hotel?.images?.image?.length]);

  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
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

  const isTourFavorite = (
    tour: Tour,
    tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const tourId = tourVariant.tourid;
    const hotelCode = location.pathname.split("/")[2];
    return favoriteTours.some(
      (favTour) => favTour.hotelcode === hotelCode && favTour.tourId === tourId
    );
  };

  const handleFavoriteClick = (
    tour: Tour,
    tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const tourId = tourVariant.tourid;
    const hotelCode = location.pathname.split("/")[2];

    const tourData = {
      hotelcode: hotelCode,
      tourId: tourId,
    };

    if (isTourFavorite(tour, tourIndex, variantIndex)) {
      removeFromFavorite(hotelCode, tourId);
    } else {
      addToFavorite(tourData);
    }
  };

  const getDepartureCity = () => {
    const departure = searchParams.get("departure");
    switch (departure) {
      case "80":
        return "Бишкека";
      case "60":
        return "Алматы";
      default:
        return "Бишкека";
    }
  };

  if (isLoading || isRestoringSearch) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <div className="bg-white rounded-xl p-4 space-y-3">
          <Skeleton className="w-full h-[180px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-20 h-8 rounded-lg" />
            <Skeleton className="w-24 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <div className="bg-white rounded-xl p-4 text-center text-red-600">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
    );
  }

  if (!selectedTours || selectedTours.length === 0) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <div className="bg-white rounded-xl p-4 text-center text-gray-500">
          <h2 className="text-lg font-semibold mb-2">Информация об отеле</h2>
          <p>Туры для данного отеля не найдены или загружаются...</p>
        </div>
      </div>
    );
  }

  // Подсчитываем общее количество вариантов
  const totalVariants = selectedTours.reduce(
    (total, tour) => total + tour.tours.tour.length,
    0
  );

  // Определяем, какие варианты показывать
  const variantsToShow = showAllVariants
    ? selectedTours
    : selectedTours.map((tour) => ({
        ...tour,
        tours: {
          ...tour.tours,
          tour: tour.tours.tour.slice(0, 5), // Показываем только первые 5 вариантов
        },
      }));

  // Подсчитываем количество показанных вариантов
  const shownVariants = variantsToShow.reduce(
    (total, tour) => total + tour.tours.tour.length,
    0
  );

  const firstTour = selectedTours[0]?.tours?.tour?.[0];

  return (
    <div className="px-3 py-2 bg-[#EFF2F6]">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Галерея */}
        <div className="relative">
          <div className="w-full h-[180px] overflow-hidden">
            <img
              src={`https:${hotel.images.image[mainImageIndex]}`}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onClick={() => handleImageClick(mainImageIndex)}
            />
          </div>

          {/* Кнопки навигации */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserInteraction();
              goToPrevious();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-lg text-white opacity-70"
          >
            <IoChevronBackOutline size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserInteraction();
              goToNext();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-lg text-white opacity-70"
          >
            <IoChevronForwardOutline size={24} />
          </button>

          {/* Индикатор слайдов */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {hotel.images.image.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === mainImageIndex
                    ? "bg-white w-4"
                    : "bg-gray-300 opacity-80"
                }`}
              />
            ))}
          </div>

          {/* Счетчик изображений */}
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg opacity-70">
            {mainImageIndex + 1}/{hotel.images.image.length}
          </div>
        </div>

        {/* Заголовок и информация */}
        <div className="p-4 space-y-1">
          {/* Звезды, рейтинг и город вылета */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    src={i < parseInt(hotel.stars) ? starFilled : starOutline}
                    alt={
                      i < parseInt(hotel.stars) ? "filled star" : "outline star"
                    }
                    className="w-3.5 h-3.5"
                  />
                ))}
              </div>
              {hotel.rating !== "0" && (
                <div className="bg-[#FF621F] text-white text-xs font-medium px-1 py-0.5 rounded-[20px]">
                  {hotel.rating.length === 1
                    ? `${hotel.rating}.0`
                    : hotel.rating}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#FF621F]">
              <span>вылет из {getDepartureCity()}</span>
              <img
                src={planeDeparture}
                alt="Plane Departure"
                className="w-3 h-3"
              />
            </div>
          </div>

          {/* Название отеля */}
          <h1 className="text-base font-bold text-[#2E2E32]">{hotel.name}</h1>

          {/* Местоположение */}
          <p className="text-xs text-[#6B7280]">
            {hotel.country}, {hotel.region}
          </p>

          {/* Теги */}
          <div className="flex gap-3 pt-1">
            {firstTour?.meal && (
              <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                <FaUtensils className="w-3 h-3 text-[#2E2E32]" />
                <span className="text-xs text-[#2E2E32]">
                  {getMealType(firstTour.meal)}
                </span>
              </div>
            )}
            {hotel.beach && (
              <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                <FaUmbrellaBeach className="w-3 h-3 text-[#2E2E32]" />
                <span className="text-xs text-[#2E2E32]">Береговая линия</span>
              </div>
            )}
          </div>
        </div>

        {/* Табы */}
        <div className="px-4 pb-1">
          <div className="bg-white rounded-xl p-1 flex gap-2">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "about"
                  ? "bg-[#FF621F] text-white"
                  : "text-[#7E8389]"
              }`}
            >
              Об отеле
            </button>
            <button
              onClick={() => setActiveTab("amenities")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "amenities"
                  ? "bg-[#FF621F] text-white"
                  : "text-[#7E8389]"
              }`}
            >
              Удобства отеля
            </button>
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === "about" && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-base font-semibold text-[#2E2E32] mb-2">
                Об отеле:
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {hotelDescription} {hotel.description}
              </p>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div className="px-4 pb-4">
            <div className="bg-white rounded-xl p-4 space-y-4">
              {hotel.placement && (
                <div>
                  <h3 className="text-base font-semibold text-[#2E2E32] mb-1">
                    Расположение:
                  </h3>
                  <p className="text-sm text-[#6B7280]">{hotel.placement}</p>
                </div>
              )}
              {hotel.territory && (
                <div>
                  <h3 className="text-base font-semibold text-[#2E2E32] mb-1">
                    Территория отеля:
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {formatList(hotel.territory)}
                  </p>
                </div>
              )}
              {hotel.inroom && (
                <div>
                  <h3 className="text-base font-semibold text-[#2E2E32] mb-1">
                    В номере:
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {formatList(hotel.inroom)}
                  </p>
                </div>
              )}
              {hotel.services && (
                <div>
                  <h3 className="text-base font-semibold text-[#2E2E32] mb-1">
                    Услуги отеля:
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {formatList(hotel.services)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl p-3 space-y-3">
            <h3 className="text-base font-semibold text-[#2E2E32]">
              Бронь тура:
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {/* Даты */}
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-[#FF621F] rounded flex items-center justify-center">
                  <FaCalendar className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2E2E32]">
                    Даты поездки
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {firstTour?.flydate && formatDate(firstTour.flydate)} —{" "}
                    {firstTour?.flydate &&
                      firstTour?.nights &&
                      getEndDate(firstTour.flydate, firstTour.nights)}
                  </p>
                </div>
              </div>

              {/* Туристы */}
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-[#FF621F] rounded flex items-center justify-center">
                  <FaUser className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2E2E32]">Туристы</p>
                  <p className="text-xs text-[#6B7280]">
                    {firstTour?.adults} взрослых
                  </p>
                </div>
              </div>

              {/* Номер */}
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-[#FF621F] rounded flex items-center justify-center">
                  <FaBed className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2E2E32]">Номер</p>
                  <p className="text-xs text-[#6B7280]">{firstTour?.room}</p>
                </div>
              </div>

              {/* Длительность */}
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-[#FF621F] rounded flex items-center justify-center">
                  <FaMoon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2E2E32]">
                    Длительность
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {firstTour?.nights} ночей
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 flex items-center justify-center gap-4 py-2.5 px-4 bg-[#FF621F] rounded-lg text-base font-bold text-white">
                <FaBookmark className="w-4 h-4" />
                {firstTour?.price || selectedTours[0]?.price}
                {firstTour?.currency === "EUR"
                  ? "€"
                  : firstTour?.currency === "USD"
                  ? "$"
                  : selectedTours[0]?.currency === "EUR"
                  ? "€"
                  : selectedTours[0]?.currency === "USD"
                  ? "$"
                  : selectedTours[0]?.currency}
              </button>
            </div>
          </div>
        </div>

        {/* Варианты туров */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-[#2E2E32] mb-4">
              Варианты туров
            </h3>
            <div className="space-y-4">
              {variantsToShow.map((tour: Tour, tourIndex: number) =>
                tour.tours.tour.map((tourVariant, variantIndex: number) => (
                  <div
                    key={`${tourIndex}-${variantIndex}`}
                    className="space-y-2 p-3 border border-gray-100 rounded-lg"
                  >
                    <h4 className="text-base font-semibold text-[#2E2E32]">
                      Вариант {variantIndex + 1}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-[#2E2E32]">
                            {getMealType(tourVariant.meal)},{" "}
                            {tourVariant.nights} ночей
                          </p>
                          <p className="text-xs font-semibold text-[#2E2E32]">
                            Номер {tourVariant.room}, {tourVariant.adults}{" "}
                            взрослых
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-[#6B7280]">
                            {formatDate(tourVariant.flydate)} –{" "}
                            {getEndDate(
                              tourVariant.flydate,
                              tourVariant.nights
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#B3B9C0]">
                            {tourVariant.operatorname || "Pegasus Airlines"}
                          </span>
                        </div>
                        <button className="bg-[#FF621F] text-white px-3 py-2 rounded-lg text-sm font-semibold">
                          {tourVariant.price || tour.price}
                          {tourVariant.currency === "EUR"
                            ? "€"
                            : tourVariant.currency === "USD"
                            ? "$"
                            : tour.currency === "EUR"
                            ? "€"
                            : tour.currency === "USD"
                            ? "$"
                            : tour.currency}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Кнопка "Показать все варианты" или "Скрыть" */}
              {totalVariants > 5 && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setShowAllVariants(!showAllVariants)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors font-medium text-sm"
                  >
                    {showAllVariants
                      ? `Скрыть варианты (показано ${totalVariants})`
                      : `Показать еще ${
                          totalVariants - shownVariants
                        } вариантов (показано ${shownVariants} из ${totalVariants})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox для галереи */}
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
