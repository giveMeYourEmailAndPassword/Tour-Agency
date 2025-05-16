import { useContext, useState, useEffect } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { RangeCalendar } from "@heroui/react";
import { DataContext } from "../DataProvider";
import { I18nProvider } from "@react-aria/i18n";
import { format } from "date-fns";
import { today, getLocalTimeZone } from "@internationalized/date";
import { ru } from "date-fns/locale"; // Локализация для русского языка

export default function NewFlyingDate() {
  const { setData } = useContext(DataContext);

  // Инициализируем состояние с дефолтными значениями
  const [range, setRange] = useState({
    start: today(getLocalTimeZone()).add({ days: 1 }),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  // Обработчик изменения диапазона
  const handleRangeChange = (value: { start: any; end: any }) => {
    if (value.start && value.end) {
      // Преобразуем даты в объекты Date
      const startDate = new Date(
        value.start.year,
        value.start.month - 1,
        value.start.day
      );
      const endDate = new Date(
        value.end.year,
        value.end.month - 1,
        value.end.day
      );

      // Обновляем локальное состояние
      setRange({ start: value.start, end: value.end });

      // Форматируем даты для контекста
      const formattedStartDate = format(startDate, "dd.MM.yyyy");
      const formattedEndDate = format(endDate, "dd.MM.yyyy");

      // Передаем данные в контекст
      setData("param4", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
  };

  useEffect(() => {
    const startDate = new Date(
      range.start.year,
      range.start.month - 1,
      range.start.day
    );
    const endDate = new Date(
      range.end.year,
      range.end.month - 1,
      range.end.day
    );

    // Форматируем даты для контекста
    const formattedStartDate = format(startDate, "dd.MM.yyyy");
    const formattedEndDate = format(endDate, "dd.MM.yyyy");

    // Передаем данные в контекст
    setData("param4", {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  }, []);

  // Форматируем даты для отображения в кнопке
  const formatDisplayDate = (date: any) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return format(jsDate, "d MMM", { locale: ru });
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button className="p-7 bg-white hover:bg-slate-100" size="lg">
          <div className="flex flex-col justify-between">
            <h1 className="text-sm mb-[1px] text-slate-600">Даты вылета</h1>
            <p className="text-black text-lg font-medium">
              {formatDisplayDate(range.start)} - {formatDisplayDate(range.end)}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-1">
          <div className="text-base font-medium mb-2">Даты вылета:</div>
          <I18nProvider locale="ru">
            <RangeCalendar
              onChange={handleRangeChange}
              classNames={{
                gridWrapper: "border-none rounded-none",
                gridBody: "border-none rounded-none",
                base: "rounded-none shadow-none bg-white",
              }}
              minValue={today(getLocalTimeZone())}
              value={range} // Используем текущее состояние для отображения в календаре
            />
          </I18nProvider>
        </div>
      </PopoverContent>
    </Popover>
  );
}
