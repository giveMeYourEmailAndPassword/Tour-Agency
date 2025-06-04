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
import { FaSearch } from "react-icons/fa";
import service from "../../../data/HotelServiceData";
import { IoIosArrowDown } from "react-icons/io";

export default function MobileHotelService() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedValues = params.param10 || [];

  // Группировка сервисов
  const groupedServices = service.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  const checkboxes = Object.keys(groupedServices).map((group) => ({
    group,
    options: groupedServices[group].map((service) => ({
      label: service.name,
      value: service.id,
    })),
  }));

  const getServiceNameById = (id: string) => {
    const serviceItem = service.find((item) => item.id === id);
    return serviceItem ? serviceItem.name : "";
  };

  const handleChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setData("param10", newValues);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleReset = () => {
    setData("param10", []);
    setSearchQuery("");
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return (
        <span className="text-black text-base font-normal">Услуги отеля</span>
      );
    } else if (selectedValues.length === 1) {
      const serviceName = getServiceNameById(selectedValues[0]);
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 mb-[1px] text-xs">Услуги отеля</span>
          <span className="text-black text-base">{serviceName}</span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <span className="text-slate-600 mb-[1px] text-xs">Услуги отеля</span>
          <span className="text-black text-base">
            Выбрано ({selectedValues.length})
          </span>
        </div>
      );
    }
  };

  // Фильтрация сервисов по поиску и активной вкладке
  const filteredCheckboxes = checkboxes
    .map(({ group, options }) => ({
      group,
      options: options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (activeTab === "all" || selectedValues.includes(option.value))
      ),
    }))
    .filter(({ options }) => options.length > 0);

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
        onClose={() => {
          setIsOpen(false);
          setSearchQuery("");
        }}
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
            <h2 className="text-lg font-medium">Выберите услуги</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3 flex flex-col h-full">
            <div className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по услугам"
                className="w-full pl-8 pr-8 py-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-base"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <RxCross2 className="text-lg" />
                </button>
              )}
            </div>

            <div className="flex border-b gap-1">
              <button
                className={`text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1 ${
                  activeTab === "all" ? "border-b-2 border-black mb-0" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                ВСЕ
              </button>
              {selectedValues.length > 0 && (
                <>
                  <button
                    className={`text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1 ${
                      activeTab === "selected"
                        ? "border-b-2 border-black mb-0"
                        : ""
                    }`}
                    onClick={() => setActiveTab("selected")}
                  >
                    ВЫБРАНО
                    <div className="bg-slate-600 rounded-full h-4 px-2 inline-flex items-center ml-1">
                      <p className="text-xs text-white">
                        {selectedValues.length}
                      </p>
                    </div>
                  </button>
                  <button
                    className="text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1"
                    onClick={handleReset}
                  >
                    СБРОС
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom2">
              {filteredCheckboxes.map(({ group, options }) => (
                <div key={group} className="mb-4">
                  <h3 className="text-base font-medium mb-2">{group}</h3>
                  <div className="flex flex-col gap-2">
                    {options.map(({ value, label }) => (
                      <Checkbox
                        key={value}
                        color="default"
                        value={value}
                        isSelected={selectedValues.includes(value)}
                        onValueChange={() => handleChange(value)}
                        className="w-full"
                      >
                        {label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white">
              <Button
                className="w-full text-base rounded-full bg-blue-500 text-white hover:bg-blue-700"
                onPress={handleConfirm}
              >
                Применить
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
