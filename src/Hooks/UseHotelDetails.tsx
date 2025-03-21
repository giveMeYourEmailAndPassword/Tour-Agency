import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchHotelDetails = async ({
  hotelcode,
  tourId,
}: {
  hotelcode: string;
  tourId: string;
}) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/hotel/${hotelcode}/tour/${tourId}`
  );
  return data;
};

const useHotelDetails = (
  hotelcode: string,
  tourId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["hotelDetails", hotelcode, tourId],
    queryFn: () => fetchHotelDetails({ hotelcode, tourId }),
    enabled: enabled && !!hotelcode && !!tourId,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60,
  });
};

export default useHotelDetails;
