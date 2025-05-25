import { FaSearch } from "react-icons/fa";
import { DataContext } from "../DataProvider";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function FindBtnMobile() {
  const navigate = useNavigate();
  const { searchTours, tours, loading } = useContext(DataContext);

  const handleSearchClick = async () => {
    // Запускаем поиск
    await searchTours();

    // Перенаправляем на страницу с результатами
    navigate("/OurTours", {
      state: { tours: tours },
    });
  };

  return (
    <div
      className={`mt-1 rounded-lg flex items-center h-12 w-full justify-center
        ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"} 
        duration-500 cursor-pointer`}
      onClick={handleSearchClick}
    >
      <FaSearch className="text-white mr-2 text-lg" />
      <p className="text-white font-medium text-lg">
        {loading ? "Поиск..." : "Найти тур"}
      </p>
    </div>
  );
}
