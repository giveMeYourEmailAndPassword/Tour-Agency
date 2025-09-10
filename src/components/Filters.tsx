import { useEffect } from "react";
import HotelType from "./filters/HotelType";
import Raiting from "./filters/Raiting";
import HotelService from "./filters/HotelService";
import Nourishment from "./filters/Nourishment";
import Charter from "./filters/Charter";

export default function Filters() {
  useEffect(() => {
    sessionStorage.removeItem("searchData");
  }, []);

  return (
    <div className="w-[400px] flex-shrink-0 border border-[#DBE0E5] rounded-lg p-4 flex flex-col gap-3">
      {/* Чартер */}
      <Charter />
      {/* Питание */}
      <Nourishment />

      {/* Тип отеля */}
      <HotelType />

      {/* Рейтинг */}
      <Raiting />

      {/* Услуги */}
      <HotelService />
    </div>
  );
}
