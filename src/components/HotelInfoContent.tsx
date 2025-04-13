import useHotelData from "../Hooks/useHotelData";
import { CircularProgress } from "@heroui/progress";

interface HotelInfoContentProps {
  hotelcode: string;
}

export const HotelInfoContent = ({ hotelcode }: HotelInfoContentProps) => {
  const { data: hotelDetails, isLoading } = useHotelData(hotelcode);

  const formatText = (text: string) => {
    return text
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full border-t py-4 mt-4">
        <CircularProgress color="default" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-4 border-t pt-4 mt-4">
      {/* Левая колонка */}
      <div className="space-y-4">
        {hotelDetails?.data?.hotel?.placement && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Расположение</h3>
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
      <div>
        {hotelDetails?.data?.hotel?.beach && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Пляж</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {formatText(hotelDetails.data.hotel.beach).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hotelDetails?.data?.hotel?.inroom && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">В номере</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {formatText(hotelDetails.data.hotel.inroom).map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
