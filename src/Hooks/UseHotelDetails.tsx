import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchHotelDetails = async (hotelcode: string) => {
  const { data } = await axios.get(
    `https://niyazbekov-tour-agency-64.deno.dev/api/hotel/${hotelcode}`
  );
  console.log("Полученные данные:", data);
  return data;
};

const useHotelDetails = (hotelcode: string) => {
  return useQuery({
    queryKey: ["hotelDetails", hotelcode],
    queryFn: () => fetchHotelDetails(hotelcode),
    enabled: !!hotelcode,
  });
};

export default useHotelDetails;
