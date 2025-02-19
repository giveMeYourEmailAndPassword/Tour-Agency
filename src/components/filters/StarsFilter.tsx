import { useState, useContext } from "react";
import { GoStarFill } from "react-icons/go";
import { DataContext } from "../DataProvider";

interface StarsFilterProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StarsFilter({
  initialRating = 3,
  onRatingChange,
}: StarsFilterProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(3);
  const { setData } = useContext(DataContext);

  const handleClick = (newRating: number) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }

    setData("param9", newRating);
  };

  const handleMouseEnter = (newHoverRating: number) => {
    setHoverRating(newHoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center px-4 bg-blue-600 rounded-lg border border-slate-300 w-[18rem]">
      <div className="flex items-center gap-14">
        <h1 className="text-base text-white">Класс отеля</h1>

        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <GoStarFill
              key={star}
              className={`text-xl cursor-pointer ${
                (hoverRating || rating) >= star
                  ? "text-orange-500"
                  : "text-blue-400"
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
