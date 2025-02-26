import { DateRangePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { useContext } from "react";
import { DataContext } from "../DataProvider";
import { today, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns"; // Импортируем функцию format из date-fns

export default function FlyingDate() {
  const { setData } = useContext(DataContext);

  const handleDateChange = (value: { start: any; end: any }) => {
    if (value.start && value.end) {
      // Форматируем start и end с помощью date-fns
      const startDate = format(
        new Date(value.start.year, value.start.month - 1, value.start.day),
        "dd.MM.yyyy"
      );
      const endDate = format(
        new Date(value.end.year, value.end.month - 1, value.end.day),
        "dd.MM.yyyy"
      );

      setData("param4", { startDate, endDate });
    }
  };

  return (
    <I18nProvider locale="ru">
      <DateRangePicker
        className="w-72 font-medium"
        label="Даты вылета"
        size="lg"
        classNames={{
          inputWrapper: "bg-white shadow-none hover:bg-slate-100 ",
          innerWrapper: "h-12 font-semibold font-bold",
          label: "text-sm font-normal",
          segment: "font-medium text-lg",
        }}
        onChange={handleDateChange}
        minValue={today(getLocalTimeZone())}
        visibleMonths={2}
      />
    </I18nProvider>
  );
}
