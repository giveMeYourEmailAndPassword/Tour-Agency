import { FiSearch } from "react-icons/fi";
import { DataContext } from "../DataProvider";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import service from "../data/HotelServiceData";

interface FindTourBtnProps {
  onSearch: () => void;
}

export default function FindTourBtn({ onSearch }: FindTourBtnProps) {
  const { searchTours, searchInProgress, params } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isOurToursPage = location.pathname === "/OurTours";

  // Функция для конвертации названий сервисов в ID
  const convertServiceNamesToIds = (serviceNames: string[]): string[] => {
    return serviceNames.map((name) => {
      const serviceItem = service.find((s) => s.name === name);
      return serviceItem ? serviceItem.id : name;
    });
  };

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
    if (params.param10?.length) {
      // Конвертируем названия сервисов в ID перед добавлением в URL
      const serviceIds = convertServiceNamesToIds(params.param10);
      searchParams.set("services", serviceIds.join(","));
    }

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
    </div>
  );
}
