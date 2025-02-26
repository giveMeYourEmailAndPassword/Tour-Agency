import { useParams } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Основные стили Swiper
import "swiper/css/navigation"; // Стили для кнопок навигации
import "swiper/css/pagination"; // Стили для пагинации
import { Navigation, Pagination } from "swiper/modules";

export default function HotelDetails() {
  const { hotelcode } = useParams(); // Получаем код отеля из URL
  const { data, isLoading, isError } = useHotelDetails(hotelcode!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-medium text-blue-600">
          Загрузка данных об отеле...
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.hotel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-medium text-red-600">
          Не удалось загрузить информацию об отеле.
        </div>
      </div>
    );
  }

  const hotel = data?.data?.hotel;

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-medium text-gray-600">
          Данные об отеле отсутствуют
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 p-6">
      {/* Заголовок и рейтинг */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{hotel.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-yellow-500 text-2xl">★</span>
            <span className="font-semibold">{hotel.rating}</span>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-semibold">
              {hotel.stars} звезд
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-4 text-xl">
          {hotel.region}, {hotel.country}
        </p>
      </div>

      {/* Галерея изображений */}
      {hotel.images?.image.length > 0 && (
        <div className="mb-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
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
            loop={true}
            className="w-full h-[50rem] rounded-3xl overflow-hidden group shadow-2xl"
          >
            {hotel.images.image.map((img: string, index: number) => (
              <SwiperSlide key={index} className="relative">
                <img
                  src={`https:${img}`}
                  alt={`Фото отеля ${hotel.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
              </SwiperSlide>
            ))}

            <div className="swiper-button-prev !text-white !opacity-0 group-hover:!opacity-100 transition-opacity duration-300 !w-14 !h-14 !bg-black/40 !rounded-full after:!text-2xl hover:!bg-black/60" />
            <div className="swiper-button-next !text-white !opacity-0 group-hover:!opacity-100 transition-opacity duration-300 !w-14 !h-14 !bg-black/40 !rounded-full after:!text-2xl hover:!bg-black/60" />

            <div className="swiper-pagination !bottom-6 [&>.swiper-pagination-bullet]:!w-3 [&>.swiper-pagination-bullet]:!h-3 [&>.swiper-pagination-bullet]:!bg-white [&>.swiper-pagination-bullet]:!opacity-50 [&>.swiper-pagination-bullet-active]:!opacity-100" />
          </Swiper>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          {/* Расположение */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Расположение
            </h2>
            <p className="text-gray-700 leading-relaxed">{hotel.placement}</p>
          </div>

          {/* Территория и услуги */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Территория и услуги
            </h2>
            <p className="text-gray-700 leading-relaxed">{hotel.territory}</p>
          </div>

          {/* В номере */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">В номере</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.inroom}</p>
          </div>
        </div>

        <div>
          {/* Типы номеров */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Типы номеров
            </h2>
            <p className="text-gray-700 leading-relaxed">{hotel.roomtypes}</p>
          </div>

          {/* Сервисы */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Сервисы</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.services}</p>
          </div>

          {/* Для детей */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Для детей</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.child}</p>
          </div>

          {/* Питание */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Питание</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.mealtypes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
