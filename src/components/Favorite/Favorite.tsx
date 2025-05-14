import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import FavoriteModal from "./FavoriteModal";
import { DataContext } from "../../components/DataProvider";

export default function Favorite() {
  const { favoriteTours, isFavorite } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col items-center"
        onClick={() => setIsOpen(true)}
      >
        <div
          className="bg-white hover:bg-gray-50 rounded-l-xl lg:w-[6.8rem] lg:h-20
          md:w-24 md:h-16 flex flex-col items-center justify-center shadow-sm
         transition-all duration-300 border-2 border-r-0"
        >
          <button className="relative">
            {isFavorite ? (
              <FaHeart className="text-red-500" size={32} />
            ) : (
              <FaRegHeart className="text-gray-400" size={32} />
            )}
            {favoriteTours.length > 0 && (
              <div
                className="absolute lg:-top-2 lg:-right-2 md:-top-1.5 md:-right-1.5
               bg-blue-500 text-white rounded-full lg:w-5 lg:h-5 md:w-4 md:h-4
               flex items-center justify-center text-xs font-medium"
              >
                {favoriteTours.length}
              </div>
            )}
          </button>
          <div className="lg:text-base md:text-xs font-normal text-gray-500">
            Избранное
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        shouldBlockScroll={false}
        backdrop="opaque"
        classNames={{
          closeButton: "text-xl",
        }}
      >
        <ModalContent className="max-w-5xl max-h-[66vh] py-2 pr-2">
          <>
            <ModalHeader className="flex gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-medium">Избранные туры</span>
                {favoriteTours.length > 0 && (
                  <div className="flex items-center gap-1 bg-blue-500 py-0.5 px-3 rounded-full shadow-sm whitespace-nowrap">
                    <span className="font-semibold text-base text-white">
                      {favoriteTours.length}
                    </span>
                  </div>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="h-[60vh] overflow-y-auto  scrollbar-custom">
              <FavoriteModal tours={favoriteTours} />
            </ModalBody>
            <ModalFooter />
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
