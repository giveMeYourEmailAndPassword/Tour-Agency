import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useRef } from "react";

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
  const mapRef = useRef<any>(null);

  const handleMapClick = () => {
    // Получаем все элементы управления карты
    const controls = mapRef.current?.controls;
    // Находим кнопку fullscreenControl и программно нажимаем на неё
    const fullscreenControl = controls?.get("fullscreenControl");
    fullscreenControl?.enterFullscreen();
  };

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden relative cursor-pointer group"
      onClick={handleMapClick}
    >
      <YMaps>
        <div className="w-full h-full">
          <Map
            instanceRef={mapRef}
            className="w-full h-full"
            defaultState={{
              center: [latitude, longitude],
              zoom: 16,
              controls: ["fullscreenControl"],
            }}
            modules={["control.FullscreenControl"]}
            options={{
              copyrightUaVisible: false, // Убирает ссылку на пользовательское соглашение
              suppressMapOpenBlock: true, // Убирает кнопку "Открыть в Яндекс.Картах"
            }}
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

      {/* Оверлей с эффектом при наведении */}
      <div className="absolute inset-0 group-hover:bg-black/5 transition-colors" />
    </div>
  );
}
