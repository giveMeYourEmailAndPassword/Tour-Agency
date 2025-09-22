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
import LOGO from "../assets/logo2.png";
import { FaMapMarkerAlt, FaPhone, FaWhatsapp } from "react-icons/fa";

export default function Header() {
  const { favoriteTours, isFavorite } = useContext(DataContext);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);

  // Определяем, является ли устройство мобильным
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full bg-gray-100 md:bg-white pt-4 px-3 md:px-0">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={LOGO}
              alt="logo"
              className="w-30 h-16 ml-[-10px]"
              onClick={() => (window.location.href = "/")}
            />
          </div>

          {/* Кнопка избранного */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end ">
              <a
                href="https://go.2gis.com/Q6U4a"
                className="text-sm text-gray-500 items-center gap-1 hidden md:flex"
              >
                <FaMapMarkerAlt size={16} />
                ул. Жоомарта Боконбаева, 7
              </a>
              <a
                href="tel:+996701044445"
                className="text-sm text-gray-500 items-center gap-1 hidden md:flex"
              >
                <FaPhone size={14} className="rotate-90" />
                +996 701 044 445
              </a>
            </div>

            <button
              className="bg-green-500 hover:bg-green-600 duration-300 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              onClick={() =>
                window.open("https://wa.me/996701044445", "_blank")
              }
            >
              <FaWhatsapp size={18} />
              WhatsApp
            </button>

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

        {/* Модальное окно избранного для десктопа - рендерим только на десктопе */}
        {!isMobile && (
          <Modal
            isOpen={isFavoriteModalOpen}
            onOpenChange={() => setIsFavoriteModalOpen(false)}
            shouldBlockScroll={false}
            backdrop="opaque"
            classNames={{
              closeButton: "md:block hidden",
            }}
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
        )}

        {/* Мобильное модальное окно избранного - рендерим только на мобильных */}
        {isMobile && (
          <Modal
            isOpen={isFavoriteModalOpen}
            onClose={() => setIsFavoriteModalOpen(false)}
            placement="bottom"
            backdrop="opaque"
            radius="sm"
            scrollBehavior="inside"
            isDismissable={true}
            shouldBlockScroll={true}
            className="!p-0 !m-0 !max-w-full"
            hideCloseButton={true}
            shadow="none"
            classNames={{
              backdrop: "bg-black/30",
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
        )}
      </div>
    </div>
  );
}
