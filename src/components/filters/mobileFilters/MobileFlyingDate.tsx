import { useContext, useState, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import calendar from "../../../assets/calendar.svg";
import CalendarMobile from "../../Calendar/CalendarMobile";

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

export default function MobileFlyingDate() {
  const { setData, params } = useContext(DataContext);
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
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 7)),
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

  // Добавить состояние для текущего месяца
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });

    if (start && end) {
      const formattedStartDate = format(start, "dd.MM.yyyy");
      const formattedEndDate = format(end, "dd.MM.yyyy");

      setData("param4", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
  };

  // Изменим функцию форматирования даты
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    // Если конечная дата не выбрана, показываем полное название месяца
    if (!dateRange.end || dateRange.start === dateRange.end) {
      return format(date, "d MMMM", { locale: ru });
    }
    // Если выбран диапазон, показываем сокращенное название месяца
    return format(date, "d MMM", { locale: ru });
  };

  // Функция для получения цен календаря
  const fetchCalendarPrices = async (months: string) => {
    if (!params.param1 || !params.param2) return;

    try {
      const queryParams = new URLSearchParams({
        country: params.param2,
        departure: params.param1,
        month: months,
        formmode: "1",
        regular: "1",
      });

      const response = await fetch(
        `${API_BASE_URL}/calendar-price?${queryParams}`
      );
      const data: CalendarPriceData = await response.json();
      setCalendarPrices(data);
    } catch (error) {
      console.error("Error fetching calendar prices:", error);
    }
  };

  // Обработчик открытия модального окна
  const handleOpen = async () => {
    setIsOpen(true);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    // Запрашиваем цены для текущего и следующего месяца
    await fetchCalendarPrices(`${currentMonth},${nextMonth}`);
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#DBE0E5]"
      >
        <img src={calendar} alt="calendar" className="w-5 h-5" />
        <div className="flex flex-col">
          <span className="text-xs font-light text-[#7E8389]">Даты вылета</span>
          <span className="text-base font-medium text-[#2E2E32]">
            {formatDisplayDate(dateRange.start)}
            {dateRange.end &&
              dateRange.start?.getTime() !== dateRange.end?.getTime() && (
                <> - {formatDisplayDate(dateRange.end)}</>
              )}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="!p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
            exit: {
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <div className="absolute bottom-0 w-full">
            <div className="bg-white w-full rounded-t-[10px]">
              {/* Header */}
              <div className="flex justify-center items-center border-b border-[#DBE0E5] h-14 relative">
                <h2 className="text-[20px] font-medium text-[#2E2E32]">
                  Даты вылета
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-5"
                >
                  <RxCross2 className="w-6 h-6 text-[#FF621F]" />
                </button>
              </div>

              <div className="flex justify-start items-center px-5 pt-5">
                <span className="text-base font-medium text-[#2E2E32]">
                  {formatDisplayDate(dateRange.start)}
                  {dateRange.end &&
                    dateRange.start?.getTime() !== dateRange.end?.getTime() && (
                      <> - {formatDisplayDate(dateRange.end)}</>
                    )}
                </span>
              </div>

              {/* Calendar */}
              <div className="pt-5 px-3">
                <CalendarMobile
                  selectedStartDate={dateRange.start}
                  selectedEndDate={dateRange.end}
                  onDateSelect={handleDateChange}
                  minDate={new Date()}
                  prices={calendarPrices?.data.calendar.month}
                />
              </div>

              {/* Button */}
              <div className="px-3 p-5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 px-6 border border-[#FF621F] bg-[#FF621F] rounded-[10px] text-lg text-white"
                >
                  Выбрать
                </button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
