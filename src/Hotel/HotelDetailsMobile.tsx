import { useParams, useLocation, useNavigate } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Skeleton } from "@heroui/react";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import planeDeparture from "../assets/plane_departure.svg";
import { format, parse, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { FaUtensils } from "react-icons/fa";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Header from "../components/Header";
// import SimilarHotTours from "../components/SimilarHotTours";

export default function HotelDetailsMobile() {
  const { hotelcode, tourId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Добавляем useNavigate
  const isHotTourPath = !location.pathname.includes("/OurTours");
  const { data, isLoading, isError } = useHotelDetails(hotelcode!, tourId!);
  const [activeTab, setActiveTab] = useState("about");
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data?.hotel?.data?.hotel) {
      console.log("Данные об отеле успешно загружены");
    }
    if (isError) {
      console.error("Ошибка при загрузке данных об отеле:", isError);
    }
  }, [data?.hotel?.data?.hotel, isError]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="px-3 pb-2 pt-3 bg-gray-100 min-h-screen">
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
          </div>
        </div>
      </>
    );
  }

  if (isError || !data?.hotel?.data?.hotel) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <Header />
        <div className="bg-white rounded-xl p-4 text-center text-red-600">
          Не удалось загрузить информацию об отеле
        </div>
      </div>
    );
  }

  const hotel = data?.hotel?.data?.hotel;
  const tour = data?.tour?.data?.tour;

  if (!hotel || !tour) {
    return (
      <div className="p-4 bg-[#EFF2F6]">
        <Header />
        <div className="bg-white rounded-xl p-4 text-center text-gray-500">
          <h2 className="text-lg font-semibold mb-2">Информация об отеле</h2>
          <p>Данные об отеле отсутствуют</p>
        </div>
      </div>
    );
  }

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

  const getDepartureCity = () => {
    // Здесь можно добавить логику для определения города вылета
    return tour.departurename || "Бишкека";
  };

  const handleBookingClick = () => {
    // Сохраняем данные о туре в localStorage для страницы бронирования
    const bookingData = {
      hotelName: hotel.name,
      departure: getDepartureCity(),
      flyDate: tour.flydate,
      nights: tour.nights,
      adults: tour.adults.toString(),
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

    // Переходим на страницу бронирования
    navigate(`/hotel/${hotelcode}/${tourId}/booking`);
  };

  return (
    <>
      <Header />
      <div className="px-3 pb-2 pt-3 bg-gray-100 min-h-screen">
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
              {tour.meal && (
                <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg">
                  <FaUtensils className="w-3 h-3 text-[#2E2E32]" />
                  <span className="text-xs text-[#2E2E32]">
                    {getMealType(tour.meal)}
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
                    {hotel.description}
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

          {/* Информация о туре */}
          <div className="">
            <div className="bg-white rounded-xl px-3 py-2">
              <h3 className="text-lg font-semibold text-[#2E2E32] mb-2">
                Информация о туре
              </h3>
              <div className="space-y-4">
                <div className="space-y-2 p-3 border border-gray-100 rounded-lg">
                  <h4 className="text-base font-semibold text-[#2E2E32]">
                    Выбранный тур
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#2E2E32]">
                          {getMealType(tour.meal)}, {tour.nights} ночей
                        </p>
                        <p className="text-sm font-semibold text-[#2E2E32]">
                          Номер {tour.room}, {tour.placement}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#6B7280]">
                          {formatDate(tour.flydate)} –{" "}
                          {getEndDate(tour.flydate, tour.nights)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#B3B9C0]">
                          {tour.operatorname || "Pegasus Airlines"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleBookingClick}
                          className="bg-[#FF621F] text-white px-8 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#E55A1A] transition-colors cursor-pointer"
                        >
                          {tour.price}
                          {tour.currency === "EUR"
                            ? "€"
                            : tour.currency === "USD"
                            ? "$"
                            : tour.currency}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SimilarHotTours */}
          {/* {isHotTourPath && (
            <div className="mt-4">
              <SimilarHotTours
                countrycode={hotel.countrycode}
                departurecode={tour.departurecode}
                currentHotelCode={hotel.hotelcode}
                currentHotelName={hotel.name}
              />
            </div>
          )} */}
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
