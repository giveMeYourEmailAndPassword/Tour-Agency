import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { CircularProgress } from "@heroui/progress";

interface HotelMapContentProps {
  hotelcode: string;
}

export const HotelMapContent = ({ hotelcode }: HotelMapContentProps) => {
  const { data: hotelDetails, isLoading } = useHotelDetails(hotelcode, true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress color="default" />
      </div>
    );
  }

  const latitude = Number(hotelDetails?.data?.hotel?.coord1);
  const longitude = Number(hotelDetails?.data?.hotel?.coord2);
  const hotelName = hotelDetails?.data?.hotel?.name;

  return (
    <YMaps>
      <div className="w-full h-[50vh]">
        <Map
          className="w-full h-full"
          defaultState={{
            center: [latitude, longitude],
            zoom: 14,
            controls: ["zoomControl", "fullscreenControl"],
          }}
          modules={["control.ZoomControl", "control.FullscreenControl"]}
        >
          <Placemark
            geometry={[latitude, longitude]}
            properties={{
              iconCaption: hotelName,
            }}
          />
        </Map>
      </div>
    </YMaps>
  );
};
