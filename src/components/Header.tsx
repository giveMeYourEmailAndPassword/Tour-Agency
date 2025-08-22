import NewDepartureCity from "./selects/NewDepartureCity";
import NewFlyingCountry from "./selects/NewFlyingCountry";
import NightsFrom from "./selects/NightsFrom";
import StarsFilter from "./selects/StarsFilter";
import Tourists from "./selects/Tourists";
import FindTourBtn from "./selects/FindTour";
import NewFlyingDate from "./selects/NewFlyingDate";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import FavoriteModal from "./Favorite/FavoriteModal";
import { DataContext } from "./DataProvider";

interface HeaderProps {
  onSearch: () => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { favoriteTours, isFavorite } = useContext(DataContext);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1332px] mx-auto">
        {/* Мобильная версия */}
        <div className="md:hidden px-4 py-3">
          <h1 className="text-2xl font-semibold">Кругосвет</h1>
        </div>

        {/* Десктопная версия */}
        <div className="hidden md:flex items-center justify-between gap-2 px-6 py-4 w-full">
          <NewDepartureCity />
          <NewFlyingCountry />
          <NewFlyingDate />
          <NightsFrom />
          <StarsFilter />
          <Tourists />

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

          <FindTourBtn onSearch={onSearch} />
        </div>
      </div>

      {/* Модальное окно избранного */}
      <Modal
        isOpen={isFavoriteModalOpen}
        onOpenChange={() => setIsFavoriteModalOpen(false)}
        shouldBlockScroll={false}
        backdrop="opaque"
        classNames={{
          closeButton: "text-xl",
        }}
      >
        <ModalContent className="max-w-5xl max-h-[66vh] py-2 pr-2">
          <>
            <ModalHeader className="flex gap-1 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-medium">Избранные туры</span>
                {favoriteTours.length > 0 && (
                  <div className="flex items-center gap-1 bg-[#FF621F] py-0.5 px-4 rounded-full whitespace-nowrap">
                    <span className="font-semibold text-base text-white">
                      {favoriteTours.length}
                    </span>
                  </div>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="h-[60vh] overflow-y-auto scrollbar-custom">
              <FavoriteModal tours={favoriteTours} />
            </ModalBody>
            <ModalFooter />
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
