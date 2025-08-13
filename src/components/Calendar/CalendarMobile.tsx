import { useState } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  getDay,
} from "date-fns";
import { ru } from "date-fns/locale";
import arrow from "../../assets/arrow.svg";

interface CalendarMobileProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onDateSelect: (start: Date | null, end: Date | null) => void;
  minDate?: Date;
}

export default function CalendarMobile({
  selectedStartDate,
  selectedEndDate,
  onDateSelect,
  minDate = new Date(),
}: CalendarMobileProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Получаем все дни текущего месяца
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Получаем дни предыдущего месяца для заполнения первой недели
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth);
  const prevMonthDays = Array.from(
    { length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 },
    (_, i) =>
      addDays(
        firstDayOfMonth,
        -(startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1) + i
      )
  );

  // Получаем дни следующего месяца для заполнения последней недели
  const lastDayOfMonth = endOfMonth(currentMonth);
  const endingDayOfWeek = getDay(lastDayOfMonth);
  const nextMonthDays = Array.from(
    { length: endingDayOfWeek === 0 ? 0 : 7 - endingDayOfWeek },
    (_, i) => addDays(lastDayOfMonth, i + 1)
  );

  // Все дни для отображения в календаре
  const allDays = [...prevMonthDays, ...days, ...nextMonthDays];

  // Названия дней недели
  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  const isInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const handleDateClick = (date: Date) => {
    if (date < minDate) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      onDateSelect(date, null);
    } else {
      if (date < selectedStartDate) {
        onDateSelect(date, selectedStartDate);
      } else {
        onDateSelect(selectedStartDate, date);
      }
    }
  };

  // Добавим функцию для определения цвета текста
  const getTextColor = (
    isCurrentMonth: boolean,
    isWeekend: boolean,
    isSelected: boolean,
    isPastDate: boolean
  ) => {
    if (isSelected) return "text-white";
    if (isPastDate) return "text-[#A1A1AA]";
    if (!isCurrentMonth) return "text-[#A1A1AA]"; // Все дни не текущего месяца серые
    if (isWeekend) return "text-[#FF621F]"; // Выходные текущего месяца оранжевые
    return "text-[#2E2E32]"; // Будни текущего месяца
  };

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
          className="p-2 text-[#2E2E32] hover:bg-[#EFF2F6] rounded-lg"
        >
          <img
            src={arrow}
            alt="Previous month"
            className="w-6 h-6 rotate-180"
          />
        </button>
        <h2 className="text-lg font-medium text-[#2E2E32] capitalize">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </h2>
        <button
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="p-2 text-[#2E2E32] hover:bg-[#EFF2F6] rounded-lg"
        >
          <img src={arrow} alt="Next month" className="w-6 h-6" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[2px] mx-auto">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm text-[#6B7280] py-2 font-medium"
          >
            {day}
          </div>
        ))}
        {allDays.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected =
            (selectedStartDate && isSameDay(date, selectedStartDate)) ||
            (selectedEndDate && isSameDay(date, selectedEndDate));
          const isRangeDate = isInRange(date);
          const isPastDate = date < minDate;
          const isWeekend = [0, 6].includes(getDay(date));

          return (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => handleDateClick(date)}
                disabled={isPastDate}
                className={`
                  py-1 text-sm font-medium rounded-lg transition-colors w-full flex flex-col items-center h-[50px]
                  ${getTextColor(
                    isCurrentMonth,
                    isWeekend,
                    isSelected,
                    isPastDate
                  )}
                  ${isSelected ? "bg-[#FF621F] hover:bg-[#FF621F]" : ""}
                  ${isRangeDate && !isSelected ? "bg-[#FFF1EC]" : ""}
                  ${!isPastDate ? "hover:bg-[#EFF2F6]" : "cursor-not-allowed"}
                `}
              >
                <span>{format(date, "d")}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
