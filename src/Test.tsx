import React from "react";
import starFilled from "./assets/icons/star-filled.svg";
import starOutline from "./assets/icons/star-outline.svg";
import utensils from "./assets/icons/utensils.svg";
import bed from "./assets/icons/bed.svg";

interface HotelCardProps {
  image: string;
  stars: number;
  rating: number;
  departureCity: string;
  hotelName: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  nights: number;
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  stars,
  rating,
  departureCity,
  hotelName,
  location,
  price,
  startDate,
  endDate,
  nights,
}) => {
  const renderStars = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <img
          key={index}
          src={index < stars ? starFilled : starOutline}
          alt={index < stars ? "filled star" : "outline star"}
          className="w-4 h-4"
        />
      ));
  };

  return (
    <div className="w-72 flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px]">
      <div className="w-64 flex flex-col gap-2">
        {/* Image */}
        <div className="w-full h-36 rounded">
          <img
            src={image}
            alt={hotelName}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Hotel Info */}
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between items-center gap-1">
            <div className="flex items-center gap-0.5">
              {renderStars()}
              <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                {rating}
              </div>
            </div>
            <span className="text-xs text-[#FF621F]">{departureCity}</span>
          </div>

          <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
            {hotelName}
          </h3>
          <p className="text-[#6B7280] text-sm font-light leading-[1.29]">
            {location}
          </p>
        </div>

        {/* Tags */}
        <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
          <div className="flex items-center gap-1">
            <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
            <span className="text-sm text-[#2E2E32]">Завтрак</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={bed} alt="room" className="w-3.5 h-3.5" />
            <span className="text-sm text-[#2E2E32]">Standart</span>
          </div>
        </div>

        {/* Price and Dates */}
        <div className="w-full flex justify-between items-center">
          <span className="text-xl font-bold text-[#2E2E32]">{price} €</span>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[#2E2E32]">{`${startDate} - ${endDate}`}</span>
            <span className="text-xs font-light text-[#6B7280]">{`кол-во ночей: ${nights}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
