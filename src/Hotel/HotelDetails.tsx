import { useParams, useLocation } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState, useEffect } from "react";
import AccordionSection from "./HotelAccordion";
import ReviewsModal from "../components/ReviewsModal";
import HotelMap from "../components/HotelMap";
import { PiMapPinFill } from "react-icons/pi";
import { ImCalendar } from "react-icons/im";
import { IoMoonOutline } from "react-icons/io5";
import { TbMap2 } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import BookingPanel from "../components/BookingPanel";
import Header from "../components/Header";
import SimilarHotTours from "../components/SimilarHotTours";
import FloatingControls from "../components/FloatingControls";
import SkeletonHotelDetails from "./SkeletonHotelDetails";

export default function HotelDetails() {
  const { hotelcode, tourId } = useParams();
  const location = useLocation();
  const isHotTourPath = !location.pathname.includes("/OurTours");
  const { data, isLoading, isError } = useHotelDetails(hotelcode!, tourId!);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"map" | "reviews">("map");

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  useEffect(() => {
    if (data?.hotel?.data?.hotel) {
      ("Данные об отеле успешно загружены");
    }
    if (isError) {
      console.error("Ошибка при загрузке данных об отеле:", isError);
    }
  }, [data?.hotel?.data?.hotel, isError]);

  if (isLoading) {
    return <SkeletonHotelDetails />;
  }

  if (isError || !data?.hotel?.data?.hotel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-3xl font-medium text-red-600">
          Не удалось загрузить информацию об отеле.
        </div>
      </div>
    );
  }

  const hotel = data?.hotel?.data?.hotel;
  const tour = data?.tour?.data?.tour;

  if (!hotel || !tour) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="text-3xl font-medium text-gray-600">
          Данные об отеле отсутствуют
        </div>
      </div>
    );
  }

  const formatText = (text: string) => {
    return text
      .split(";")
      .map((item) => `· ${item.trim()}`)
      .join("\n");
  };

  const formatDate = (dateString: string, nights?: number) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    if (nights) {
      const returnDate = addDays(date, parseInt(nights.toString()));
      return format(returnDate, "d MMMM", { locale: ru });
    }
    return format(date, "d MMMM", { locale: ru });
  };

  const getMealType = () => {
    const mealTypes = {
      RO: "Без питания",
      BB: "Только завтрак",
      HB: "Завтрак, ужин",
      FB: "Полный пансион",
      AI: "Все включено",
      UAI: "Ультра все включено",
    };
    return mealTypes[tour.meal as keyof typeof mealTypes] || tour.meal;
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div
        className=" flex flex-col py-8 max-w-[1560px] mx-auto px-4 md:px-8 lg:px-12 xl:px-36 \
    min-h-screen"
      >
        {/* Обертка для слайдера и информации */}
        <div className="flex gap-2 h-[420px]">
          {/* Галерея изображений */}
          {hotel.images?.image.length > 0 && (
            <div className="relative group w-[60%] h-full">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{
                  clickable: true,
                  bulletActiveClass: "!bg-white !scale-110",
                  bulletClass: "swiper-pagination-bullet !mx-1",
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                className="h-full rounded-2xl"
              >
                {hotel.images.image.map((img: string, index: number) => (
                  <SwiperSlide key={index} className="relative">
                    <img
                      src={`https:${img}`}
                      alt={`Фото отеля ${hotel.name}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 rounded-2xl" />
                  </SwiperSlide>
                ))}

                <div
                  className="swiper-button-prev !text-white !opacity-0 group-hover:!opacity-100 transition-all duration-300 
                !w-10 !h-10 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-lg hover:!bg-black/35"
                />
                <div
                  className="swiper-button-next !text-white !opacity-0 group-hover:!opacity-100 transition-all duration-300 
                !w-10 !h-10 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-lg hover:!bg-black/35"
                />
              </Swiper>
            </div>
          )}

          {/* Блок с информацией справа */}
          <div className="w-[40%] bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] h-full">
            <div className="flex justify-center gap-3 my-2">
              <button
                onClick={() => setActiveTab("map")}
                className={`px-4 py-2 font-medium transition-all
                border-b-2 duration-300 flex items-center gap-2
                ${
                  activeTab === "map"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:border-gray-400"
                }`}
              >
                <TbMap2 className="text-blue-600 text-xl" />
                На карте
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-medium transition-all
                border-b-2 duration-300 flex items-center gap-2
                ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:border-gray-400"
                }`}
              >
                Отзывы ({hotel.reviewscount})
              </button>

              <button
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      hotel.name
                    )}`,
                    "_blank"
                  )
                }
                className="px-4 py-2 text-white font-medium transition-all duration-300 bg-red-600 hover:bg-red-500 rounded-lg flex items-center gap-2"
              >
                <FaYoutube className="text-white" />
                Обзоры
              </button>
            </div>
            <div className="h-[calc(100%-60px)] px-2 pb-2">
              {activeTab === "map" ? (
                <HotelMap
                  hotelName={hotel.name}
                  coordinates={[Number(hotel.coord1), Number(hotel.coord2)]}
                  hotelRating={hotel.rating}
                  hotelStars={hotel.stars}
                />
              ) : (
                <ReviewsModal
                  hotelName={hotel.name}
                  hotelRating={hotel.rating}
                  hotelStars={hotel.stars}
                  reviews={hotel.reviews?.review || []}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold bg-clip-text text-gray-800 truncate max-w-[70%]">
              {hotel.name}
            </h1>
            <div className="flex-shrink-0 flex gap-2">
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="font-semibold text-lg">{hotel.rating}</span>
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full shadow-sm flex items-center whitespace-nowrap">
                <span className="text-blue-600 font-semibold text-lg">
                  {hotel.stars} / 5
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-xl flex items-center gap-1">
            <PiMapPinFill className="text-blue-600" />
            {hotel.country}, {hotel.region}
          </p>
        </div>

        <div className="container mx-auto pb-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Информация о туре
              </h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <ImCalendar className="text-blue-600 text-lg" />
                  <p className="text-gray-700 font-medium">
                    {formatDate(tour.flydate)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl">
                  <IoMoonOutline className="text-indigo-600 text-lg" />
                  <p className="text-gray-700 font-medium">
                    {tour.nights} ночей
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl">
                  <FaUtensils className="text-purple-600 text-lg" />
                  <p className="text-gray-700 font-medium">{getMealType()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Размещение
              </h3>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                  <FaHome className="text-green-600 text-lg" />
                  <p className="text-gray-700 font-medium">{tour.room}</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl">
                  <FaBed className="text-teal-600 text-lg" />
                  <p className="text-gray-700 font-medium">
                    {tour.placement === "2 взрослых"
                      ? "Два взрослых"
                      : tour.placement}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-[50%]">
              <h3 className="text-xl font-semibold text-gray-800">Перелет</h3>
              <div className="bg-amber-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IoAirplane className="-rotate-45 text-amber-600 text-lg" />
                    <p className="text-gray-700 font-medium">{`${tour.departurename} - ${tour.hotelregionname}`}</p>
                  </div>
                  <p className="text-black">{formatDate(tour.flydate)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IoAirplane className="rotate-[135deg] text-amber-600 text-lg" />
                    <p className="text-gray-700 font-medium">{`${tour.hotelregionname} - ${tour.departurename}`}</p>
                  </div>
                  <p className="text-black">
                    {formatDate(tour.flydate, tour.nights)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 rounded-xl shadow-lg">
                <p className="text-white flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {tour.price}
                    {tour.currency === "EUR"
                      ? "€"
                      : tour.currency === "USD"
                      ? "$"
                      : tour.currency}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto pb-14">
          {hotel.description && (
            <div className="flex flex-col py-2">
              <h2 className="text-2xl font-semibold">Информация об отеле</h2>
              <p className="text-black text-lg">{hotel.description}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 auto-rows-auto">
            {(() => {
              // Собираем все существующие секции в один массив
              const sections = [
                hotel.placement && {
                  id: "placement",
                  title: "Расположение",
                  content: hotel.placement,
                  useFormatText: false,
                },
                hotel.territory && {
                  id: "territory",
                  title: "Территория и услуги",
                  content: hotel.territory,
                  useFormatText: true,
                },
                hotel.inroom && {
                  id: "inroom",
                  title: "В номере",
                  content: hotel.inroom,
                  useFormatText: true,
                },
                hotel.beach && {
                  id: "beach",
                  title: "Пляж",
                  content: hotel.beach,
                  useFormatText: true,
                },
                hotel.roomtypes && {
                  id: "roomtypes",
                  title: "Типы номеров",
                  content: hotel.roomtypes,
                  useFormatText: true,
                },
                hotel.servicefree && {
                  id: "servicefree",
                  title: "Бесплатные услуги",
                  content: hotel.servicefree,
                  useFormatText: true,
                },
                hotel.servicepay && {
                  id: "servicepay",
                  title: "Платные услуги",
                  content: hotel.servicepay,
                  useFormatText: true,
                },
                hotel.child && {
                  id: "child",
                  title: "Для детей",
                  content: hotel.child,
                  useFormatText: true,
                },
                hotel.mealtypes && {
                  id: "mealtypes",
                  title: "Питание",
                  content: hotel.mealtypes,
                  useFormatText: true,
                },
              ].filter(Boolean);

              // Делим на две колонки
              const midPoint = Math.ceil(sections.length / 2);
              const firstColumn = sections.slice(0, midPoint);
              const secondColumn = sections.slice(midPoint);

              return [
                <div key="col1" className="space-y-2">
                  {firstColumn.map((section) => (
                    <AccordionSection
                      key={section.id}
                      title={section.title}
                      content={section.content}
                      isOpen={openSections.includes(section.id)}
                      onToggle={() => toggleSection(section.id)}
                      formatText={
                        section.useFormatText ? formatText : undefined
                      }
                    />
                  ))}
                </div>,
                <div key="col2" className="space-y-2">
                  {secondColumn.map((section) => (
                    <AccordionSection
                      key={section.id}
                      title={section.title}
                      content={section.content}
                      isOpen={openSections.includes(section.id)}
                      onToggle={() => toggleSection(section.id)}
                      formatText={
                        section.useFormatText ? formatText : undefined
                      }
                    />
                  ))}
                </div>,
              ];
            })()}
          </div>

          {/* Показываем SimilarHotTours только если это путь горящих туров */}
          {isHotTourPath && (
            <div className="mt-8">
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

      {/* Добавляем фиксированную панель бронирования */}
      <BookingPanel
        price={tour.price}
        currency={tour.currency}
        nights={tour.nights}
        meal={getMealType()}
        hotelcode={hotelcode}
        tourId={tourId}
        hotelName={hotel.name}
        country={hotel.country}
        region={hotel.region}
        departure={tour.departurename}
        flyDate={tour.flydate}
        adults={tour.placement}
        operatorLink={tour.operatorlink}
        roomType={tour.room}
      />
      <FloatingControls />
    </div>
  );
}
