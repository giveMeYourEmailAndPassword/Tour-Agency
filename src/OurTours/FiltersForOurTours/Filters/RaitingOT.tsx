import React, { useState, useContext } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from "@heroui/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5"; // Значок "крестик" для сброса
import { DataContext } from "../../../components/DataProvider";

export default function NourishmentOTT() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Определяем список чекбоксов
  const checkboxes = [
    { value: "0", label: "Любой", span: "" },
    { value: "2", label: "и более", span: "3,0" },
    { value: "3", label: "и более", span: "3,5" },
    { value: "4", label: "и более", span: "4,0" },
    { value: "5", label: "и более", span: "4,5" },
  ];

  // Состояние для выбранного значения. По умолчанию выбран "Любой".
  const [selectedValue, setSelectedValue] = useState<string>("0");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    setData("param8", [value]); // Передаем значение как массив
  };

  // Функция для получения ярлыка (label) по значению чекбокса
  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  // Функция для формирования текста, который показывается на кнопке
  const getDisplayText = () => {
    const selectedCheckbox = checkboxes.find((c) => c.value === selectedValue);

    if (getLabelByValue(selectedValue) === "Любой") {
      return (
        <div>
          <h1 className="text-base">Рейтинг</h1>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <h1 className="sigma-sigma-boy">Рейтинг</h1>
          <div className="text-base">
            <p className="">
              <span className="font-medium">{selectedCheckbox?.span}</span> и
              более
            </p>
          </div>
        </div>
      );
    }
  };

  // Обработчик нажатия на крестик — сбрасываем выбор, возвращая "Любое"
  const handleReset = () => {
    setSelectedValue("0");
    setData("param7", ["0"]); // Сбрасываем значение в DataContext
  };

  return (
    <Popover placement="bottom" onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100 w-[15%] ">
        <Button
          className="px-4 bg-blue-600 rounded-lg border border-slate-300"
          size="lg"
        >
          <div className="flex items-center justify-between w-full">
            {/* Блок с текстом выбранного варианта */}
            <div className="flex items-center gap-2">
              <h1 className="text-sm text-white">{getDisplayText()}</h1>
            </div>
            {/* Стрелка, указывающая на возможность открытия поповера */}
            {selectedValue === "0" ? (
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
        <div className="px-1 py-1">
          <div className="flex flex-col gap-1 w-40">
            <h1 className="text-small font-semibold mb-2">РЕЙТИНГ</h1>
            {checkboxes.map(({ value, label, span }) => (
              <Checkbox
                color="default"
                key={value}
                value={value}
                // Выбран ли чекбокс (если его значение равно выбранному значению)
                isSelected={selectedValue === value}
                // При изменении состояния чекбокса вызывается handleChange
                onValueChange={() => handleChange(value)}
              >
                <span className="font-medium">{span} </span>
                {label}
              </Checkbox>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
