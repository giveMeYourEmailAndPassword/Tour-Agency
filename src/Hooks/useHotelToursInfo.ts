import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface HotelData {
  name: string;
  stars: string;
  rating: string;
  country: string;
  region: string;
  description: string;
  images: {
    image: string[];
  };
  services: string[];
  meal: string;
  beach: string;
}

export default function useHotelToursInfo() {
  const { hotelcode } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotel", hotelcode],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/hotels/${hotelcode}`);
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные об отеле");
      }
      return response.json();
    },
    enabled: !!hotelcode,
  });

  return {
    hotel: data?.data?.hotel as HotelData | undefined,
    isLoading,
    error,
  };
}
