import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";

export default function Favorite() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    setFavoriteCount((prev) => (isFavorite ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-col items-center" onClick={handleFavoriteClick}>
      <div
        className="bg-white hover:bg-gray-50 rounded-l-xl w-28
        h-20 flex flex-col items-center justify-center 
        shadow-sm transition-all duration-300 border-2 border-r-0"
      >
        <button className="">
          {isFavorite ? (
            <FaHeart className="text-red-500" size={32} />
          ) : (
            <FaRegHeart className="text-gray-400" size={32} />
          )}
        </button>
        <div className="text-base font-normal text-gray-500">Избранное</div>
      </div>
    </div>
  );
}
