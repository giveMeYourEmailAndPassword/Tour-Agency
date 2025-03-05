import { useParams } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Header from "./Header";
export default function HotelDetails() {
  const { hotelcode } = useParams();
  const { data, isLoading, isError } = useHotelDetails(hotelcode!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-3xl font-medium text-blue-600 animate-pulse">
          Загрузка данных об отеле...
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.hotel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-3xl font-medium text-red-600">
          Не удалось загрузить информацию об отеле.
        </div>
      </div>
    );
  }

  const hotel = data?.data?.hotel;

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="text-3xl font-medium text-gray-600">
          Данные об отеле отсутствуют
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-36">
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
                bulletActiveClass: "swiper-pagination-bullet-active",
                bulletClass: "swiper-pagination-bullet",
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
              <div className="swiper-pagination swiper-pagination-bullets:bg-blue-600 !bottom-8 [&>.swiper-pagination-bullet]:!w-4 [&>.swiper-pagination-bullet]:!h-4 [&>.swiper-pagination-bullet]:!bg-white [&>.swiper-pagination-bullet]:!opacity-50 [&>.swiper-pagination-bullet-active]:!opacity-100" />
            </Swiper>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Кнопки навигации */}
          <div className="flex justify-center gap-4 mb-12">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
              На карте
            </button>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
              Отзывы
            </button>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
              YouTube
            </button>
          </div>

          {/* Заголовок и рейтинг */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {hotel.name}
            </h1>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3 bg-yellow-100 px-6 py-3 rounded-full shadow-lg">
                <span className="text-yellow-500 text-3xl">★</span>
                <span className="font-semibold text-xl">{hotel.rating}</span>
              </div>
              <div className="bg-blue-100 px-6 py-3 rounded-full shadow-lg">
                <span className="text-blue-600 font-semibold text-xl">
                  {hotel.stars} звезд
                </span>
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-2xl font-light">
              {hotel.region}, {hotel.country}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              {/* Расположение */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Расположение
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.placement}
                </p>
              </div>

              {/* Территория и услуги */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Территория и услуги
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.territory}
                </p>
              </div>

              {/* В номере */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  В номере
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.inroom}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Типы номеров */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Типы номеров
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.roomtypes}
                </p>
              </div>

              {/* Сервисы */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Сервисы
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.services}
                </p>
              </div>

              {/* Для детей */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Для детей
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.child}
                </p>
              </div>

              {/* Питание */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  Питание
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {hotel.mealtypes}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
