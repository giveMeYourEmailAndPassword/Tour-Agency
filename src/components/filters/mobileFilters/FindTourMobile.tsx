import { useContext } from "react";
import { FiSearch } from "react-icons/fi";
import { DataContext } from "../../DataProvider";
import { useNavigate } from "react-router-dom";

export default function FindTourMobile() {
  const { searchTours, loading } = useContext(DataContext);
  const navigate = useNavigate();

  const handleSearchClick = async () => {
    await searchTours();
    navigate("/OurTours");
  };

  return (
    <button
      onClick={handleSearchClick}
      disabled={loading}
      className="w-full flex justify-center items-center gap-2 py-3 px-6 mb-2 bg-[#FF621F] rounded-lg disabled:bg-gray-400"
    >
      <span className="text-lg font-medium text-white">Найти туры</span>
      <FiSearch className="w-5 h-5 text-white" />
    </button>
  );
}
