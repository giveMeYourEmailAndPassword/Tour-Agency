import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

const fetchHotTours = async (
  city: number,
  items: number,
  authlogin: string,
  authpass: string
) => {
  const params = {
    city,
    items,
    authlogin,
    authpass,
    format: "json",
  };

  const { data } = await axios.get("http://tourvisor.ru/xml/hottours.php", {
    params,
  });
  return data;
};

const useHotTours = (
  city: number,
  items: number,
  authlogin: string,
  authpass: string
) => {
  return useQuery(
    ["hottours", city, items],
    () => fetchHotTours(city, items, authlogin, authpass),
    {
      enabled: !!city && !!items && !!authlogin && !!authpass, // Выполнять запрос только если все параметры заданы
    }
  );
};

export default function HotTours() {
  const navigate = useNavigate();

  const fetchHotTours = async () => {
    const response = await axios.get("http://tourvisor.ru/xml/hottours.php", {
      params: {
        authlogin: "Ikram.kv@gmail.com",
        authpass: "YkCfsYMj4322",
        city: "80", // Бишкек
        items: "16", // Получить 10 туров
        format: "json",
      },
    });
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["hotTours"],
    queryFn: fetchHotTours, // Функция для выполнения запроса
  });

  if (isLoading) {
    return <div className="text-center">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Ошибка загрузки данных.</div>
    );
  }

  const tours = data?.hottours?.tour || [];

  return (
    <div className="flex flex-col my-14 mx-36 gap-8">
      <h2 className="text-3xl font-semibold">Горящие туры</h2>

      <div className="grid grid-cols-4 gap-9">
        {tours.map((tour: any, index: number) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-md flex flex-col w-72"
            onClick={() => navigate(`/hotel/${tour.hotelcode}`)}
          >
            <img
              src={tour.hotelpicture || "/default-image.jpg"}
              alt={tour.hotelname}
              width={320}
              height={200}
              className="rounded-lg"
            />

            <div className="flex flex-col gap-1 mt-2">
              <div>
                <p className="text-black font-semibold">{tour.hotelname}</p>
                <p className="text-black">{tour.hotelregionname}</p>
              </div>
              <p className="text-black">
                {tour.departurename} – {tour.countryname}
              </p>
              <p className="text-black">
                От{" "}
                <span className="font-bold">
                  {tour.price} {tour.currency}
                </span>{" "}
                за человека
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
