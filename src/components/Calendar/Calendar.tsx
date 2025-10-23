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

interface CalendarPriceDay {
  date: string;
  price: number;
  operator: string;
}

interface CalendarMonth {
  days: CalendarPriceDay[];
}

interface CalendarProps {
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onDateSelect: (start: Date | null, end: Date | null) => void;
  minDate?: Date;
  prices?: {
    [key: string]: CalendarMonth;
  };
}

function SingleCalendar({
  currentMonth,
  selectedStartDate,
  selectedEndDate,
  onDateSelect,
  minDate,
  onHover,
  hoverDate,
  prices,
}: {
  currentMonth: Date;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate: Date;
  onHover: (date: Date) => void;
  hoverDate: Date | null;
  prices?: {
    [key: string]: CalendarMonth;
  };
}) {
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
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const isInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    if (selectedEndDate) {
      return date >= selectedStartDate && date <= selectedEndDate;
    }
    if (hoverDate) {
      return (
        (date >= selectedStartDate && date <= hoverDate) ||
        (date >= hoverDate && date <= selectedStartDate)
      );
    }
    return false;
  };

  const getPrice = (date: Date) => {
    if (!prices) return null;
    const monthKey = (date.getMonth() + 1).toString();
    const monthData = prices[monthKey];
    if (!monthData) return null;

    const dateStr = format(date, "dd.MM.yyyy");
    const priceData = monthData.days.find((day) => day.date === dateStr);
    return priceData?.price;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-[2px] max-w-[320px] mx-auto">
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
          const price = getPrice(date);

          return (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => onDateSelect(date)}
                onMouseEnter={() => onHover(date)}
                disabled={isPastDate}
                className={`
                  py-1 text-sm font-medium rounded-lg transition-colors w-full flex flex-col items-center h-[44px]
                  ${
                    isCurrentMonth
                      ? isWeekend
                        ? "text-[#FF621F]"
                        : "text-[#2E2E32]"
                      : "text-[#A1A1AA]"
                  }
                ${
                  isSelected ? "bg-[#FF621F] text-white hover:bg-[#FF621F]" : ""
                }
                ${isRangeDate && !isSelected ? "bg-[#FFF1EC]" : ""}
                ${
                  isPastDate
                    ? "text-[#A1A1AA] cursor-not-allowed"
                    : "hover:bg-[#EFF2F6]"
                }
              `}
              >
                <span>{format(date, "d")}</span>
                <span
                  className={`text-xs h-[14px] ${
                    isSelected
                      ? "text-white"
                      : isRangeDate
                      ? "text-[#FF621F]"
                      : "text-[#bfc1c5]"
                  }`}
                >
                  {price && isCurrentMonth && !isPastDate ? price : ""}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar({
  selectedStartDate,
  selectedEndDate,
  onDateSelect,
  minDate = new Date(),
  prices,
}: CalendarProps) {
  const [baseMonth, setBaseMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

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

  return (
    <div className="w-[680px]">
      {/* Навигация с названием месяца */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setBaseMonth((prev) => addMonths(prev, -1))}
          className="p-2 text-[#2E2E32] hover:bg-[#EFF2F6] rounded-lg"
        >
          <img src={arrow} alt="arrow" className="w-6 h-6 rotate-180" />
        </button>

        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-[#2E2E32]">
            {format(baseMonth, "MMMM yyyy", { locale: ru })}
          </h3>
          <span className="text-[#6B7280]">—</span>
          <h3 className="text-lg font-medium text-[#2E2E32]">
            {format(addMonths(baseMonth, 1), "MMMM yyyy", { locale: ru })}
          </h3>
        </div>

        <button
          onClick={() => setBaseMonth((prev) => addMonths(prev, 1))}
          className="p-2 text-[#2E2E32] hover:bg-[#EFF2F6] rounded-lg"
        >
          <img src={arrow} alt="arrow" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-between">
        <SingleCalendar
          currentMonth={baseMonth}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          onDateSelect={handleDateClick}
          minDate={minDate}
          onHover={setHoverDate}
          hoverDate={hoverDate}
          prices={prices}
        />
        <SingleCalendar
          currentMonth={addMonths(baseMonth, 1)}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          onDateSelect={handleDateClick}
          minDate={minDate}
          onHover={setHoverDate}
          hoverDate={hoverDate}
          prices={prices}
        />
      </div>
    </div>
  );
}
