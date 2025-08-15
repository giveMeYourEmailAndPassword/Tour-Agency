import { useContext, useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { DataContext } from "../../../DataProvider";
import { IoIosArrowDown } from "react-icons/io";

export default function MobileHotelType() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Определяем список чекбоксов
  const checkboxes = [
    { value: "any", label: "Любой" },
    { value: "hotel", label: "Отель" },
    { value: "guesthouse", label: "Гостевой дом" },
    { value: "apartments", label: "Апартаменты" },
    { value: "villa", label: "Вилла" },
  ];

  const selectedValues = params.param6 || ["any"];

  const handleChange = (isSelected: boolean, value: string) => {
    let newSelectedValues = [...selectedValues];

    if (value === "any") {
      newSelectedValues = isSelected ? ["any"] : ["any"];
    } else {
      newSelectedValues = newSelectedValues.filter((v) => v !== "any");

      if (isSelected) {
        if (!newSelectedValues.includes(value)) {
          newSelectedValues.push(value);
        }
      } else {
        newSelectedValues = newSelectedValues.filter((v) => v !== value);
      }

      const allNonAny = checkboxes
        .filter((c) => c.value !== "any")
        .map((c) => c.value);
      if (allNonAny.every((val) => newSelectedValues.includes(val))) {
        newSelectedValues = ["any"];
      }

      if (newSelectedValues.length === 0) {
        newSelectedValues = ["any"];
      }
    }

    setData("param6", newSelectedValues);
  };

  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  const getDisplayText = () => {
    if (selectedValues.includes("any") || selectedValues.length === 0) {
      return <span className="text-black text-lg font-normal">Тип отеля</span>;
    } else if (selectedValues.length === 1) {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 text-sm">Тип отеля</span>
          <span className="text-black text-lg">
            {getLabelByValue(selectedValues[0])}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 text-sm">Тип отеля</span>
          <span className="text-black text-lg">
            {`Выбрано (${selectedValues.length})`}
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="px-2 w-full h-12 md:h-full bg-white
         !z-0 !scale-100 !opacity-100 py-1 flex items-center justify-between cursor-pointer"
      >
        <div className="flex flex-col items-start justify-between w-full px-2">
          {getDisplayText()}
        </div>
        <IoIosArrowDown className="text-xl -rotate-90" />
      </div>

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
                  Выберите тип отеля
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
                <div className="flex flex-col gap-4">
                  {checkboxes.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleChange(true, value)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedValues.includes(value)
                            ? "bg-[#FF621F] border-[#FF621F]"
                            : "border-[#7E8389]"
                        }`}
                      >
                        {selectedValues.includes(value) && (
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
                      <span className="text-lg text-[#2E2E32]">{label}</span>
                    </label>
                  ))}
                </div>
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
