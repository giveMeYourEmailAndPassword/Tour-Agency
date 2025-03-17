import useHotelDetails from "../Hooks/UseHotelDetails";

interface HotelInfoContentProps {
  hotelcode: string;
}

export const HotelInfoContent = ({ hotelcode }: HotelInfoContentProps) => {
  const { data: hotelDetails, isLoading } = useHotelDetails(hotelcode, true);

  const formatText = (text: string) => {
    return text
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl">
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
      <div className="space-y-4">
        {hotelDetails?.data?.hotel?.beach && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Пляж</h3>
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
            <h3 className="font-semibold text-gray-700 mb-2">В номере</h3>
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
