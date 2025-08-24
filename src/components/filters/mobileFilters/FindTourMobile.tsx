import { useContext } from "react";
import { FiSearch } from "react-icons/fi";
import { DataContext } from "../../DataProvider";
import { useNavigate, useLocation } from "react-router-dom";

export default function FindTourMobile() {
  const { loading, params, searchTours, tourDataStatus } =
    useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isOurToursPage = location.pathname === "/OurTours";

  // Проверяем, идет ли поиск
  const isSearching =
    loading ||
    tourDataStatus?.state === "searching" ||
    tourDataStatus?.state === "loading" ||
    (tourDataStatus && tourDataStatus.state !== "finished");

  const handleSearchClick = async () => {
    // Создаем URLSearchParams для формирования строки запроса
    const searchParams = new URLSearchParams();

    // Добавляем параметры в URL
    if (params.param1) searchParams.set("departure", params.param1);
    if (params.param2) searchParams.set("country", params.param2);

    // Добавляем параметр для регионов
    if (params.param2Regions?.length) {
      searchParams.set("regions", params.param2Regions.join(","));
    }

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
    } else {
      // На других страницах перенаправляем на OurTours
      navigate(`/OurTours?${searchParams.toString()}`);
    }
  };

  return (
    <button
      onClick={handleSearchClick}
      disabled={isSearching}
      className={`w-full flex justify-center items-center gap-2 py-3 px-6 mb-2 rounded-lg transition-colors ${
        isSearching
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#FF621F] hover:bg-[#E55A1A]"
      }`}
    >
      <span className="text-lg font-medium text-white">
        {isSearching ? "Поиск..." : "Найти туры"}
      </span>
      <FiSearch className="w-5 h-5 text-white" />
    </button>
  );
}
