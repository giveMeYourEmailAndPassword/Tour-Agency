import { IoMoonOutline } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";

interface BookingPanelProps {
  price: string;
  currency: string;
  nights: number;
  meal: string;
}

export default function BookingPanel({
  price,
  currency,
  nights,
  meal,
}: BookingPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-[1420px] mx-auto px-28 py-2 flex items-center justify-between">
        {/* Информация о туре */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <IoMoonOutline className="text-indigo-600 text-xl" />
            <span className="text-gray-700 font-medium">{nights} ночей</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUtensils className="text-purple-600 text-xl" />
            <span className="text-gray-700 font-medium">{meal}</span>
          </div>
        </div>

        {/* Цена и кнопки */}
        <div className="flex items-center gap-6">
          {/* Цена */}
          <div className="flex flex-col items-end">
            <span className="text-gray-500">за двоих</span>
            <span className="text-2xl font-bold text-gray-900">
              {price}
              {currency === "EUR" ? "€" : currency === "USD" ? "$" : currency}
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                /* Добавить в избранное */
              }}
              className="px-4 py-2 border-2 border-blue-600 text-blue-600 
              rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              В избранное
            </button>
            <button
              onClick={() => {
                /* Забронировать */
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium 
              hover:bg-blue-500 transition-colors shadow-md"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
