import { useState, useContext, useEffect } from "react";
import { GoStarFill } from "react-icons/go";
import { DataContext } from "../../../../../components/DataProvider";

interface MobileStarsFilterOTProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  onFilterChange?: (isActive: boolean) => void;
}

export default function MobileSFOT({
  initialRating = 1,
  onRatingChange,
  onFilterChange,
}: MobileStarsFilterOTProps) {
  const { setData, params } = useContext(DataContext);
  const [hoverRating, setHoverRating] = useState(0);
  const rating = params?.param9 || initialRating;

  useEffect(() => {
    if (onFilterChange && rating !== initialRating) {
      onFilterChange(true);
    } else if (onFilterChange) {
      onFilterChange(false);
    }
  }, [rating, initialRating, onFilterChange]);

  const handleClick = (newRating: number) => {
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
