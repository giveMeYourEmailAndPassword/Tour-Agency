import { useParams, useLocation, useNavigate } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import planeDeparture from "../assets/plane_departure.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { IoAirplane } from "react-icons/io5";
import { FaHeart, FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Header from "../components/Header";
import bookingIcon from "../assets/booking.svg";
import calendarIcon from "../assets/calendar.svg";
import moonStarsIcon from "../assets/moon_stars.svg";
import personLuggageIcon from "../assets/person_luggage.svg";
import bedAltIcon from "../assets/bed_alt.svg";
import { DataContext } from "../components/DataProvider";
import { FaRegHeart } from "react-icons/fa";
import SimilarHotTours from "../components/SimilarHotTours";
import HotelDetailedInfo from "../components/HotelDetailedInfo";

export default function HotelDetails() {
  const { hotelcode, tourId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isHotTourPath = !location.pathname.includes("/OurTours");
  const { data, isLoading, isError } = useHotelDetails(hotelcode!, tourId!);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { addToFavorite, removeFromFavorite, favoriteTours } =
    useContext(DataContext);

  useEffect(() => {
    if (data?.hotel?.data?.hotel) {
      console.log("Данные об отеле успешно загружены");
    }
    if (isError) {
      console.error("Ошибка при загрузке данных об отеле:", isError);
    }
  }, [data?.hotel?.data?.hotel, isError]);

  // Авто-прокрутка
  useEffect(() => {
    if (!isAutoPlaying || !data?.hotel?.data?.hotel?.images?.image) return;

    const interval = setInterval(() => {
      setMainImageIndex((prev) => {
        const imagesLength = data.hotel.data.hotel.images.image.length;
        return prev === imagesLength - 1 ? 0 : prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, data?.hotel?.data?.hotel?.images?.image]);

  // Остановка авто-прокрутки при взаимодействии
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
        <Header />
        <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
          <div className="max-w-[1440px] mx-auto py-4">
            <div className="flex justify-between gap-2">
              {/* Левая колонка с галереей */}
              <div className="flex flex-col gap-1 flex-[1]">
                {/* Основное фото с улучшенным скелетоном */}
                <div className="relative">
                  <Skeleton className="w-full h-[400px] rounded-xl animate-pulse" />
                  {/* Индикаторы слайдов */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-gray-400 w-4" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Дополнительные фото */}
                <div className="grid grid-cols-4 gap-1 h-[100px]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-full h-full rounded-xl animate-pulse"
                    />
                  ))}
                </div>

                {/* Информация об отеле с улучшенным дизайном */}
                <div className="mt-4 space-y-4">
                  {/* Заголовок секции */}
                  <div className="space-y-3">
                    <Skeleton className="w-48 h-5 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-4/5 h-4 rounded" />
                      <Skeleton className="w-3/4 h-4 rounded" />
                    </div>
                  </div>

                  {/* Расположение */}
                  <div className="space-y-3">
                    <Skeleton className="w-32 h-5 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-2/3 h-4 rounded" />
                    </div>
                  </div>

                  {/* Территория отеля */}
                  <div className="space-y-3">
                    <Skeleton className="w-40 h-5 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-5/6 h-4 rounded" />
                      <Skeleton className="w-3/5 h-4 rounded" />
                    </div>
                  </div>

                  {/* В номере */}
                  <div className="space-y-3">
                    <Skeleton className="w-24 h-5 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="w-full h-4 rounded" />
                      <Skeleton className="w-4/5 h-4 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая колонка с информацией */}
              <div className="w-[45%]">
                {/* Заголовок и рейтинг */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {/* Звезды */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-4 h-4 rounded" />
                      ))}
                    </div>
                    {/* Рейтинг */}
                    <Skeleton className="w-12 h-6 rounded-full" />
                  </div>
                  {/* Город вылета */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-24 h-4 rounded" />
                    <Skeleton className="w-4 h-4 rounded" />
                  </div>
                </div>

                {/* Название отеля */}
                <div className="mb-4">
                  <Skeleton className="w-3/4 h-7 rounded mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-1/2 h-4 rounded" />
                    <div className="flex gap-3">
                      <Skeleton className="w-20 h-4 rounded" />
                      <Skeleton className="w-24 h-4 rounded" />
                    </div>
                  </div>
                </div>

                {/* Варианты туров */}
                <div className="mt-6 ">
                  <Skeleton className="w-40 h-6 rounded mb-4" />
                  <div className="space-y-2">
                    {Array.from({ length: 1 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-[10px] p-4 border border-gray-200"
                      >
                        {/* Заголовок варианта */}
                        <div className="flex justify-between items-center mb-4">
                          <Skeleton className="w-32 h-8 rounded" />
                          <Skeleton className="w-8 h-8 rounded-lg" />
                        </div>

                        {/* Основная информация о туре */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* Левая колонка */}
                          <div className="space-y-4">
                            {/* Даты поездки */}
                            <div className="flex items-start gap-3">
                              <Skeleton className="w-6 h-6 rounded flex-shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-3">
                                <Skeleton className="w-24 h-4 rounded" />
                                <Skeleton className="w-32 h-3 rounded" />
                              </div>
                            </div>

                            {/* Туристы */}
                            <div className="flex items-start gap-3">
                              <Skeleton className="w-6 h-6 rounded flex-shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-3">
                                <Skeleton className="w-16 h-4 rounded" />
                                <Skeleton className="w-20 h-3 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Правая колонка */}
                          <div className="space-y-4">
                            {/* Номер */}
                            <div className="flex items-start gap-3">
                              <Skeleton className="w-6 h-6 rounded flex-shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-3">
                                <Skeleton className="w-12 h-4 rounded" />
                                <Skeleton className="w-24 h-3 rounded" />
                              </div>
                            </div>

                            {/* Длительность */}
                            <div className="flex items-start gap-3">
                              <Skeleton className="w-6 h-6 rounded flex-shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-3">
                                <Skeleton className="w-20 h-4 rounded" />
                                <Skeleton className="w-16 h-3 rounded" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Кнопки действий */}
                        <div className="flex gap-2 pt-3">
                          <div className="p-2 bg-gray-50 rounded-lg w-[50%] flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Skeleton className="w-6 h-6 rounded" />
                              <Skeleton className="w-32 h-6 rounded" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="w-6 h-6 rounded" />
                              <Skeleton className="w-16 h-6 rounded" />
                            </div>
                          </div>
                          <Skeleton className="w-[50%] h-10 rounded-[10px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.hotel?.data?.hotel) {
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

  const hotel = data?.hotel?.data?.hotel;
  const tour = data?.tour?.data?.tour;

  if (!hotel || !tour) {
    return (
      <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
        <Header />
        <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
          <div className="max-w-[1560px] mx-auto px-6 py-4">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">
                Информация об отеле
              </h2>
              <p>Данные об отеле отсутствуют</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      "BED & BREAKFAST": "Завтрак",
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
    setMainImageIndex(index);
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

  // Функция для определения города вылета
  const getDepartureCity = () => {
    return tour.departurename || "Бишкека";
  };

  // Добавляем функцию для перехода в Booking
  const handleBookingClick = () => {
    if (!hotel || !tour) return;

    const bookingData = {
      hotelName: hotel.name,
      departure: getDepartureCity(),
      flyDate: tour.flydate,
      nights: tour.nights,
      adults: tour.adults?.toString() || "2",
      price: tour.price,
      currency: tour.currency,
      country: hotel.country,
      region: hotel.region,
      mealType: getMealType(tour.meal),
      roomType: tour.room,
      hotelcode: hotelcode,
      operatorLink: tour.operatorname || "Pegasus Airlines",
    };

    localStorage.setItem(
      `booking_${hotelcode}_${tourId}`,
      JSON.stringify(bookingData)
    );

    navigate(`/hotel/${hotelcode}/${tourId}/booking`);
  };

  const isTourFavorite = () => {
    const hotelCode = String(hotelcode);
    const tId = String(tourId);
    return favoriteTours.some(
      (fav) => fav.hotelcode === hotelCode && fav.tourId === tId
    );
  };

  const handleFavoriteClick = () => {
    const hotelCode = String(hotelcode);
    const tId = String(tourId);
    if (isTourFavorite()) {
      removeFromFavorite(hotelCode, tId);
    } else {
      addToFavorite({ hotelcode: hotelCode, tourId: tId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:bg-white bg-gray-100">
      <Header />
      <div className="w-full mt-1 md:mt-0 md:bg-white bg-gray-100">
        <div className="max-w-[1440px] mx-auto py-4">
          {/* Заголовок */}
          <div className="flex flex-col gap-3">
            {/* Галерея и контент */}
            <div className="flex justify-between gap-2">
              <div className="flex flex-col gap-1 flex-[1]">
                <div
                  className={`${
                    hotel.name.length > 30
                      ? "flex flex-col items-start gap-1 mb-2"
                      : "flex items-center gap-3 mb-2"
                  }`}
                >
                  <h1 className="text-3xl font-bold text-[#2E2E32]">
                    {hotel.name}
                  </h1>
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
                        className="w-6 h-6"
                      />
                    ))}
                  </div>
                </div>
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
                  {hotel.images.image
                    .slice(1, 5)
                    .map((image: string, index: number) => (
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
                <HotelDetailedInfo hotel={hotel} />
              </div>

              {/* Информация о туре */}
              <div className="w-[45%]">
                <div className="flex justify-between items-center">
                  <div className="flex items-baseline justify-between w-full text-base text-[#6B7280]">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-2xl font-semibold text-[#2E2E32]">
                        Информация о туре
                      </h3>
                      <p className="text-lg text-[#6B7280]">
                        {hotel.country}, {hotel.region}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[#FF621F] text-lg">
                          вылет из {getDepartureCity()}
                        </span>
                        <img
                          src={planeDeparture}
                          alt="Plane Departure"
                          className="w-5 h-5"
                        />
                      </div>

                      <div className="flex gap-3 justify-end">
                        {tour.meal && (
                          <div className="flex items-center gap-1">
                            <span className="text-base text-[#2E2E32]">
                              {getMealType(tour.meal)}
                            </span>
                            <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                          </div>
                        )}
                        {hotel.beach && (
                          <div className="flex items-center gap-1">
                            <span className="text-base text-[#2E2E32]">
                              Береговая линия
                            </span>
                            <FaUmbrellaBeach className="w-3.5 h-3.5 text-[#2E2E32]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center pb-1"></div>
                </div>
                {/* Варианты туров */}
                <div className="mt-2">
                  <div className="space-y-2">
                    <div className="bg-white rounded-[10px] p-4 border border-[#DBE0E5]">
                      {/* Заголовок блока */}
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-[#2E2E32]">
                          Выбранный тур
                        </h4>
                        <div className="flex items-center gap-2">
                          {/* Кнопка избранного */}
                          <button
                            onClick={handleFavoriteClick}
                            className={`p-2 rounded-lg border-2 transition-colors ${
                              isTourFavorite()
                                ? "border-[#FF621F] text-[#FF621F] hover:bg-orange-50"
                                : "border-gray-300 text-gray-400 hover:border-[#FF621F] hover:text-[#FF621F]"
                            }`}
                            title={
                              isTourFavorite()
                                ? "Убрать из избранного"
                                : "Добавить в избранное"
                            }
                          >
                            {isTourFavorite() ? (
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
                                {formatDate(tour.flydate)} —{" "}
                                {getEndDate(tour.flydate, tour.nights)}
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
                                {(tour as { adults?: number }).adults ?? 2}{" "}
                                взрослых
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
                                {tour.room}
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
                                {tour.nights} ночей
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Кнопки действий */}
                      <div className="flex gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg w-[50%] flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <IoAirplane className="w-4 h-4 text-[#2E2E32]" />
                            <span className="text-sm font-medium text-[#2E2E32]">
                              {tour.operatorname || "Pegasus Airlines"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUtensils className="w-3.5 h-3.5 text-[#2E2E32]" />
                            <span className="text-sm text-[#6B7280]">
                              {getMealType(tour.meal)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleBookingClick}
                          className="w-[50%] bg-[#FF621F] text-white px-4 py-2 rounded-[10px] flex items-center justify-center gap-4 hover:bg-[#E55A1A] transition-colors font-medium"
                        >
                          <span className="text-base font-bold">
                            {tour.price}
                            {tour.currency === "EUR"
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

                    {/* Похожие туры - сохраняем эту функциональность */}
                    {isHotTourPath && (
                      <div className="pt-1">
                        <SimilarHotTours
                          countrycode={hotel.countrycode}
                          departurecode={tour.departurecode}
                          currentHotelCode={hotel.hotelcode}
                          currentHotelName={hotel.name}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Секция с картой */}
        {hotel.coord1 && hotel.coord2 && (
          <div className="w-full bg-white">
            <div className="max-w-[1440px] mx-auto py-6">
              <h2 className="text-2xl font-bold text-[#2E2E32] mb-4">
                Местоположение
              </h2>
              <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?ll=${hotel.coord2}%2C${hotel.coord1}&z=17&pt=${hotel.coord2}%2C${hotel.coord1}%2Cpm2rdm`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={`Карта местоположения отеля ${hotel?.name}`}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        <Lightbox
          open={isOpen}
          close={() => {
            setIsOpen(false);
            setMainImageIndex(currentIndex);
            setTimeout(() => setIsAutoPlaying(true), 500);
          }}
          slides={slides}
          plugins={[Thumbnails]}
          index={currentIndex}
          on={{
            view: ({ index }) => {
              setCurrentIndex(index);
            },
          }}
        />
      </div>
    </div>
  );
}
