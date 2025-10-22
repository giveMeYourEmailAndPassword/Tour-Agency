import { parse } from "date-fns";
import { useState } from "react";

interface TourData {
  flydate: string;
  price: number;
  currency: string;
}

interface PriceChartProps {
  tours: TourData[];
  onDaySelect?: (dayOfWeek: number) => void;
  selectedDay?: number | null;
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
      <div className="w-full bg-white border border-[#DBE0E5] rounded-[10px] p-4">
        <h3 className="text-lg font-bold text-[#2E2E32] mb-4">
          Цены по дням вылета
        </h3>
        <div className="text-center text-gray-500">Нет данных о ценах</div>
      </div>
    );
  }

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Используем логарифмическую шкалу для более равномерного распределения высот
  const calculateHeight = (price: number) => {
    if (maxPrice === minPrice) return 100; // Если все цены одинаковые

    // Логарифмическая формула для более равномерного распределения
    const logMin = Math.log(minPrice);
    const logMax = Math.log(maxPrice);
    const logPrice = Math.log(price);

    // Нормализуем логарифмическое значение от 0 до 1
    const normalized = (logPrice - logMin) / (logMax - logMin);

    // Применяем квадратный корень для еще более равномерного распределения
    const smoothed = Math.sqrt(normalized);

    // Масштабируем от 40px до 100px (минимальная высота для цен - 40px)
    return 40 + smoothed * 60;
  };

  const formatPrice = (price: number, currency: string) => {
    switch (currency) {
      case "USD":
        return `$${price}`;
      case "EUR":
        return `€${price}`;
      default:
        return `${price} ${currency}`;
    }
  };

  return (
    <div className="w-full bg-white border border-[#DBE0E5] rounded-[10px] p-4">
      <h3 className="text-lg font-bold text-[#2E2E32] mb-4">
        Цены по дням вылета
      </h3>

      <div className="flex items-end justify-between h-32 gap-1">
        {chartData.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Tooltip при наведении */}
            {hoveredDay === day.dayOfWeek && day.hasData && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#2E2E32] text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                <div className="font-medium">{day.dayName}</div>
                <div>от {formatPrice(day.minPrice!, day.currency)}</div>
                <div className="text-xs opacity-75">{day.sampleDate}</div>
                {/* Стрелка вниз */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-[#2E2E32]"></div>
              </div>
            )}

            {/* Столбец диаграммы */}
            <div className="w-full flex flex-col items-center justify-end h-24 mb-2">
              {day.hasData ? (
                <div
                  className={`w-full rounded-t cursor-pointer transition-all duration-200 ${
                    selectedDay === day.dayOfWeek
                      ? "bg-[#FF621F] opacity-100"
                      : hoveredDay === day.dayOfWeek
                      ? "bg-[#FF621F] opacity-80"
                      : "bg-[#FF621F] opacity-60"
                  }`}
                  style={{
                    height: `${calculateHeight(day.minPrice!)}px`,
                    minHeight: "4px",
                  }}
                  onMouseEnter={() => setHoveredDay(day.dayOfWeek)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onDaySelect?.(day.dayOfWeek)}
                />
              ) : (
                <div className="w-full bg-gray-300 rounded-t h-1" />
              )}
            </div>

            {/* Название дня */}
            <div
              className={`text-xs font-medium transition-colors ${
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
                className={`text-xs font-bold mt-1 transition-colors ${
                  selectedDay === day.dayOfWeek
                    ? "text-[#FF621F]"
                    : "text-[#2E2E32]"
                }`}
              >
                {formatPrice(day.minPrice!, day.currency)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
