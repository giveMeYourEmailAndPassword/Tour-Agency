import { useState, useContext } from "react";
import { GoStarFill } from "react-icons/go";
import { DataContext } from "../../../components/DataProvider";

export default function StarsFilterOT() {
  const { setData, params } = useContext(DataContext);
  const [rating, setRating] = useState(params?.param9 || 3);
  const [hoverRating, setHoverRating] = useState(params?.param9 || 3);

  const handleClick = (newRating: number) => {
    setRating(newRating);
    setData("param9", newRating);
  };

  const handleMouseEnter = (newHoverRating: number) => {
    setHoverRating(newHoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center px-4 bg-blue-600 rounded-lg border border-slate-300 w-[26%]">
      <div className="flex items-center w-full justify-between px-1">
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
