import Header from "./components/Header";
import Filters from "./components/Filters";
import { TbPointFilled } from "react-icons/tb";
import HotTours from "./components/HotTours";
import { useState, useRef } from "react";
import FloatingControls from "./components/FloatingControls";
import FiltersMobile from "./components/FiltersMobile";
import HotelCard from "./Test";

export default function App() {
  const [params, setParams] = useState({});
  const hotToursRef = useRef(null);

  const setData = (key, value) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  };

  const scrollToHotTours = (e) => {
    e.preventDefault();
    hotToursRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Секция с синим фоном */}
      <div className="w-fullmt-1 md:mt-0 bg-white">
        <div className="max-w-[1440px] mx-auto">
          {/* Фильтры */}
          <div className="md:block hidden">
            <Filters />
          </div>
          <div className="block md:hidden">
            <FiltersMobile />
          </div>
        </div>
      </div>
    </div>
  );
}
