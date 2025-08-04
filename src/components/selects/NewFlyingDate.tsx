import { useContext, useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
} from "@heroui/react";
import { DataContext } from "../DataProvider";
import { format, addDays, addWeeks } from "date-fns";
import { ru } from "date-fns/locale";
import Calendar from "../Calendar/Calendar";
import calendar from "../../assets/calendar.svg";

export default function NewFlyingDate() {
  const { setData } = useContext(DataContext);
  const [flexibleDates, setFlexibleDates] = useState(false);

  // Инициализируем состояние с дефолтными значениями
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: addDays(new Date(), 1),
    end: addWeeks(new Date(), 1),
  });

  // Обработчик изменения диапазона
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });

    if (start && end) {
      // Форматируем даты для контекста
      const formattedStartDate = format(start, "dd.MM.yyyy");
      const formattedEndDate = format(end, "dd.MM.yyyy");

      // Передаем данные в контекст
      setData("param4", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        flexibleDates,
      });
    }
  };

  // Форматируем даты для отображения в кнопке
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "d MMMM", { locale: ru });
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button
          className="p-7 bg-white hover:bg-slate-100 border border-[#DBE0E5] rounded-lg"
          size="lg"
        >
          <img src={calendar} alt="calendar" className="w-6 h-6" />
          <div className="flex flex-col justify-between">
            <h1 className="text-sm mb-[1px] text-[#6B7280]">Даты вылета</h1>
            <p className="text-[#2E2E32] text-lg font-medium">
              {formatDisplayDate(dateRange.start)}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="rounded-lg border border-[#DBE0E5] bg-white">
          <div className="flex justify-between items-center px-5 py-2.5 bg-[#EFF2F6]">
            <div className="text-lg font-medium text-[#6B7280]">
              Дата начала тура
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-[#2E2E32]">
                ± 3 дня
              </span>
              <Switch
                checked={flexibleDates}
                onChange={(e) => setFlexibleDates(e.target.checked)}
                color="warning" // попробуем этот вариант
                classNames={{
                  base: "inline-flex items-center", // оставляем только базовое позиционирование
                  wrapper: "group-data-[selected=true]:!bg-[#FF621F]", // используем !important для переопределения
                }}
              />
            </div>
          </div>
          <div className="p-5">
            <Calendar
              selectedStartDate={dateRange.start}
              selectedEndDate={dateRange.end}
              onDateSelect={handleDateChange}
              minDate={new Date()}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
