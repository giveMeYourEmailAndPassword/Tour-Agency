import { FaSearch } from "react-icons/fa";
import { DataContext } from "../../components/DataProvider";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function FindMultyToursBtn() {
  const navigate = useNavigate();
  const { searchMultyTours, params, loading } = useContext(DataContext);

  const handleSearchClick = async () => {
    // Создаем URLSearchParams из текущих параметров
    const urlParams = new URLSearchParams();

    // Добавляем все параметры
    if (params.param1) urlParams.set("departure", params.param1.toString());
    if (params.param2) urlParams.set("country", params.param2.toString());
    if (params.param3?.startDay)
      urlParams.set("nightsFrom", params.param3.startDay.toString());
    if (params.param3?.endDay)
      urlParams.set("nightsTo", params.param3.endDay.toString());
    if (params.param4?.startDate)
      urlParams.set("dateFrom", params.param4.startDate);
    if (params.param4?.endDate) urlParams.set("dateTo", params.param4.endDate);
    if (params.param5?.adults)
      urlParams.set("adults", params.param5.adults.toString());
    if (params.param5?.childrenList?.length) {
      urlParams.set("children", params.param5.childrenList.join(","));
    }
    if (params.param6?.length)
      urlParams.set("hotelTypes", params.param6.join(","));
    if (params.param7?.length) urlParams.set("meal", params.param7[0]);
    if (params.param8?.length) urlParams.set("rating", params.param8[0]);
    if (params.param9) urlParams.set("stars", params.param9.toString());
    if (params.param10?.length)
      urlParams.set("services", params.param10.join(","));

    // Навигация с параметрами
    navigate({
      pathname: "/OurToursForManager",
      search: urlParams.toString(),
    });

    // Запускаем поиск
    await searchMultyTours();
  };

  return (
    <div
      className={`rounded-lg border flex items-center h-16 w-44 justify-center ml-2 
        ${loading ? "bg-gray-400" : "bg-blue-400 hover:bg-orange-500"} 
        duration-500 cursor-pointer`}
      onClick={handleSearchClick}
    >
      <FaSearch className="text-white mr-2 text-lg" />
      <p className="text-white font-medium text-lg">
        {loading ? "Поиск..." : "Найти"}
      </p>
    </div>
  );
}
