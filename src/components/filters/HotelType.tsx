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
import { DataContext } from "../DataProvider";

export default function HotelType() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Определяем список чекбоксов
  const checkboxes = [
    { value: "any", label: "Любой" },
    { value: "hotel", label: "Отель" },
    { value: "guesthouse", label: "Гостевой дом" },
    { value: "apartments", label: "Апартаменты" },
    { value: "villa", label: "Вилла" },
  ];

  // Состояние для выбранных значений. По умолчанию выбран "Любой".
  const [selectedValues, setSelectedValues] = useState<string[]>(["any"]);

  const handleChange = (isSelected: boolean, value: string) => {
    let newSelectedValues = [...selectedValues];

    if (value === "any") {
      // Если выбирается "Любой", то он единственный в списке.
      newSelectedValues = isSelected ? ["any"] : ["any"];
    } else {
      // Если выбирается другой чекбокс, удаляем "any" (если он был выбран)
      newSelectedValues = newSelectedValues.filter((v) => v !== "any");

      if (isSelected) {
        // Добавляем значение, если его ещё нет
        if (!newSelectedValues.includes(value)) {
          newSelectedValues.push(value);
        }
      } else {
        // Убираем значение, если оно было выбрано
        newSelectedValues = newSelectedValues.filter((v) => v !== value);
      }

      // Если выбраны все доступные значения (кроме "any"), то автоматически возвращаем "any"
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

    "Выбраны:", newSelectedValues;
    setSelectedValues(newSelectedValues);

    setData("param6", newSelectedValues);
  };

  // Функция для получения ярлыка (label) по значению чекбокса
  const getLabelByValue = (value: string) => {
    const checkbox = checkboxes.find((c) => c.value === value);
    return checkbox ? checkbox.label : "";
  };

  // Функция для формирования текста, который показывается на кнопке
  const getDisplayText = () => {
    // Если выбран "any" или ничего не выбрано — показываем базовый текст
    if (selectedValues.includes("any") || selectedValues.length === 0) {
      return (
        <>
          <h1 className="text-base">Курорт / отели</h1>
        </>
      );
    } else if (selectedValues.length === 1) {
      // Если выбран один тип (и это не "any")
      return (
        <div className="flex flex-col items-start">
          <h1>Курорт / отели</h1>
          <div className="text-base">{getLabelByValue(selectedValues[0])}</div>
        </div>
      );
    } else if (selectedValues.length > 1) {
      // Если выбрано 2 и более типа, выводим количество
      return (
        <>
          <div className="flex flex-col items-start">
            <h1>Курорт / отели</h1>
            <div className="text-base">{`Типов отелей (${selectedValues.length})`}</div>
          </div>
        </>
      );
    }
    return "Курорт / отель";
  };

  // Обработчик нажатия на крестик — сбрасываем выбор, возвращая "any"
  const handleReset = () => {
    setSelectedValues(["any"]);
  };

  selectedValues;

  return (
    <Popover placement="bottom" onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100 w-[20%]">
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
            {selectedValues.includes("any") ? (
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
        <div className="px-1 py-1 w-48">
          <div className="flex flex-col gap-1">
            <h1 className="text-small font-semibold mb-2">ТИП ОТЕЛЯ / ТУРА</h1>
            {checkboxes.map(({ value, label }) => (
              <Checkbox
                color="default"
                key={value}
                value={value}
                // Выбран ли чекбокс (если в списке выбранных значений содержится его value)
                isSelected={selectedValues.includes(value)}
                // При изменении состояния чекбокса вызывается handleChange
                onValueChange={(isSelected) => handleChange(isSelected, value)}
                // Если выбран "any", то остальные чекбоксы делаем неактивными
              >
                {label}
              </Checkbox>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
