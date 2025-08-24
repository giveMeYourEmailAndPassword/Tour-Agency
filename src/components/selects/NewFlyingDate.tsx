import { useContext, useState, useEffect } from "react";
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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface CalendarPriceDay {
  date: string;
  price: number;
  operator: string;
}

interface CalendarPriceData {
  data: {
    regular: number;
    calendar: {
      month: {
        [key: string]: {
          days: CalendarPriceDay[];
        };
      };
    };
  };
}

export default function NewFlyingDate() {
  const { setData, params } = useContext(DataContext);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarPrices, setCalendarPrices] =
    useState<CalendarPriceData | null>(null);

  // Изменяем инициализацию dateRange с учетом параметров URL
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>(() => {
    // Если есть параметры в URL, используем их
    if (params.param4?.startDate && params.param4?.endDate) {
      const [startDay, startMonth, startYear] =
        params.param4.startDate.split(".");
      const [endDay, endMonth, endYear] = params.param4.endDate.split(".");
      return {
        start: new Date(
          Number(startYear),
          Number(startMonth) - 1,
          Number(startDay)
        ),
        end: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),
      };
    }
    // Иначе используем значения по умолчанию
    return {
      start: addDays(new Date(), 1),
      end: addWeeks(new Date(), 1),
    };
  });

  // Добавляем эффект для обновления дат при изменении params
  useEffect(() => {
    if (params.param4?.startDate && params.param4?.endDate) {
      const [startDay, startMonth, startYear] =
        params.param4.startDate.split(".");
      const [endDay, endMonth, endYear] = params.param4.endDate.split(".");

      setDateRange({
        start: new Date(
          Number(startYear),
          Number(startMonth) - 1,
          Number(startDay)
        ),
        end: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),
      });
    }
  }, [params.param4]);

  // Функция для получения цен календаря
  const fetchCalendarPrices = async (months: string) => {
    if (!params.param1 || !params.param2) return; // Проверяем наличие города и страны

    try {
      const queryParams = new URLSearchParams({
        country: params.param2,
        departure: params.param1,
        month: months, // Теперь передаем строку с месяцами через запятую
        formmode: "1",
        regular: "1",
      });

      const response = await fetch(
        `${API_BASE_URL}/calendar-price?${queryParams}`
      );
      const data: CalendarPriceData = await response.json();
      setCalendarPrices(data);

      // Здесь можно добавить обработку полученных данных
      console.log("Calendar prices for months", months, ":", data);

      return data;
    } catch (error) {
      console.error("Error fetching calendar prices:", error);
    }
  };

  // Обработчик открытия календаря
  const handleCalendarOpen = async () => {
    setIsOpen(true);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // +1 так как getMonth() возвращает 0-11
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    // Отправляем один запрос с двумя месяцами
    await fetchCalendarPrices(`${currentMonth},${nextMonth}`);
  };

  // Обработчик изменения диапазона
  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });

    if (start && end) {
      const formattedStartDate = format(start, "dd.MM.yyyy");
      const formattedEndDate = format(end, "dd.MM.yyyy");

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
    return format(date, "d MMM", { locale: ru });
  };

  // Добавляем новую функцию для форматирования диапазона дат
  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "";

    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    if (startMonth === endMonth) {
      // Если даты в одном месяце
      return `${format(start, "d", { locale: ru })} - ${format(
        end,
        "d"
      )} ${format(end, "MMMM", { locale: ru })}`;
    } else {
      // Если даты в разных месяцах
      return `${format(start, "d MMM", { locale: ru })}. - ${format(
        end,
        "d MMM",
        { locale: ru }
      )}.`;
    }
  };

  return (
    <Popover placement="bottom" open={isOpen} onOpenChange={handleCalendarOpen}>
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button
          className="p-7 bg-white hover:bg-slate-100 border border-[#DBE0E5] rounded-lg w-[260px]"
          size="lg"
        >
          <img src={calendar} alt="calendar" className="w-6 h-6" />
          <div className="flex flex-col justify-between">
            {!dateRange.start || !dateRange.end ? (
              <h1 className="text-base text-[#6B7280]">Даты вылета</h1>
            ) : (
              <>
                <h1 className="text-sm mb-[1px] text-[#6B7280]">Даты вылета</h1>
                <p className="text-[#2E2E32] text-lg font-medium">
                  {formatDateRange(dateRange.start, dateRange.end)}
                </p>
              </>
            )}
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
              prices={calendarPrices?.data.calendar.month} // Передаем цены в календарь
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
