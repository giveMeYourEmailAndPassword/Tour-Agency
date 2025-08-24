import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
  const navigate = useNavigate(); // Добавляем useNavigate
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
  // Убираем mainImageIndex и isAutoPlaying, так как теперь используем Swiper

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

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMM", { locale: ru });
  };

  const getEndDate = (startDate: string, nights: number) => {
    const date = parse(startDate, "dd.MM.yyyy", new Date());
    return format(addDays(date, nights), "d MMM", { locale: ru });
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

  const handleBookingClick = (
    tour: Tour,
    tourIndex: number,
    variantIndex: number
  ) => {
    const tourVariant = tour.tours.tour[variantIndex];
    const hotelCode = location.pathname.split("/")[2];

    // Сохраняем данные о туре в localStorage для страницы бронирования
    const bookingData = {
      hotelName: hotel.name,
      departure: getDepartureCity(),
      flyDate: tourVariant.flydate,
      nights: tourVariant.nights,
      adults: tourVariant.adults.toString(),
      price: tourVariant.price || tour.price,
      currency: tourVariant.currency || tour.currency,
      country: hotel.country,
      region: hotel.region,
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
      <>
        <Header />
        <div className="px-3 pb-2 pt-3 bg-gray-100">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            {/* Skeleton для галереи */}
            <div className="relative">
              <Skeleton className="w-full h-[180px] rounded-none" />

              {/* Skeleton для счетчика изображений */}
              <div className="absolute top-2 left-2">
                <Skeleton className="w-12 h-5 rounded-lg" />
              </div>
            </div>

            {/* Skeleton для заголовка и информации */}
            <div className="py-2 space-y-1">
              {/* Skeleton для звезд, рейтинга и города вылета */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded" />
                    ))}
                  </div>
                  <Skeleton className="w-8 h-5 rounded-[20px]" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-3 h-3 rounded" />
                </div>
              </div>

              {/* Skeleton для названия отеля */}
              <Skeleton className="w-3/4 h-5" />

              {/* Skeleton для местоположения */}
              <Skeleton className="w-1/2 h-4" />

              {/* Skeleton для тегов */}
              <div className="flex gap-3 pt-1.5">
                <Skeleton className="w-20 h-6 rounded-lg" />
                <Skeleton className="w-28 h-6 rounded-lg" />
              </div>
            </div>

            {/* Skeleton для табов */}
            <div className="">
              <div className="bg-white rounded-t-xl px-1 pt-2 flex gap-1">
                <Skeleton className="flex-1 h-8 rounded-lg" />
                <Skeleton className="flex-1 h-8 rounded-lg" />
              </div>

              {/* Skeleton для контента таба */}
              <div className="pb-4">
                <div className="bg-white rounded-b-xl px-3 pt-2 pb-4 space-y-3">
                  <Skeleton className="w-32 h-5" />
                  <div className="space-y-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4" />
                    <Skeleton className="w-4/6 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton для вариантов туров */}
            <div className="">
              <div className="bg-white rounded-xl px-3 py-2">
                <Skeleton className="w-40 h-5 mb-2" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="space-y-2 p-3 border border-gray-100 rounded-lg"
                    >
                      <Skeleton className="w-32 h-5" />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <Skeleton className="w-36 h-4" />
                            <Skeleton className="w-40 h-4" />
                          </div>
                          <div className="text-right">
                            <Skeleton className="w-24 h-4" />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="w-28 h-4" />
                          <div className="flex items-center gap-1">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-20 h-8 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !hotel) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <Header />
        <div className="bg-white rounded-xl p-4 text-center text-red-600">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
    );
  }

  if (!selectedTours || selectedTours.length === 0) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <Header />
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
    <>
      <Header />
      <div className="px-3 pb-2 pt-3 bg-gray-100">
        <div className="bg-gray-100 rounded-xl overflow-hidden">
          {/* Галерея */}
          <div className="relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet !mx-1 !w-2 !h-2",
                bulletActiveClass: "!bg-white !w-2",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              className="w-full h-[180px]"
            >
              {hotel.images.image.map((img: string, index: number) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-[180px] overflow-hidden">
                    <img
                      src={`https:${img}`}
                      alt={`${hotel.name} - фото ${index + 1}`}
                      className="w-full h-full object-cover"
                      onClick={() => handleImageClick(index)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Счетчик изображений */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg opacity-70">
              {currentIndex + 1}/{hotel.images.image.length}
            </div>
          </div>

          {/* Заголовок и информация */}
          <div className="py-2 space-y-1">
            {/* Звезды, рейтинг и город вылета */}
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
                  <div className="bg-[#FF621F] text-white text-xs font-medium px-1 py-0.5 rounded-[20px]">
                    {hotel.rating.length === 1
                      ? `${hotel.rating}.0`
                      : hotel.rating}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-[#FF621F]">
                <span>вылет из {getDepartureCity()}</span>
                <img
                  src={planeDeparture}
                  alt="Plane Departure"
                  className="w-3 h-3"
                />
              </div>
            </div>

            {/* Название отеля */}
            <h1 className="text-lg font-bold text-[#2E2E32]">{hotel.name}</h1>

            {/* Местоположение */}
            <p className="text-sm text-[#6B7280]">
              {hotel.country}, {hotel.region}
            </p>

            {/* Теги */}
            <div className="flex gap-3 pt-1.5">
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
                  <span className="text-xs text-[#2E2E32]">
                    Береговая линия
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Табы */}
          <div className="">
            <div className="bg-white rounded-t-xl px-1 pt-2 flex gap-1">
              <button
                onClick={() => setActiveTab("about")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "about"
                    ? "bg-[#FF621F] text-white"
                    : "text-[#7E8389] bg-gray-100"
                }`}
              >
                Об отеле
              </button>
              <button
                onClick={() => setActiveTab("amenities")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "amenities"
                    ? "bg-[#FF621F] text-white"
                    : "text-[#7E8389] bg-gray-100"
                }`}
              >
                Удобства отеля
              </button>
            </div>

            {/* Контент табов */}
            {activeTab === "about" && (
              <div className="pb-4">
                <div className="bg-white rounded-b-xl px-3 pt-2 pb-4 space-y-1">
                  <h3 className="text-lg font-semibold text-[#2E2E32]">
                    Об отеле:
                  </h3>
                  <p className="text-base text-[#6B7280] leading-relaxed">
                    {hotelDescription} {hotel.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="pb-4">
                <div className="bg-white rounded-b-xl px-3 pt-2 pb-4 space-y-4">
                  {hotel.placement && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32] mb-1">
                        Расположение:
                      </h3>
                      <p className="text-base text-[#6B7280]">
                        {hotel.placement}
                      </p>
                    </div>
                  )}
                  {hotel.territory && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32] mb-1">
                        Территория отеля:
                      </h3>
                      <p className="text-base text-[#6B7280]">
                        {formatList(hotel.territory)}
                      </p>
                    </div>
                  )}
                  {hotel.inroom && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32] mb-1">
                        В номере:
                      </h3>
                      <p className="text-base text-[#6B7280]">
                        {formatList(hotel.inroom)}
                      </p>
                    </div>
                  )}
                  {hotel.services && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#2E2E32] mb-1">
                        Услуги отеля:
                      </h3>
                      <p className="text-base text-[#6B7280]">
                        {formatList(hotel.services)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Варианты туров */}
          <div className="">
            <div className="bg-white rounded-xl px-3 py-2">
              <h3 className="text-lg font-semibold text-[#2E2E32] mb-2">
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
                            <p className="text-sm font-medium text-[#2E2E32]">
                              {getMealType(tourVariant.meal)},{" "}
                              {tourVariant.nights} ночей
                            </p>
                            <p className="text-sm font-semibold text-[#2E2E32]">
                              Номер {tourVariant.room}, {tourVariant.adults}{" "}
                              взр.
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[#6B7280]">
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
                            <span className="text-sm text-[#B3B9C0]">
                              {tourVariant.operatorname || "Pegasus Airlines"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Кнопка избранного */}
                            <button
                              onClick={() =>
                                handleFavoriteClick(
                                  tour,
                                  tourIndex,
                                  variantIndex
                                )
                              }
                              className={`p-1.5 rounded-lg border-2 transition-colors ${
                                isTourFavorite(tour, tourIndex, variantIndex)
                                  ? "border-[#FF621F] text-[#FF621F] hover:bg-orange-50"
                                  : "border-gray-300 text-gray-400 hover:border-[#FF621F] hover:text-[#FF621F]"
                              }`}
                              title={
                                isTourFavorite(tour, tourIndex, variantIndex)
                                  ? "Убрать из избранного"
                                  : "Добавить в избранное"
                              }
                            >
                              {isTourFavorite(tour, tourIndex, variantIndex) ? (
                                <FaHeart size={16} />
                              ) : (
                                <FaRegHeart size={16} />
                              )}
                            </button>
                            {/* Кнопка цены */}
                            <button
                              onClick={() =>
                                handleBookingClick(
                                  tour,
                                  tourIndex,
                                  variantIndex
                                )
                              }
                              className="bg-[#FF621F] text-white px-8 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#E55A1A] transition-colors cursor-pointer"
                            >
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
                    </div>
                  ))
                )}

                {/* Кнопка "Показать все варианты" или "Скрыть" */}
                {totalVariants > 5 && (
                  <div className="flex justify-center pb-2">
                    <button
                      onClick={() => setShowAllVariants(!showAllVariants)}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors font-medium text-sm"
                    >
                      {showAllVariants
                        ? `Скрыть доп. варианты (показано ${shownVariants} из ${totalVariants})`
                        : `Показать еще ${
                            totalVariants - shownVariants
                          } вариантов`}
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
    </>
  );
}
