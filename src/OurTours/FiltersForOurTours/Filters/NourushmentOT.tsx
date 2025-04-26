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

export default function NourishmentOT() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Определяем список чекбоксов
  const checkboxes = [
    { value: "2", label: "Любое", span: "" },
    { value: "3", label: "- Только завтрак", span: "BB" },
    { value: "4", label: "- Завтрак, ужин", span: "HB" },
    { value: "5", label: "- Полный пансион", span: "FB" },
    { value: "7", label: "- Все включено", span: "AL" },
    { value: "9", label: "- Ультра все включено", span: "UAL" },
  ];

  // Состояние для выбранного значения. По умолчанию выбран "Любой".
  const [selectedValue, setSelectedValue] = useState<string>("2");

  const handleChange = (value: string) => {
    setSelectedValue(value);
    setData("param7", [value]); // Передаем значение как массив
  };

  // Функция для получения ярлыка (label) по значению чекбокса
  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  // Функция для формирования текста, который показывается на кнопке
  const getDisplayText = () => {
    const selectedCheckbox = checkboxes.find((c) => c.value === selectedValue);

    if (getLabelByValue(selectedValue) === "Любое") {
      return (
        <div>
          <h1 className="text-base">Питание</h1>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-start">
          <h1 className="sigma-sigma-boy">Питание</h1>
          <div className="text-base">
            <p className="">
              <span className="font-medium">{selectedCheckbox?.span}</span> и
              лучше
            </p>
          </div>
        </div>
      );
    }
  };

  // Обработчик нажатия на крестик — сбрасываем выбор, возвращая "Любое"
  const handleReset = () => {
    setSelectedValue("2");
    setData("param7", ["2"]); // Сбрасываем значение в DataContext
  };

  return (
    <Popover placement="bottom" onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100 w-[15%]">
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
            {selectedValue === "2" ? (
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
          <div className="flex flex-col gap-1">
            <h1 className="text-small font-semibold mb-2">ПИТАНИЕ ОТ:</h1>
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
