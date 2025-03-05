import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";

interface FormatDateOptions {
  inputFormat?: string;
  outputFormat?: string;
}

export const useFormatDate = () => {
  const formatDate = (
    date: string,
    {
      inputFormat = "yyyy-MM-dd",
      outputFormat = "d MMMM",
    }: FormatDateOptions = {}
  ) => {
    try {
      const parsedDate = parse(date, inputFormat, new Date());
      return format(parsedDate, outputFormat, { locale: ru });
    } catch (error) {
      console.error("Error formatting date:", error);
      return date;
    }
  };

  return { formatDate };
};
