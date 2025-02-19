import { DateRangePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

export default function Test() {
  return (
    <>
      <I18nProvider locale="ru">
        <DateRangePicker className="w-64" label="Даты вылета" />
      </I18nProvider>
    </>
  );
}

// http://tourvisor.ru/xml/list.php?type=meal&authlogin=Ikram.kv@gmail.com&authpass=YkCfsYMj4322

// https://tourvisor.ru/xml/list.php?type=services&authlogin=Ikram.kv@gmail.com&authpass=YkCfsYMj4322
