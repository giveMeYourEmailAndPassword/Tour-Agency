import { FiSearch } from "react-icons/fi";
import { DataContext } from "../DataProvider";
import { useContext } from "react";

interface FindTourBtnProps {
  onSearch: () => void;
}

export default function FindTourBtn({ onSearch }: FindTourBtnProps) {
  const { searchTours, searchInProgress } = useContext(DataContext);

  const handleSearchClick = async () => {
    await searchTours();
    onSearch();
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
