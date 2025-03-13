import { FaSearch } from "react-icons/fa";
import { DataContext } from "../DataProvider";
import { useContext } from "react";
import { useNavigate } from "react-router";

export default function FindTourBtn() {
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
