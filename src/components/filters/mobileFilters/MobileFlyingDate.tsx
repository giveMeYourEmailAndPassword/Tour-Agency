import { useContext, useState, useEffect } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import { format, addMonths } from "date-fns";
import { ru } from "date-fns/locale";
import calendar from "../../../assets/calendar.svg";
import CalendarMobile from "../../Calendar/CalendarMobile";
import arrow from "../../../assets/arrow.svg";

export default function MobileFlyingDate() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Изменяем формат состояния на Date вместо CalendarDate
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(new Date().setDate(new Date().getDate() + 1)), // завтра
    end: new Date(new Date().setDate(new Date().getDate() + 7)), // через неделю
  });

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

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const formattedStartDate = format(dateRange.start, "dd.MM.yyyy");
      const formattedEndDate = format(dateRange.end, "dd.MM.yyyy");

      setData("param4", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
  }, []);

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

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
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

              <div className="flex justify-start items-center px-5 py-2">
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
                />
              </div>

              {/* Button */}
              <div className="px-3 pb-5 pt-3">
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
