import { useState } from "react";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface HotelInfoButtonProps {
  hotelcode: string;
}

export const HotelInfoButton = ({ hotelcode }: HotelInfoButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data: hotelDetails, isLoading } = useHotelDetails(
    hotelcode,
    shouldFetch
  );

  const handleClick = () => {
    if (!shouldFetch) {
      setShouldFetch(true);
    }
    setIsExpanded(!isExpanded);
  };

  const formatText = (text: string) => {
    return text
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={`px-4 py-2 bg-slate-200 text-black/50 font-semibold text-xs rounded-full transition flex items-center gap-1
          ${isExpanded ? "bg-blue-500 text-white" : "hover:bg-slate-300"}`}
      >
        <span>ОБ ОТЕЛЕ</span>
        {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      {isExpanded && (
        <div className="mt-4 w-full animate-slideDown">
          {isLoading ? (
            <div className="text-center text-gray-500">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
              {/* Левая колонка */}
              <div className="space-y-4">
                {hotelDetails?.data?.hotel?.placement && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Расположение
                    </h3>
                    <p className="text-sm text-gray-600">
                      {hotelDetails.data.hotel.placement}
                    </p>
                  </div>
                )}
                {hotelDetails?.data?.hotel?.territory && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Территория и услуги
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formatText(hotelDetails.data.hotel.territory).map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Правая колонка */}
              <div className="space-y-4">
                {hotelDetails?.data?.hotel?.beach && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Пляж</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formatText(hotelDetails.data.hotel.beach).map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {hotelDetails?.data?.hotel?.inroom && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      В номере
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formatText(hotelDetails.data.hotel.inroom).map(
                        (item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
