import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import MobileFavorite from "../../components/filters/OtherMobile/MobileFavorite";
import MobileFilterOurTours from "./MobileFilterOurTours/MobileFilterOurTours";

export default function HeaderMOT() {
  return (
    <div className="w-full bg-blue-500 shadow-sm">
      <div className="flex justify-between items-center px-2 py-2 gap-2">
        <a
          className="text-white bg-blue-700 rounded-full p-2 
                     transition-all duration-200 
                     active:scale-90 
                     hover:bg-blue-900"
          href="/"
        >
          <IoIosArrowBack size={24} />
        </a>

        <MobileFilterOurTours />

        <div className="flex items-center gap-2">
          <MobileFavorite />
          <button className="text-white transition-transform active:scale-90 bg-blue-700 rounded-full p-2">
            <BsThreeDotsVertical size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
