import { FiSearch } from "react-icons/fi";
import { DataContext } from "../DataProvider";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface FindTourBtnProps {
  onSearch: () => void;
}

export default function FindTourBtn({ onSearch }: FindTourBtnProps) {
  const { searchTours, searchInProgress, params } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isOurToursPage = location.pathname === "/OurTours";

  const handleSearchClick = async () => {
    // Создаем URLSearchParams для формирования строки запроса
    const searchParams = new URLSearchParams();

    // Добавляем параметры в URL
    if (params.param1) searchParams.set("departure", params.param1);
    if (params.param2) searchParams.set("country", params.param2);
    if (params.param3?.startDay)
      searchParams.set("nightsFrom", params.param3.startDay.toString());
    if (params.param3?.endDay)
      searchParams.set("nightsTo", params.param3.endDay.toString());
    if (params.param4?.startDate)
      searchParams.set("dateFrom", params.param4.startDate);
    if (params.param4?.endDate)
      searchParams.set("dateTo", params.param4.endDate);
    if (params.param5?.adults)
      searchParams.set("adults", params.param5.adults.toString());
    if (params.param5?.childrenList?.length)
      searchParams.set("children", params.param5.childrenList.join(","));
    if (params.param6?.length)
      searchParams.set("hotelTypes", params.param6.join(","));
    if (params.param7?.length) searchParams.set("meal", params.param7[0]);
    if (params.param8?.length) searchParams.set("rating", params.param8[0]);
    if (params.param9) searchParams.set("stars", params.param9.toString());
    if (params.param10?.length)
      searchParams.set("services", params.param10.join(","));

    const newUrl = `${location.pathname}?${searchParams.toString()}`;

    if (isOurToursPage) {
      // На странице OurTours обновляем URL без перенаправления
      window.history.pushState({}, "", newUrl);
      // Запускаем поиск
      await searchTours();
      onSearch();
    } else {
      // На других страницах перенаправляем на OurTours
      navigate(`/OurTours?${searchParams.toString()}`);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleSearchClick}
        disabled={searchInProgress}
        className="w-[70px] h-[58px] flex items-center justify-center border border-[#FF621F] bg-[#FF621F] rounded-lg hover:bg-[#E55A1C] transition-colors duration-300"
      >
        <FiSearch className="w-8 h-8 text-[#FAFBF6]" />
      </button>
      {searchInProgress && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Подождите, идёт поиск...
        </div>
      )}
    </div>
  );
}
