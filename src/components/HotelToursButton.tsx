import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface HotelToursButtonProps {
  onClick: () => void;
  isActive: boolean;
  isMobile?: boolean;
}

export const HotelToursButton = ({
  onClick,
  isActive,
  isMobile = false,
}: HotelToursButtonProps) => {
  return (
    <button
      className={`text-white rounded-full transition-colors
        ${
          isMobile
            ? "w-8 h-8 bg-slate-500 p-2"
            : "bg-slate-500 p-2 hover:bg-green-600"
        }`}
      onClick={onClick}
    >
      {isActive ? (
        <IoIosArrowDown size={isMobile ? 16 : 20} />
      ) : (
        <IoIosArrowForward size={isMobile ? 16 : 20} />
      )}
    </button>
  );
};
