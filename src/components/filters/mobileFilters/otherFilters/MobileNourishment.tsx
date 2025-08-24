import { useContext, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Checkbox,
} from "@heroui/react";
import { RxCross2 } from "react-icons/rx";
import { DataContext } from "../../../DataProvider";
import { IoIosArrowDown } from "react-icons/io";

export default function MobileNourishment() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Определяем список чекбоксов
  const checkboxes = [
    { value: "2", label: "Любое", span: "" },
    { value: "3", label: "Только завтраки", span: "BB" },
    { value: "4", label: "Завтрак + ужин — без забот", span: "HB" },
    { value: "5", label: "Полный пансион — всё включено в день", span: "FB" },
    {
      value: "7",
      label: "All Inclusive – ешь и пей без ограничений",
      span: "AL",
    },
    {
      value: "9",
      label: "Ultra All Inclusive – максимум удовольствия",
      span: "UAL",
    },
  ];

  const selectedValue = params.param7?.[0] || "2";

  const handleChange = (value: string) => {
    setData("param7", [value]);
  };

  const getDisplayText = () => {
    const selectedCheckbox = checkboxes.find((c) => c.value === selectedValue);

    if (selectedCheckbox?.value === "2") {
      return (
        <span className="text-black text-lg font-normal">
          Как будем кушать?
        </span>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 text-sm">Как будем кушать?</span>
          <span className="text-black text-lg">
            <span className="font-medium">{selectedCheckbox?.span}</span> и
            лучше
          </span>
        </div>
      );
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
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
                  Выберите тип питания
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
                  {checkboxes.map(({ value, label, span }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleChange(value)}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          selectedValue === value
                            ? "bg-[#FF621F] border-[#FF621F]"
                            : "border-[#7E8389]"
                        }`}
                      >
                        {selectedValue === value && (
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
                        {span && <span className="font-medium">{span} </span>}
                        {label}
                      </span>
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
