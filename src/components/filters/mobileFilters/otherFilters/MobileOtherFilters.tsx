import { useState, useContext, useMemo } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import MobileHotelType from "./MobileHotelType";
import MobileNourishment from "./MobileNourishment";
import MobileRaiting from "./MobileRaiting";
import MobileHotelService from "./MobileHotelService";
import { DataContext } from "../../../DataProvider";
import arrowIcon from "../../../../assets/arrow.svg"; // Добавляем импорт

export default function MobileOtherFilters() {
  const { params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const activeFilters = useMemo(
    () => ({
      stars: params.param9 && params.param9 !== 1,
      hotelType:
        params.param6 &&
        params.param6.length > 0 &&
        !params.param6.includes("any"),
      nourishment: params.param7 && params.param7.length > 0,
      rating: params.param8 && params.param8 !== "0",
      hotelService: params.param10 && params.param10.length > 0,
    }),
    [params]
  );

  const totalActiveFilters =
    Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      <button
        className="w-full flex justify-between items-center py-3"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-lg font-medium text-[#6B7280]">
          Дополнительные фильтры
        </span>
        <img
          src={arrowIcon}
          alt="expand"
          className={`w-6 h-6 transition-transform ${
            isOpen ? "-rotate-90" : "rotate-90"
          }`}
          style={{
            filter:
              "invert(48%) sepia(85%) saturate(2727%) hue-rotate(346deg) brightness(101%) contrast(101%)",
          }}
        />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="!p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
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
          <div className="absolute bottom-0 w-full">
            <div className="bg-white w-full rounded-t-[10px]">
              {/* Header */}
              <div className="flex justify-between px-3 py-2 items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-lg font-medium text-[#6B7280]">
                  Дополнительные фильтры
                </h2>
                <button onClick={() => setIsOpen(false)}>
                  <img
                    src={arrowIcon}
                    alt="expand"
                    className={`w-6 h-6 transition-transform ${
                      isOpen ? "-rotate-90" : "rotate-90"
                    }`}
                    style={{
                      filter:
                        "invert(48%) sepia(85%) saturate(2727%) hue-rotate(346deg) brightness(101%) contrast(101%)",
                    }}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="px-3 py-2">
                <div className="flex flex-col items-start w-full">
                  <div className="w-full">
                    <MobileHotelType />
                  </div>

                  <div className="w-full">
                    <MobileNourishment />
                  </div>

                  <div className="w-full">
                    <MobileRaiting />
                  </div>

                  <div className="w-full">
                    <MobileHotelService />
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="px-3 py-5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-6 border border-[#FF621F] bg-[#FF621F] rounded-[10px] text-lg text-white"
                >
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
