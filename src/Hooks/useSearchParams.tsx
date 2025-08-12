// src/Hooks/useSearchParams.ts
import { useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "../components/DataProvider";
import { today, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";

export const useSearchParams = () => {
  const { setData, cities, countries } = useContext(DataContext);

  useEffect(() => {
    // Установка города отправления по умолчанию
    if (cities.length > 0) {
      setData("param1", cities[0]?.id || 80);
    }

    // Установка страны назначения по умолчанию
    if (countries.length > 0) {
      const turkey = countries.find((country) => country.label === "Турция");
      setData("param2", turkey?.id || countries[0]?.id);
    }

    // Установка дат по умолчанию
    const startDate = today(getLocalTimeZone()).add({ days: 1 });
    const endDate = today(getLocalTimeZone()).add({ weeks: 1 });

    const jsStartDate = new Date(
      startDate.year,
      startDate.month - 1,
      startDate.day
    );
    const jsEndDate = new Date(endDate.year, endDate.month - 1, endDate.day);

    setData("param4", {
      startDate: format(jsStartDate, "dd.MM.yyyy"),
      endDate: format(jsEndDate, "dd.MM.yyyy"),
    });
  }, [cities, countries, setData]);

  return null;
};
