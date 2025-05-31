import { useContext } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { RangeCalendar } from "@heroui/react";
import { DataContext } from "../../../components/DataProvider";
import { parseDate } from "@internationalized/date";

export default function NightsFromOT() {
  const { setData, params } = useContext(DataContext);
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
    }
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger className="!z-0 !scale-100 !opacity-100">
        <Button className="p-7 bg-white hover:bg-slate-100" size="lg">
          <div className="flex flex-col justify-between">
            <h1 className="text-sm mb-[1px] text-slate-600">Ночей</h1>
            <p className="text-black text-lg font-medium">
              {range.start && range.end
                ? `${range.start.day} - ${range.end.day}` // Отображаем дни
                : "6 - 14"}{" "}
              {/* Дефолтное значение, если range не задан */}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-1">
          <div className="text-small font-semibold mb-2">Ночей от:</div>
          <RangeCalendar
            onChange={handleRangeChange}
            value={range} // Передаем текущее состояние в RangeCalendar
            classNames={{
              headerWrapper: "hidden",
              gridHeader: "hidden",
              gridWrapper: "border-none rounded-none",
              gridBody: "border-none rounded-none",
              base: "rounded-none shadow-none bg-white",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
