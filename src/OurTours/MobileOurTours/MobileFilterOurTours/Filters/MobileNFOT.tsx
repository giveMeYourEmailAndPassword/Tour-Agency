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
import { parseDate } from "@internationalized/date";

export default function MobileNightsFromOT() {
  const { setData, params } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  const startDay = params?.param3?.startDay || 6;
  const endDay = params?.param3?.endDay || 14;

  const range = {
    start: parseDate(`2023-10-${startDay.toString().padStart(2, "0")}`),
    end: parseDate(`2023-10-${endDay.toString().padStart(2, "0")}`),
  };

  const handleRangeChange = (value: { start: any; end: any }) => {
    if (value.start && value.end) {
      setData("param3", {
        startDay: value.start.day,
        endDay: value.end.day,
      });
      setIsOpen(false);
    }
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
            Ночей
          </span>
          <p className="text-black text-base md:text-lg font-medium">
            {range.start && range.end
              ? `${range.start.day} - ${range.end.day}`
              : "6 - 14"}
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
        className="h-[318px] !p-0 !m-0 !max-w-full"
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

          <ModalBody className="p-3 flex flex-col items-center justify-start h-full">
            <RangeCalendar
              onChange={handleRangeChange}
              value={range}
              classNames={{
                headerWrapper: "hidden",
                gridHeader: "hidden",
                gridWrapper: "border-none rounded-none",
                gridBody: "border-none rounded-none",
                base: "rounded-none shadow-none bg-white",
                cell: "w-10",
                cellButton: ["w-10 h-10"],
                title: "text-lg",
              }}
              calendarWidth="100%"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
