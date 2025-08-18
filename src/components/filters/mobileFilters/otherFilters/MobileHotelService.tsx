import React, { useState, useContext, useMemo } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { DataContext } from "../../../DataProvider";
import { IoIosArrowDown } from "react-icons/io";
import service from "../../../data/HotelServiceData";

// Группируем услуги по категориям
const GROUPED_SERVICES = service.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof service>);

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => (
  <div className="flex items-center px-2 py-1 rounded-lg bg-[#FDDEC2]">
    <span className="text-lg text-[#2E2E32]">{label}</span>
    <button onClick={onRemove} className="text-[#2E2E32] text-lg">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4L12 12M4 12L12 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
);

export default function MobileHotelService() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    () => params.param10 || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newServices = prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId];

      setData("param10", newServices);
      return newServices;
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  // Обновленная функция для отображения текста
  const getDisplayText = (category: string, selectedCount: number) => {
    if (selectedCount === 0) {
      return <span className="text-black text-lg font-normal">{category}</span>;
    } else if (selectedCount === 1) {
      // Находим единственную выбранную услугу
      const selectedService = GROUPED_SERVICES[category].find((service) =>
        selectedServices.includes(service.id)
      );
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 text-sm">{category}</span>
          <span className="text-black text-lg">{selectedService?.name}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 text-sm">{category}</span>
          <span className="text-black text-lg">Выбрано ({selectedCount})</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Кнопки категорий */}
      <div className="flex flex-col">
        {Object.entries(GROUPED_SERVICES).map(([category, services]) => {
          const selectedCount = services.filter((service) =>
            selectedServices.includes(service.id)
          ).length;

          return (
            <div
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="px-2 w-full h-12 bg-white !z-0 !scale-100 !opacity-100 py-1 flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col items-start justify-between w-full px-2">
                {getDisplayText(category, selectedCount)}
              </div>
              <IoIosArrowDown className="text-xl -rotate-90" />
            </div>
          );
        })}
      </div>

      {/* Модальное окно */}
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
              <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-[20px] font-medium text-[#2E2E32]">
                  {selectedCategory}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 pb-0">
                {selectedCategory && GROUPED_SERVICES[selectedCategory] && (
                  <div className="flex flex-col gap-4">
                    {GROUPED_SERVICES[selectedCategory].map((service) => (
                      <label
                        key={service.id}
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => toggleService(service.id)}
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedServices.includes(service.id)
                              ? "bg-[#FF621F] border-[#FF621F]"
                              : "border-[#7E8389]"
                          }`}
                        >
                          {selectedServices.includes(service.id) && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 8L6.5 11.5L13 5"
                                stroke="white"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-lg text-[#2E2E32]">
                          {service.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Button */}
              <div className="px-3 p-5">
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
