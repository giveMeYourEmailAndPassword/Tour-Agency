import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import FavoriteModal from "../../Favorite/FavoriteModal";
import { DataContext } from "../../DataProvider";

export default function MobileFavorite() {
  const { favoriteTours, isFavorite } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-700"
        onClick={() => setIsOpen(true)}
      >
        <button className="relative">
          {isFavorite ? (
            <FaHeart className="text-red-500" size={22} />
          ) : (
            <FaRegHeart className="text-white" size={22} />
          )}
          {favoriteTours.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
              {favoriteTours.length}
            </div>
          )}
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        shouldBlockScroll={false}
        backdrop="opaque"
        placement="bottom"
        className="!p-0 !m-0 !max-w-full flex flex-col fixed inset-0 overflow-hidden"
        hideCloseButton={true}
        size="full"
      >
        <ModalContent className="flex flex-col h-screen overflow-auto">
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">Избранные туры</span>
              {favoriteTours.length > 0 && (
                <div className="flex items-center gap-1 bg-blue-500 py-0.5 px-3 rounded-full shadow-sm">
                  <span className="font-medium text-sm text-white">
                    {favoriteTours.length}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </ModalHeader>
          <ModalBody className="flex-1 overflow-y-auto px-3 py-2">
            <FavoriteModal tours={favoriteTours} />
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}
