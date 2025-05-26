import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import MobileStarsFilter from "./MobileStarsFilter";
import MobileHotelType from "./MobileHotelType";
import MobileNourishment from "./MobileNourishment";
import MobileRaiting from "./MobileRaiting";
import MobileHotelService from "./MobileHotelService";

export default function MobileOtherFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    stars: false,
    hotelType: false,
    nourishment: false,
    rating: false,
    hotelService: false,
  });

  const totalActiveFilters =
    Object.values(activeFilters).filter(Boolean).length;

  const handleStarsFilterChange = (isActive: boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      stars: isActive,
    }));
  };

  const handleConfirm = () => {
    setIsOpen(false);
    // Здесь будет логика применения фильтров
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        radius="none"
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-br-md !z-0 !scale-100 !opacity-100 py-1"
      >
        <div className="flex flex-col items-start justify-between w-full">
          <span className="text-slate-600 mb-[1px] text-xs md:text-sm">
            Дополнительно
          </span>
          <div className="flex items-center justify-between w-full">
            <p className="text-black text-base md:text-lg font-medium">
              Фильтры
            </p>
            {totalActiveFilters > 0 && (
              <div className="text-white text-sm font-medium mr-2 bg-orange-500 rounded-full h-5 w-5 flex items-center justify-center">
                {totalActiveFilters}
              </div>
            )}
          </div>
        </div>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="!p-0 !m-0 !max-w-full flex flex-col z-40 fixed inset-0 overflow-hidden"
        hideCloseButton={true}
        shadow="none"
        size="full"
        motionProps={{
          variants: {
            enter: { opacity: 1, y: 0, transition: { duration: 0 } },
            exit: { opacity: 0, y: 0, transition: { duration: 0 } },
          },
        }}
      >
        <ModalContent className="flex flex-col h-screen overflow-auto">
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Дополнительные фильтры</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="px-3 py-2 flex-1">
            <div className="flex flex-col items-start h-full w-full">
              <div className="border-b border-slate-200 w-full">
                <MobileStarsFilter onFilterChange={handleStarsFilterChange} />
              </div>

              <div className="border-b border-slate-200 w-full">
                <MobileHotelType />
              </div>

              <div className="border-b border-slate-200 w-full">
                <MobileNourishment />
              </div>

              <div className="border-b border-slate-200 w-full">
                <MobileRaiting />
              </div>

              <div className="border-b border-slate-200 w-full">
                <MobileHotelService />
              </div>
            </div>
          </ModalBody>

          <div className="p-4 mt-auto">
            <Button
              className="w-full text-base rounded-full bg-blue-500 text-white hover:bg-blue-700"
              onPress={handleConfirm}
            >
              Применить
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
