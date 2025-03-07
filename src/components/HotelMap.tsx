import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

interface HotelMapProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  coordinates: [number, number]; // [широта, долгота]
  hotelRating: number;
  hotelStars: number;
}

export default function HotelMap({
  isOpen,
  onClose,
  hotelName,
  coordinates: [latitude, longitude],
  hotelRating,
  hotelStars,
}: HotelMapProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        closeButton: "text-xl",
      }}
    >
      <ModalContent className="max-w-4xl max-h-[80vh] px-4 py-2">
        <>
          <ModalHeader className="flex gap-1">
            <div className="flex items-center gap-2">
              <span>Расположение отеля:</span>
              <span className="text-xl font-bold">
                {hotelName.length > 37
                  ? `${hotelName.slice(0, 37)}...`
                  : hotelName}
              </span>
              <div className="flex-shrink-0 flex gap-2">
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="font-semibold text-base">{hotelRating}</span>
                </div>
                <div className="bg-blue-100 px-2 py-0.5 rounded-full shadow-sm flex items-center whitespace-nowrap">
                  <span className="text-blue-600 font-semibold text-base">
                    {hotelStars} / 5
                  </span>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="h-[60vh]">
            <YMaps>
              <div className="w-full h-[130vh]">
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
          </ModalBody>
          <ModalFooter />
        </>
      </ModalContent>
    </Modal>
  );
}
