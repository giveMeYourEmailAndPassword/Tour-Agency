import { FiSearch } from "react-icons/fi";
import { DataContext } from "../DataProvider";
import { useContext } from "react";

interface FindTourBtnProps {
  onSearch: () => void;
}

export default function FindTourBtn({ onSearch }: FindTourBtnProps) {
  const { searchTours, loading } = useContext(DataContext);

  const handleSearchClick = async () => {
    await searchTours();
    onSearch(); // Показываем результаты после поиска
  };

  return (
    <button
      onClick={handleSearchClick}
      disabled={loading}
      className="w-[70px] h-[58px] flex items-center justify-center border border-[#FF621F] bg-[#FF621F] rounded-lg hover:bg-[#E55A1C] transition-colors duration-300 disabled:bg-gray-400 disabled:border-gray-400"
    >
      <FiSearch className="w-8 h-8 text-[#FAFBF6]" />
    </button>
  );
}
