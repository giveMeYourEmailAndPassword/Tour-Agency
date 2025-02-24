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
    return <div className="text-center">Загрузка данных об отеле...</div>;
  }

  if (isError || !data?.data?.hotel) {
    return (
      <div className="text-center text-red-500">
        Не удалось загрузить информацию об отеле.
      </div>
    );
  }

  const hotel = data?.data?.hotel;

  if (!hotel) {
    return <div>Данные об отеле отсутствуют</div>;
  }

  return (
    <div className="container mx-auto my-10 p-6">
      {/* Заголовок и рейтинг */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★ {hotel.rating}</span>
          <span className="text-gray-600">({hotel.stars} звезды)</span>
        </div>
        <p className="text-gray-600 mt-2">
          {hotel.region}, {hotel.country}
        </p>
      </div>

      {/* Галерея изображений */}
      {hotel.images?.image.length > 0 && (
        <div className="mb-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="mySwiper"
          >
            {hotel.images.image.map((img: string, index: number) => (
              <SwiperSlide key={index} className="flex items-center">
                <img
                  src={`https:${img}`}
                  alt={`Фото отеля ${hotel.name}`}
                  className="rounded-lg shadow-lg w-[90%] h-[30rem] object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Основная информация */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Основная информация</h2>
        <div className="space-y-2">
          <p>
            <strong>Год постройки:</strong> {hotel.build}
          </p>
          <p>
            <strong>Последний ремонт:</strong> {hotel.repair}
          </p>
          <p>
            <strong>Расположение:</strong> {hotel.placement}
          </p>
          <p>
            <strong>Площадь:</strong> {hotel.square}
          </p>
          <p>
            <strong>Телефон:</strong> {hotel.phone}
          </p>
          <p>
            <strong>Сайт:</strong>{" "}
            <a href={hotel.site} className="text-blue-500 hover:underline">
              {hotel.site}
            </a>
          </p>
        </div>
      </div>

      {/* Описание */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Описание</h2>
        <p className="text-gray-700">{hotel.description}</p>
      </div>

      {/* Территория и услуги */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Территория и услуги</h2>
        <p className="text-gray-700">{hotel.territory}</p>
      </div>

      {/* Номера */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Типы номеров</h2>
        <p className="text-gray-700">{hotel.roomtypes}</p>
      </div>

      {/* Питание */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Питание</h2>
        <p className="text-gray-700">{hotel.meallist}</p>
        <p className="text-gray-700">{hotel.mealtypes}</p>
      </div>

      {/* Пляж */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Пляж</h2>
        <p className="text-gray-700">{hotel.beach}</p>
      </div>

      {/* Для детей */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Для детей</h2>
        <p className="text-gray-700">{hotel.child}</p>
      </div>

      {/* Анимация и развлечения */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Анимация и развлечения</h2>
        <p className="text-gray-700">{hotel.animation}</p>
      </div>
    </div>
  );
}
