import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotelDetails = async (hotelcode: string) => {
  const { data } = await axios.get(`${API_BASE_URL}/hotel/${hotelcode}`);
  return data;
};

const useHotelDetails = (hotelcode: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["hotelDetails", hotelcode],
    queryFn: () => fetchHotelDetails(hotelcode),
    enabled: enabled && !!hotelcode,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
  });
};

export default useHotelDetails;
