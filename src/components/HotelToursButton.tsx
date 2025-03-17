import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface HotelToursButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export const HotelToursButton = ({
  onClick,
  isActive,
}: HotelToursButtonProps) => {
  return (
    <button
      className="bg-slate-500 text-white p-2 rounded-full hover:bg-green-600"
      onClick={onClick}
    >
      {isActive ? (
        <IoIosArrowDown size={20} />
      ) : (
        <IoIosArrowForward size={20} />
      )}
    </button>
  );
};
