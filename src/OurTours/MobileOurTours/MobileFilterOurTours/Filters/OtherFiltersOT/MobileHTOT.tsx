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
import { DataContext } from "../../../../../components/DataProvider";
import { IoIosArrowDown } from "react-icons/io";

interface MobileHotelTypeOTProps {
  onFilterChange?: (isActive: boolean) => void;
}

export default function MobileHotelTypeOT({
  onFilterChange,
}: MobileHotelTypeOTProps) {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const checkboxes = [
    { value: "any", label: "Любой" },
    { value: "hotel", label: "Отель" },
    { value: "guesthouse", label: "Гостевой дом" },
    { value: "apartments", label: "Апартаменты" },
    { value: "villa", label: "Вилла" },
  ];

  const selectedValues = params?.param6 || ["any"];

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

    if (onFilterChange) {
      onFilterChange(!newSelectedValues.includes("any"));
    }
  };

  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  const getDisplayText = () => {
    if (selectedValues.includes("any") || selectedValues.length === 0) {
      return <p className="text-black text-base font-normal">Тип отеля</p>;
    } else if (selectedValues.length === 1) {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 mb-[1px] text-xs">Тип отеля</span>
          <p className="text-black text-base">
            {getLabelByValue(selectedValues[0])}
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 mb-[1px] text-xs">Тип отеля</span>
          <p className="text-black text-base">
            {`Выбрано (${selectedValues.length})`}
          </p>
        </div>
      );
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        radius="none"
        className="px-2 w-full h-12 md:h-full bg-white hover:bg-slate-100
         !z-0 !scale-100 !opacity-100 py-1 flex items-center justify-between"
      >
        <div className="flex flex-col items-start justify-between w-full px-2">
          {getDisplayText()}
        </div>
        <IoIosArrowDown className="text-xl -rotate-90" />
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
        className="h-[590px] !p-0 !m-0 !max-w-full flex flex-col"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent className="flex flex-col">
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите тип отеля</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="px-3 py-4">
            <div className="flex flex-col gap-4">
              {checkboxes.map(({ value, label }) => (
                <Checkbox
                  key={value}
                  color="default"
                  value={value}
                  isSelected={selectedValues.includes(value)}
                  onValueChange={(isSelected) =>
                    handleChange(isSelected, value)
                  }
                  className="w-full"
                >
                  {label}
                </Checkbox>
              ))}
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
