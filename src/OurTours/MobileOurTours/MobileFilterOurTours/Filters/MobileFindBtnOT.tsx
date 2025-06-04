import { FaSearch } from "react-icons/fa";
import { DataContext } from "../../../../components/DataProvider";
import { useContext } from "react";

interface MobileFindBtnOTProps {
  onClose: () => void;
}

export default function MobileFindBtnOT({ onClose }: MobileFindBtnOTProps) {
  const { searchTours, loading } = useContext(DataContext);

  const handleSearchClick = async () => {
    // Запускаем поиск
    await searchTours();
    // Закрываем модальное окно после поиска
    onClose();
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
