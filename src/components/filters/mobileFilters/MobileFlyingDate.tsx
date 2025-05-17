import { useContext, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DataContext } from "../../DataProvider";
import { RxCross2 } from "react-icons/rx";
import { RangeCalendar } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { format } from "date-fns";
import { today, getLocalTimeZone } from "@internationalized/date";
import { ru } from "date-fns/locale";

export default function MobileFlyingDate() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Инициализируем состояние с дефолтными значениями
  const [range, setRange] = useState({
    start: today(getLocalTimeZone()).add({ days: 1 }),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  // Обработчик изменения диапазона
  const handleRangeChange = (value: { start: any; end: any }) => {
    if (value.start && value.end) {
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

      setRange({ start: value.start, end: value.end });

      const formattedStartDate = format(startDate, "dd.MM.yyyy");
      const formattedEndDate = format(endDate, "dd.MM.yyyy");

      setData("param4", {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      setIsOpen(false);
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

    const formattedStartDate = format(startDate, "dd.MM.yyyy");
    const formattedEndDate = format(endDate, "dd.MM.yyyy");

    setData("param4", {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  }, []);

  const formatDisplayDate = (date: any) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return format(jsDate, "d MMM", { locale: ru });
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-md md:rounded-xl !z-0 !scale-100 !opacity-100 py-1"
      >
        <div className="flex flex-col items-start justify-between w-full">
          <span className="text-slate-600 mb-[1px] text-xs md:text-sm">
            Даты вылета
          </span>
          <p className="text-black text-base md:text-lg font-medium">
            {formatDisplayDate(range.start)} - {formatDisplayDate(range.end)}
          </p>
        </div>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        backdrop="opaque"
        radius="sm"
        scrollBehavior="inside"
        isDismissable={true}
        shouldBlockScroll={true}
        className="h-[70vh] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите даты</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3 flex flex-col items-center justify-start">
            <I18nProvider locale="ru">
              <RangeCalendar
                onChange={handleRangeChange}
                classNames={{
                  gridWrapper: "border-none rounded-none",
                  gridBody: "border-none rounded-none bg-white",
                  base: "rounded-none shadow-none bg-white",
                  gridHeaderCell: "w-10",
                  cell: "w-10",
                  cellButton: [
                    "w-10 h-10",
                    "[&[data-selected]]:bg-blue-100",
                    "[&[data-selected-start]]:!bg-blue-500 [&[data-selected-start]]:!text-white",
                    "[&[data-selected-end]]:!bg-blue-500 [&[data-selected-end]]:!text-white",
                    "[&[data-hovered]]:bg-blue-50",
                  ],
                  title: "text-lg",
                  prevButton: "text-xl",
                  nextButton: "text-xl",
                }}
                visibleMonths={1}
                calendarWidth="100%"
                showShadow={false}
                value={range}
                minValue={today(getLocalTimeZone())}
              />
            </I18nProvider>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
