import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import { BsFire } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import { parse, format } from "date-fns";
import { ru } from "date-fns/locale"; // Русская локализация

const fetchHotTours = async () => {
  const response = await axios.get("http://tourvisor.ru/xml/hottours.php", {
    params: {
      authlogin: "Ikram.kv@gmail.com",
      authpass: "YkCfsYMj4322",
      city: "80", // Бишкек
      items: "40", // Получить 40 туров
      format: "json",
      picturetype: "1",
    },
  });
  return response.data;
};

export default function HotTours() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotTours"],
    queryFn: fetchHotTours,
  });

  if (isLoading) {
    return <div className="text-center">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Ошибка загрузки данных.</div>
    );
  }

  const formatDate = (dateString: string) => {
    // Парсим строку в объект Date
    const date = parse(dateString, "dd.MM.yyyy", new Date());

    // Форматируем дату в нужный формат
    return format(date, "d MMMM", { locale: ru }); // "24 октября"
  };

  const tours = data?.hottours?.tour || [];

  return (
    <div className="flex flex-col my-14 mx-36 gap-8">
      <div className="flex items-end gap-1">
        <h2 className="text-3xl font-semibold">Горящие туры</h2>
        <BsFire className="text-3xl text-orange-500" />
      </div>

      <div className="grid grid-cols-4 gap-9">
        {tours.map((tour: any, index: number) => (
          <div
            key={index}
            className=" bg-white shadow-md rounded-md flex flex-col w-72 cursor-pointer"
            onClick={() => navigate(`/hotel/${tour.hotelcode}`)}
          >
            {/* Фотография отеля */}
            <img
              src={`https:${tour.hotelpicture}` || "/default-image.jpg"}
              alt={tour.hotelname}
              width={320}
              height={200}
              className="rounded-lg object-cover h-48"
            />

            <div className="flex flex-col">
              {/* Звездность и рейтинг отеля */}
              <div className="flex items-center gap-2 justify-between px-2 bg-blue-400 py-1 absolute w-72 mt-[-27px]">
                <div className="flex gap-0.5">
                  {Array.from({ length: parseInt(tour.hotelstars) }, (_, i) => (
                    <GoStarFill key={i} className="text-white" />
                  ))}
                </div>
                <span className="text-white text-sm font-medium h-5">
                  {tour.hotelrating === "0" ? "" : tour.hotelrating + " / 5"}
                </span>
              </div>

              <div className="flex flex-col gap-2 px-2 pb-2 pt-1">
                {/* Название отеля с обрезкой текста */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold truncate">
                    {tour.hotelname.length > 20
                      ? `${tour.hotelname.substring(0, 26)}...`
                      : tour.hotelname}
                  </h3>

                  {/* Город и регион */}
                  <p className="text-gray-500 font-medium">
                    {tour.hotelregionname}, {tour.countryname}
                  </p>
                </div>

                <div>
                  {/* Информация о вылете */}
                  <p className="text-blue-500 text-sm">
                    из {tour.departurenamefrom}, {formatDate(tour.flydate)}. На{" "}
                    {tour.nights} ночей
                  </p>
                </div>

                {/* Цены */}
                <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-md justify-between">
                  <span className="text-sm text-black line-through">
                    {tour.priceold} {tour.currency}
                  </span>
                  <p className="text-black flex gap-2 items-baseline">
                    за двоих
                    <span className=" text-lg text-orange-500 font-semibold">
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
        ))}
      </div>
    </div>
  );
}
