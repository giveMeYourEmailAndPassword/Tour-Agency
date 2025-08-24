import { useState, useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import FavoriteModal from "./Favorite/FavoriteModal";
import { DataContext } from "./DataProvider";

export default function Header() {
  const { favoriteTours, isFavorite } = useContext(DataContext);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 md:bg-white pt-4 px-3 md:px-0">
      <div className="max-w-[1560px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">Втепло</div>

          {/* Кнопка избранного */}
          <div className="flex items-center">
            <button
              onClick={() => setIsFavoriteModalOpen(true)}
              className="relative p-2 rounded-lg border-2 border-gray-200 hover:border-[#FF621F] hover:text-[#FF621F] transition-colors"
              title="Избранные туры"
            >
              {isFavorite ? (
                <FaHeart className="text-[#FF621F]" size={20} />
              ) : (
                <FaRegHeart className="text-gray-400" size={20} />
              )}
              {favoriteTours.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-[#FF621F] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {favoriteTours.length}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Модальное окно избранного для десктопа */}
        <Modal
          isOpen={isFavoriteModalOpen}
          onOpenChange={() => setIsFavoriteModalOpen(false)}
          shouldBlockScroll={false}
          backdrop="opaque"
          classNames={{
            closeButton: "md:block hidden",
          }}
          className="hidden md:block" // Скрываем на мобильных
        >
          <ModalContent className="max-w-5xl max-h-[66vh] py-2 pr-2">
            <>
              <ModalHeader className="flex gap-1 py-2 px-3 md:px-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-medium">
                    Избранные туры
                  </span>
                  {favoriteTours.length > 0 && (
                    <div className="flex items-center gap-1 bg-[#FF621F] py-0.5 px-4 rounded-full whitespace-nowrap">
                      <span className="font-semibold text-base text-white">
                        {favoriteTours.length}
                      </span>
                    </div>
                  )}
                </div>
              </ModalHeader>
              <ModalBody className="h-[60vh] overflow-y-auto scrollbar-custom px-3 md:px-6">
                <FavoriteModal tours={favoriteTours} />
              </ModalBody>
              <ModalFooter />
            </>
          </ModalContent>
        </Modal>

        {/* Мобильное модальное окно избранного в стиле стран */}
        <Modal
          isOpen={isFavoriteModalOpen}
          onClose={() => setIsFavoriteModalOpen(false)}
          placement="bottom"
          backdrop="opaque"
          radius="sm"
          scrollBehavior="inside"
          isDismissable={true}
          shouldBlockScroll={true}
          className="!p-0 !m-0 !max-w-full md:hidden"
          hideCloseButton={true}
          shadow="none"
          classNames={{
            backdrop: "bg-black/30", // Устанавливаем прозрачность 30% как в странах
          }}
          motionProps={{
            variants: {
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              },
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              },
            },
          }}
        >
          <ModalContent>
            <div className="w-full">
              <div className="bg-white w-full rounded-t-[10px]">
                {/* Header */}
                <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                  <h2 className="text-[20px] font-medium text-[#2E2E32]">
                    Избранные туры
                  </h2>
                  <button
                    onClick={() => setIsFavoriteModalOpen(false)}
                    className="absolute right-5"
                  >
                    <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  <FavoriteModal tours={favoriteTours} />
                </div>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
