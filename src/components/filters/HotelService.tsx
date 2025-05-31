import React, { useState, useContext } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from "@heroui/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { DataContext } from "../DataProvider";
import service from "../data/HotelServiceData";

export default function HotelService() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(
    () => params.param10 || []
  );
  const [activeTab, setActiveTab] = useState<"all" | "selected">("all");

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
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    setData("param10", selectedValues);
    setIsOpen(false); // Закрываем Popover после выбора
  };

  const handleReset = () => {
    setSelectedValues([]);
    setData("param10", []);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 1) {
      const serviceName = getServiceNameById(selectedValues[0]);
      const truncatedServiceName =
        serviceName.length > 16
          ? serviceName.slice(0, 16) + "..."
          : serviceName;

      return (
        <div className="flex flex-col items-start">
          <h1 className="sigma-sigma-boy text-sm">Услуги отеля</h1>
          <div className="text-base">
            <p>{truncatedServiceName}</p>
          </div>
        </div>
      );
    } else if (selectedValues.length > 1) {
      return (
        <div className="flex flex-col items-start">
          <h1 className="sigma-sigma-boy text-sm">Услуги отеля</h1>
          <div className="text-base">
            <p className="">Выбрано {`(${selectedValues.length})`}</p>
          </div>
        </div>
      );
    } else {
      return <>Услуги отеля</>;
    }
  };

  const filteredCheckboxes =
    activeTab === "selected"
      ? checkboxes
          .map(({ group, options }) => ({
            group,
            options: options.filter((option) =>
              selectedValues.includes(option.value)
            ),
          }))
          .filter(({ options }) => options.length > 0)
      : checkboxes;

  return (
    <Popover
      placement="bottom"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100 w-[20%]">
        <Button
          className="px-4 bg-blue-600 rounded-lg border border-slate-300"
          size="lg"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-white">{getDisplayText()}</h1>
            </div>
            {selectedValues.length === 0 ? (
              <IoIosArrowDown
                className={`text-xl text-white transform transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="text-white"
              >
                <IoClose className="text-xl" />
              </button>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="rounded-md">
        <div className="px-3 pt-3 w-72">
          <h1 className="text-base font-medium mb-2">Услуги в отеле</h1>

          <div className="flex border-b mb-2 gap-1">
            <button
              className={`text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1 ${
                activeTab === "all" ? "border-b-2 border-black mb-0" : ""
              }`}
              onClick={() => setActiveTab("all")}
            >
              ВСЕ
            </button>
            {selectedValues.length >= 1 && (
              <button
                className={`text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1 ${
                  activeTab === "selected" ? "border-b-2 border-black mb-0" : ""
                }`}
                onClick={() => setActiveTab("selected")}
              >
                ВЫБРАНО
                <div className="bg-slate-600 rounded-full h-4 px-2 inline-flex items-center ml-1">
                  <p className="text-xs text-white">{selectedValues.length}</p>
                </div>
              </button>
            )}
            {selectedValues.length >= 1 && (
              <button
                className="text-gray-800 text-xs font-medium px-1 mb-[-1px] pb-1"
                onClick={handleReset}
              >
                СБРОС
              </button>
            )}
          </div>

          <div className="h-64 overflow-auto scrollbar-custom2">
            {filteredCheckboxes.map(({ group, options }) => (
              <div key={group} className="mb-3">
                <h1 className="text-base font-medium mb-1">{group}</h1>
                <div className="flex flex-col gap-1">
                  {options.map(({ value, label }) => (
                    <Checkbox
                      color="default"
                      size="sm"
                      key={value}
                      value={value}
                      isSelected={selectedValues.includes(value)}
                      onValueChange={() => handleChange(value)}
                    >
                      <p className="text-sm text-black"> {label}</p>
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 flex items-center justify-center">
            <button
              onClick={handleApply}
              className={`px-14 py-2 border-2 text-lg rounded-full ${
                selectedValues.length >= 1
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "text-gray-500"
              }`}
            >
              Выбрать
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
