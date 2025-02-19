import { useParams } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";

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
  console.log(hotel);

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-4xl font-bold mb-4">{hotel.name}</h1>
      <p className="text-gray-500 mb-6">{`${hotel.stars}⭐ | ${hotel.country}, ${hotel.region}`}</p>
      <p className="text-black mb-4">Рейтинг: {hotel.rating || "Нет данных"}</p>
      <p className="text-black mb-4">
        {hotel.description || "Описание недоступно."}
      </p>

      {hotel.images?.image.length > 0 && (
        <div className="flex gap-4 flex-wrap mb-6">
          {hotel.images.image.map((img: string, index: number) => (
            <img
              key={index} // Используем индекс для уникального ключа
              src={`https:${img}`} // Указываем корректный путь
              alt={`Фото отеля ${hotel.name}`}
              className="rounded-lg shadow-lg w-60 h-40 object-cover"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Информация</h2>
          <p className="text-black">
            <strong>Год постройки:</strong> {hotel.build || "Не указано"}
          </p>
          <p className="text-black">
            <strong>Пляж:</strong> {hotel.beach || "Нет данных"}
          </p>
          <p className="text-black">
            <strong>Типы номеров:</strong> {hotel.roomtypes || "Не указано"}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Услуги</h2>
          <p className="text-black">
            <strong>Бесплатные:</strong> {hotel.servicefree || "Нет данных"}
          </p>
          <p className="text-black">
            <strong>Платные:</strong> {hotel.servicepay || "Нет данных"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Тип питания</h2>
        <p className="text-black">
          {hotel.meallist || "Информация о питании недоступна."}
        </p>
      </div>
    </div>
  );
}

{
  /* <img src={hotel.images?.image[0]} alt={hotel.name} /> */
}
