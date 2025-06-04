import { useState, useContext } from "react";
import { GoStarFill } from "react-icons/go";
import { DataContext } from "../../../DataProvider";

interface MobileStarsFilterProps {
  initialRating?: number;
}

export default function MobileStarsFilter({
  initialRating = 1,
}: MobileStarsFilterProps) {
  const { setData, params } = useContext(DataContext);
  const [hoverRating, setHoverRating] = useState(0);
  const rating = params?.param9 || initialRating;

  const handleClick = (newRating: number) => {
    setData("param9", newRating);
  };

  const handleMouseEnter = (newHoverRating: number) => {
    setHoverRating(newHoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center pt-2 pb-3 px-4 bg-white w-full">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-base text-black">Класс отеля</h1>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <GoStarFill
              key={star}
              className={`text-xl cursor-pointer ${
                (hoverRating || rating) >= star
                  ? "text-orange-500"
                  : "text-slate-300"
              }`}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
