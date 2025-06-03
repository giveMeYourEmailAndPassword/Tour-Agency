import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import useHotelData from "../Hooks/useHotelData";

interface HotelImageProps {
  imageUrl: string;
  hotelName: string;
  hotelcode: string;
  isMobile?: boolean;
}

export const HotelImage = ({
  imageUrl,
  hotelName,
  hotelcode,
  isMobile = false,
}: HotelImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data: hotelDetails } = useHotelData(hotelcode, shouldFetch);

  const handleSearchClick = () => {
    setShouldFetch(true);
    setIsOpen(true);
  };

  const slides = [
    { src: imageUrl || "/placeholder.jpg" },
    ...(hotelDetails?.data?.hotel?.images?.image?.map((img: string) => ({
      src: img,
    })) || []),
  ];

  return (
    <div className="relative group">
      <div className="relative">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={hotelName}
          className={
            isMobile
              ? "w-32 h-28 object-cover rounded-lg"
              : "rounded-r-md w-full h-52 object-cover"
          }
        />
        <button
          onClick={handleSearchClick}
          className={`absolute bottom-0 left-0 p-2 bg-black/65 
            ${isMobile ? "rounded-bl-lg p-1" : "rounded-tr-xl"}
            opacity-0 group-hover:opacity-100 transition-opacity 
            duration-300`}
        >
          <FaSearch
            className={`${isMobile ? "w-3 h-3" : "w-5 h-5"} text-gray-200`}
          />
        </button>
      </div>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        plugins={[Thumbnails]}
        carousel={{ finite: false }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          padding: 4,
          gap: 8,
          border: 1,
          borderRadius: 4,
        }}
      />
    </div>
  );
};
