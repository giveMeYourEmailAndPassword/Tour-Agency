import { useParams } from "react-router";
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

export default function HotelDetails() {
  const { hotelcode, tourId } = useParams();
  const { data, isLoading, isError } = useHotelDetails(hotelcode!, tourId!);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-3xl font-medium text-blue-600 animate-pulse">
          Загрузка данных об отеле...
        </div>
      </div>
    );
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

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-36 pt-12">
        {/* Галерея изображений */}

        {hotel.images?.image.length > 0 && (
          <div className="relative group">
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
              className="w-full h-[70vh] rounded-2xl"
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
              !w-12 !h-12 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-xl hover:!bg-black/35"
              />
              <div
                className="swiper-button-next !text-white !opacity-0 group-hover:!opacity-100 transition-all duration-300 
              !w-12 !h-12 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-xl hover:!bg-black/35"
              />
            </Swiper>
          </div>
        )}

        <div className="flex flex-col py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-gray-800 truncate max-w-[70%]">
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
            {hotel.region}, {hotel.country}
          </p>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          {/* Кнопки навигации */}
          <div className="flex justify-center gap-8 mb-12">
            <button
              onClick={() => setIsMapOpen(true)}
              className="px-8 py-2 border-3 text-gray-500 rounded-2xl font-medium transition-colors"
            >
              На карте
            </button>

            <button
              onClick={() => setIsReviewsOpen(true)}
              className="px-14 py-2 border-3 text-gray-500 rounded-2xl font-medium transition-colors text-center"
            >
              Отзывы ({hotel.reviewscount})
            </button>
            <ReviewsModal
              isOpen={isReviewsOpen}
              onClose={() => setIsReviewsOpen(false)}
              hotelName={hotel.name}
              reviewsCount={hotel.reviewscount}
              hotelRating={hotel.rating}
              hotelStars={hotel.stars}
              reviews={hotel.reviews?.review || []}
            />

            <button
              onClick={() =>
                window.open(
                  `https://www.youtube.com/results?search_query=${encodeURIComponent(
                    hotel.name
                  )}`,
                  "_blank"
                )
              }
              className="px-8 py-2 border-3 text-gray-500 rounded-2xl font-medium transition-colors"
            >
              You<span className="text-red-600">Tube</span>
            </button>
          </div>
          {/* Заголовок и рейтинг */}

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
        </div>
      </div>
      <HotelMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotelName={hotel.name}
        coordinates={[Number(hotel.coord1), Number(hotel.coord2)]}
        hotelRating={hotel.rating}
        hotelStars={hotel.stars}
      />
    </>
  );
}
