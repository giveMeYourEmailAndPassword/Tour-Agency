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
import { parseDate } from "@internationalized/date";

export default function MobileNightsFrom() {
  const { setData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  // Используем объекты из @internationalized/date для начального состояния
  const [range, setRange] = useState({
    start: parseDate("2023-10-06"),
    end: parseDate("2023-10-14"),
  });

  // Обработчик изменения диапазона
  const handleRangeChange = (value: { start: any; end: any }) => {
    if (value.start && value.end) {
      setRange(value);

      const startDay = value.start.day;
      const endDay = value.end.day;

      setData("param3", { startDay, endDay });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setData("param3", { startDay: range.start.day, endDay: range.end.day });
  }, []);

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="px-2 w-full md:w-64 h-12 md:h-full bg-white hover:bg-slate-100 rounded-md md:rounded-xl !z-0 !scale-100 !opacity-100 py-1"
      >
        <div className="flex flex-col items-start justify-between w-full">
          <span className="text-slate-600 mb-[1px] text-xs md:text-sm">
            Ночей
          </span>
          <p className="text-black text-base md:text-lg font-medium">
            {range.start.day} - {range.end.day}
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
        className="h-[85vh] !p-0 !m-0 !max-w-full"
        hideCloseButton={true}
        shadow="none"
      >
        <ModalContent>
          <ModalHeader className="flex justify-between items-center border-b py-2 px-3">
            <h2 className="text-lg font-medium">Выберите количество ночей</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </ModalHeader>

          <ModalBody className="p-3">
            <RangeCalendar
              onChange={handleRangeChange}
              value={range}
              classNames={{
                headerWrapper: "hidden",
                gridHeader: "hidden",
                gridWrapper: "border-none rounded-none",
                gridBody: "border-none rounded-none",
                base: "rounded-none shadow-none bg-white",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
