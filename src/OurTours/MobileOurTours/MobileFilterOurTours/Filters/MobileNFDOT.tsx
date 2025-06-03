import { useContext, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { DataContext } from "../../../../components/DataProvider";
import { RxCross2 } from "react-icons/rx";
import { RangeCalendar } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { format, parse } from "date-fns";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { ru } from "date-fns/locale";

export default function MobileNewFlyingDateOT() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const startDate =
    params?.param4?.startDate ||
    format(new Date().setDate(new Date().getDate() + 1), "dd.MM.yyyy");
  const endDate =
    params?.param4?.endDate ||
    format(new Date().setDate(new Date().getDate() + 7), "dd.MM.yyyy");

  // Функция для преобразования строки даты в формате dd.MM.yyyy в объект даты
  const parseDateFromContext = (dateString: string) => {
    if (!dateString) return null;
    try {
      const parsedDate = parse(dateString, "dd.MM.yyyy", new Date());
      return parseDate(
        `${parsedDate.getFullYear()}-${String(
          parsedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`
      );
    } catch (e) {
      console.error("Ошибка парсинга даты:", e);
      return null;
    }
  };

  const range = {
    start:
      parseDateFromContext(startDate) ||
      today(getLocalTimeZone()).add({ days: 1 }),
    end:
      parseDateFromContext(endDate) ||
      today(getLocalTimeZone()).add({ weeks: 1 }),
  };

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

      setData("param4", {
        startDate: format(startDate, "dd.MM.yyyy"),
        endDate: format(endDate, "dd.MM.yyyy"),
      });
      setIsOpen(false);
    }
  };

  const formatDisplayDate = (date: any) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return format(jsDate, "d MMM", { locale: ru });
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        radius="none"
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 !z-0 !scale-100 !opacity-100 py-1"
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
        className="h-[390px] !p-0 !m-0 !max-w-full"
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
                  gridBody: "border-none rounded-none",
                  base: "rounded-none shadow-none bg-white",
                  gridHeader: "shadow-none",
                  gridHeaderCell: "w-10",
                  cell: "w-10",
                  cellButton: ["w-10 h-10"],
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
