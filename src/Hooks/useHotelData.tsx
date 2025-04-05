import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotelData = async (hotelcode: string) => {
  const { data } = await axios.get(`${API_BASE_URL}/hotels/${hotelcode}`);
  return data;
};

const useHotelData = (hotelcode: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["hotelData", hotelcode],
    queryFn: () => fetchHotelData(hotelcode),
    enabled: enabled && !!hotelcode,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 1 час
  });
};

export default useHotelData;
