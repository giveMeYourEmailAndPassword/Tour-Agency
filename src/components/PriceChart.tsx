import { parse } from "date-fns";
import { useState } from "react";
import { Tooltip } from "@heroui/react";

interface TourData {
  flydate: string;
  price: number;
  currency: string;
}

interface PriceChartProps {
  tours: TourData[];
  onDaySelect?: (dayOfWeek: number) => void;
  selectedDay?: number | null;
  onFilterChange?: (filter: string) => void;
  currentFilter?: string;
}

interface DayData {
  dayName: string;
  dayShort: string;
  minPrice: number | null;
  currency: string;
  hasData: boolean;
  dayOfWeek: number;
  sampleDate?: string; // Пример даты для этого дня недели
}

export default function PriceChart({
  tours,
  onDaySelect,
  selectedDay,
  onFilterChange,
  currentFilter = "popular",
}: PriceChartProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  // Обработка данных для группировки по дням недели
  const processData = (tours: TourData[]): DayData[] => {
    const daysOfWeek = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];

    const dayShortNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Группируем туры по дням недели
    const groupedByDay: {
      [key: number]: { prices: number[]; sampleDate: string };
    } = {};

    tours.forEach((tour) => {
      try {
        const date = parse(tour.flydate, "dd.MM.yyyy", new Date());
        const dayOfWeek = date.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота

        // Преобразуем в наш формат (1 = понедельник, 7 = воскресенье)
        const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;

        if (!groupedByDay[normalizedDay]) {
          groupedByDay[normalizedDay] = {
            prices: [],
            sampleDate: tour.flydate,
          };
        }
        groupedByDay[normalizedDay].prices.push(tour.price);
      } catch (error) {
        console.error("Ошибка парсинга даты:", tour.flydate, error);
      }
    });

    // Создаем массив данных для всех дней недели
    const result: DayData[] = [];

    for (let i = 1; i <= 7; i++) {
      const dayData = groupedByDay[i];
      const hasData = dayData && dayData.prices.length > 0;
      const minPrice = hasData ? Math.min(...dayData.prices) : null;

      result.push({
        dayName: daysOfWeek[i - 1],
        dayShort: dayShortNames[i - 1],
        minPrice,
        currency: tours[0]?.currency || "USD",
        hasData,
        dayOfWeek: i,
        sampleDate: dayData?.sampleDate,
      });
    }

    return result;
  };

  const chartData = processData(tours);
  const prices = chartData.filter((d) => d.hasData).map((d) => d.minPrice!);

  if (prices.length === 0) {
    return (
      <div className="w-full bg-white border border-[#DBE0E5] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-[#2E2E32] mb-6">
          Цены по дням вылета
        </h3>
        <div className="text-center text-gray-500 text-base py-8">
          Нет данных о ценах
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Используем логарифмическую шкалу для более равномерного распределения высот
  const calculateHeight = (price: number) => {
    if (maxPrice === minPrice) return 70; // Если все цены одинаковые

    // Логарифмическая формула для более равномерного распределения
    const logMin = Math.log(minPrice);
    const logMax = Math.log(maxPrice);
    const logPrice = Math.log(price);

    // Нормализуем логарифмическое значение от 0 до 1
    const normalized = (logPrice - logMin) / (logMax - logMin);

    // Применяем квадратный корень для еще более равномерного распределения
    const smoothed = Math.sqrt(normalized);

    // Масштабируем от 50px до 120px (минимальная высота для цен - 50px)
    return 30 + smoothed * 30;
  };

  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case "USD":
        return `${price}$`;
      case "EUR":
        return `${price}€`;
      default:
        return `${price} ${currency}`;
    }
  };

  const filterButtons = [
    { key: "popular", label: "Сначала популярные" },
    { key: "rating", label: "По рейтингу" },
    { key: "price-asc", label: "По возрастанию цен" },
    { key: "price-desc", label: "По убыванию цен" },
  ];

  return (
    <div className="w-full bg-white border border-[#DBE0E5] rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h3 className="text-xl font-semibold text-[#2E2E32]">
          Цены по дням вылета
        </h3>

        {/* Кнопки фильтров */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((button) => (
            <button
              key={button.key}
              onClick={() => onFilterChange?.(button.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentFilter === button.key
                  ? "bg-[#FF621F] text-white"
                  : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between h-40 gap-2 relative">
        {chartData.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative group"
          >
            {/* Столбец диаграммы */}
            <div className="w-full flex flex-col items-center justify-end h-28 mb-3">
              {day.hasData ? (
                <Tooltip
                  content={
                    <div className="flex flex-col items-center">
                      <div className="font-medium text-base flex items-center gap-2">
                        {day.dayName} от{" "}
                        {formatPrice(day.minPrice!, day.currency)}
                      </div>
                      <div className="text-sm">{day.sampleDate}</div>
                    </div>
                  }
                  placement={
                    index === 0
                      ? "top-start"
                      : index === chartData.length - 1
                      ? "top-end"
                      : "top"
                  }
                  color="primary"
                  classNames={{
                    base: "before:bg-[#FF621F] before:border-none before:shadow-none border-none shadow-none",
                    content:
                      "bg-[#FF621F] text-white before:border-none before:shadow-none border-none shadow-none",
                  }}
                  showArrow
                  isDisabled={!day.hasData}
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      setHoveredDay(day.dayOfWeek);
                    } else {
                      setHoveredDay(null);
                    }
                  }}
                >
                  <div
                    className={`w-full rounded-t-lg cursor-pointer transition-all duration-300 ease-out ${
                      selectedDay === day.dayOfWeek
                        ? "bg-[#FF621F]"
                        : hoveredDay === day.dayOfWeek
                        ? "bg-[#ff621fef]"
                        : "bg-[#ff621f8f]"
                    }`}
                    style={{
                      height: `${calculateHeight(day.minPrice!)}px`,
                      minHeight: "6px",
                    }}
                    onClick={() => onDaySelect?.(day.dayOfWeek)}
                  />
                </Tooltip>
              ) : (
                <>
                  <div className="w-full bg-gray-100 rounded-t-lg h-2" />
                  <div className="w-full h-5" />
                </>
              )}
            </div>

            {/* Название дня */}
            <div
              className={`text-sm font-medium transition-colors duration-200 ${
                selectedDay === day.dayOfWeek
                  ? "text-[#FF621F]"
                  : "text-[#6B7280]"
              }`}
            >
              {day.dayShort}
            </div>

            {/* Цена */}
            {day.hasData && (
              <div
                className={`text-sm font-bold transition-colors duration-200 ${
                  selectedDay === day.dayOfWeek
                    ? "text-[#FF621F]"
                    : "text-[#2E2E32]"
                }`}
              >
                от {formatPrice(day.minPrice!, day.currency)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
