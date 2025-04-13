import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

interface HotelMapProps {
  hotelName: string;
  coordinates: [number, number]; // [широта, долгота]
  hotelRating: number;
  hotelStars: number;
}

export default function HotelMap({
  hotelName,
  coordinates: [latitude, longitude],
}: HotelMapProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <YMaps>
        <div className="w-full h-full">
          <Map
            className="w-full h-full"
            defaultState={{
              center: [latitude, longitude],
              zoom: 16,
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
    </div>
  );
}
