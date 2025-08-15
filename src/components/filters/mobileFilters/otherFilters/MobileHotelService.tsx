import React, { useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { DataContext } from "../../../DataProvider";
import { IoIosArrowDown } from "react-icons/io";

// Те же категории, что и в HotelService
const CATEGORIES = {
  "Услуги отеля": [], // Пустой массив, так как это заголовок для выбранных услуг
  "Для детей": [
    "Водные горки",
    "Детское меню",
    "Мини-клуб",
    "Детская анимация",
    "Детская площадка",
  ],
  Номер: [
    "Кухня в номере",
    "Балкон в номере",
    "Wi-Fi в номере",
    "Кондиционер",
    "Размещение с животными",
  ],
  Пляж: ["Первая линия", "Собственный пляж", "Песчаный пляж", "Галечный пляж"],
  Территория: [
    "Бассейн",
    "Бассейн с подогревом",
    "Водные горки",
    "СПА-центр",
    "Ресторан/кафе",
    "Спортзал",
    "Теннис",
    "Футбол",
    "Новый отель",
  ],
  Услуги: [
    "Анимация",
    "Дискотека",
    "Wi-Fi",
    "Размещение одиноких мужчин",
    "Только для взрослых",
  ],
  "Тип отеля": ["Активный", "Городской", "Семейный", "VIP"],
};

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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const newServices = prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service];

      setData("param10", newServices);
      return newServices;
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setExpandedSections([category]);
    setIsOpen(true);
  };

  return (
    <>
      {/* Кнопки категорий */}
      <div className="flex flex-col">
        {Object.entries(CATEGORIES).map(([category, services]) => {
          if (category === "Услуги отеля") return null;

          // Подсчитываем количество выбранных услуг в этой категории
          const selectedCount = services.filter((service) =>
            selectedServices.includes(service)
          ).length;

          return (
            <Button
              key={category}
              onPress={() => handleCategoryClick(category)}
              radius="none"
              className="px-2 w-full h-12 bg-white hover:bg-slate-100
               !z-0 !scale-100 !opacity-100"
            >
              <div className="flex flex-col items-start justify-between w-full px-2">
                {selectedCount > 0 ? (
                  <div className="flex flex-col items-start">
                    <span className="text-slate-600 text-sm">{category}</span>
                    <span className="text-black text-lg">
                      Выбрано ({selectedCount})
                    </span>
                  </div>
                ) : (
                  <span className="text-black text-lg font-normal">
                    {category}
                  </span>
                )}
              </div>
              <IoIosArrowDown className="text-xl -rotate-90" />
            </Button>
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
        className="h-[85vh] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">{selectedCategory}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3">
            {selectedCategory && CATEGORIES[selectedCategory] && (
              <div className="flex flex-col gap-0.5">
                {CATEGORIES[selectedCategory].map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedServices.includes(service)
                          ? "bg-[#FF621F] border-[#FF621F]"
                          : "border-[#7E8389]"
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      {selectedServices.includes(service) && (
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.33301 4L3.99967 6.66667L9.33301 1.33334"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-lg text-[#2E2E32]">{service}</span>
                  </label>
                ))}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
