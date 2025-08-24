import { useEffect } from "react";
import HotelType from "./filters/HotelType";
import Raiting from "./filters/Raiting";
import HotelService from "./filters/HotelService";
import Nourishment from "./filters/Nourishment";

export default function Filters() {
  useEffect(() => {
    sessionStorage.removeItem("searchData");
  }, []);

  return (
    <div className="w-[400px] border border-[#DBE0E5] rounded-lg p-4 flex flex-col gap-3">
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
