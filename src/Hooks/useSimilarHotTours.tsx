import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Tour {
  tourid: string;
  countrycode: string;
  countryname: string;
  departurecode: string;
  departurename: string;
  departurenamefrom: string;
  operatorcode: string;
  operatorname: string;
  hotelcode: string;
  hotelname: string;
  hotelstars: string;
  hotelregioncode: string;
  hotelregionname: string;
  hotelrating: string;
  fulldesclink: string;
  hotelpicture: string;
  flydate: string;
  nights: string;
  meal: string;
  price: string;
  priceold: string;
  fuelcharge: string;
  currency: string;
}

interface HotToursResponse {
  hottours: {
    hotcount: string;
    tour: Tour[];
  };
}

const fetchSimilarTours = async (
  countrycode: string,
  departurecode: string
) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/similar-tours?countrycode=${countrycode}&departurecode=${departurecode}`
  );
  return data;
};

const useSimilarHotTours = (
  countrycode: string,
  departurecode: string,
  enabled: boolean = true
) => {
  return useQuery<HotToursResponse>({
    queryKey: ["similarTours", countrycode, departurecode],
    queryFn: () => fetchSimilarTours(countrycode, departurecode),
    enabled: enabled && !!countrycode && !!departurecode,
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 60, // 1 час
  });
};

export default useSimilarHotTours;
