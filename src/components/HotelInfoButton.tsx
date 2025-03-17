import { useState } from "react";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface HotelInfoButtonProps {
  hotelcode: string;
  onClick: () => void;
}

export const HotelInfoButton = ({
  hotelcode,
  onClick,
}: HotelInfoButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-0.5 bg-slate-200 text-black/50 font-semibold text-xs rounded-full transition flex items-center gap-1
        ${isExpanded ? "bg-blue-500 text-white" : "hover:bg-slate-300"}`}
    >
      <span>ОБ ОТЕЛЕ</span>
      {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
    </button>
  );
};
