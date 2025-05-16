import { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { RangeCalendar } from "@heroui/react";
import { DataContext } from "../DataProvider";
import { parseDate } from "@internationalized/date";

export default function NightsFrom() {
  const { setData } = useContext(DataContext);

  // Используем объекты из @internationalized/date для начального состояния
  const [range, setRange] = useState({
    start: parseDate("2023-10-06"), // Начальная дата: 1 октября 2023
    end: parseDate("2023-10-14"), // Конечная дата: 6 октября 2023
  });

  // Обработчик изменения диапазона
  const handleRangeChange = (value: { start: any; end: any }) => {
    "Полученные данные из RangeCalendar:", value;
    setRange(value);

    if (value.start && value.end) {
      // Прямо извлекаем день из start и end
      const startDay = value.start.day;
      const endDay = value.end.day;

      setData("param3", { startDay, endDay }); // Передаем в params3
    }
  };

  useEffect(() => {
    setData("param3", { startDay: range.start.day, endDay: range.end.day }); // Передаем в params3
  }, []);

  // Используем useEffect для логирования текущего состояния
  useEffect(() => {
    "Начало:", range.start;
    "Конец:", range.end;
  }, [range]);

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button className="p-7 bg-white hover:bg-slate-100" size="lg">
          <div className="flex flex-col justify-between">
            <h1 className="text-sm mb-[1px] text-slate-600">Ночей</h1>
            <p className="text-black text-lg font-medium">
              {range.start && range.end
                ? `${range.start.day} - ${range.end.day}` // Отображаем дни
                : "6 - 14"}{" "}
              {/* Дефолтное значение, если range не задан */}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-1">
          <div className="text-base font-medium mb-2">Ночей от:</div>
          <RangeCalendar
            onChange={handleRangeChange}
            value={range} // Передаем текущее состояние в RangeCalendar
            classNames={{
              headerWrapper: "hidden",
              gridHeader: "hidden",
              gridWrapper: "border-none rounded-none",
              gridBody: "border-none rounded-none",
              base: "rounded-none shadow-none bg-white",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
