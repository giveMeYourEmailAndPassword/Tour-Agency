import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchHotelDetails = async (hotelcode: string) => {
  const { data } = await axios.get("http://tourvisor.ru/xml/hotel.php", {
    params: {
      hotelcode,
      authlogin: "Ikram.kv@gmail.com",
      authpass: "YkCfsYMj4322",
      imgbig: 1, // Большие изображения
      removetags: 1, // Убираем HTML-теги
      format: "json",
    },
  });
  console.log("Полученные данные:", data);
  console.log("Данные отеля:", data?.data?.hotel);
  return data;
};

const useHotelDetails = (hotelcode: string) => {
  return useQuery({
    queryKey: ["hotelDetails", hotelcode],
    queryFn: () => fetchHotelDetails(hotelcode),
    enabled: !!hotelcode, // Выполняется запрос только при наличии hotelcode
  });
};

export default useHotelDetails;
