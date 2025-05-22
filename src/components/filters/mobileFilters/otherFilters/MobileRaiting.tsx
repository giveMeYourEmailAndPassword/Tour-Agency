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

export default function MobileRaiting() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const checkboxes = [
    { value: "0", label: "Любой", span: "" },
    { value: "2", label: "и более", span: "3,0" },
    { value: "3", label: "и более", span: "3,5" },
    { value: "4", label: "и более", span: "4,0" },
    { value: "5", label: "и более", span: "4,5" },
  ];

  const [selectedValue, setSelectedValue] = useState<string>("0");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    setData("param8", [value]);
  };

  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  const getDisplayText = () => {
    const selectedCheckbox = checkboxes.find((c) => c.value === selectedValue);

    if (selectedCheckbox?.value === "0") {
      return <p className="text-black text-base font-normal">Рейтинг</p>;
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 mb-[1px] text-xs">Рейтинг</span>
          <p className="text-black text-base">
            <span className="font-medium">{selectedCheckbox?.span}</span> и
            более
          </p>
        </div>
      );
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    setData("param8", [selectedValue]);
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
            <h2 className="text-lg font-medium">Выберите рейтинг отеля</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="px-3 py-4">
            <div className="flex flex-col gap-4">
              {checkboxes.map(({ value, label, span }) => (
                <Checkbox
                  key={value}
                  color="default"
                  value={value}
                  isSelected={selectedValue === value}
                  onValueChange={() => handleChange(value)}
                  className="w-full"
                >
                  {span && <span className="font-medium">{span} </span>}
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
