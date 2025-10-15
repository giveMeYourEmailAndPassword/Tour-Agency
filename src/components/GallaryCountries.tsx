import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { destinations } from "./data/destinations";

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Функция для получения случайного элемента из массива
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export default function GallaryCountries() {
  const navigate = useNavigate();

  // Мемоизируем случайный выбор стран и изображений
  const items = useMemo(() => {
    // Получаем все страны с изображениями
    const countriesWithImages = destinations.filter(
      (d) => (d.images?.length || 0) > 0
    );

    // Перемешиваем массив и берем первые 5 элементов
    const shuffledCountries = shuffleArray(countriesWithImages).slice(0, 5);

    // Создаем элементы с случайными изображениями
    return shuffledCountries.map((d) => ({
      id: d.id,
      name: d.name,
      img: getRandomElement(d.images!),
    }));
  }, []); // Пустой массив зависимостей означает, что это выполнится только один раз

  // Функция для обработки клика по картинке
  const handleImageClick = (countryId: number) => {
    // Находим страну по ID
    const country = destinations.find((d) => d.id === countryId);
    if (country) {
      // Получаем все регионы страны
      const regions = country.regions.map((region) => region.id);

      // Создаем URL параметры
      const searchParams = new URLSearchParams();
      searchParams.set("country", countryId.toString());
      searchParams.set("regions", regions.join(","));

      // Переходим на страницу OurTours с параметрами
      navigate(`/OurTours?${searchParams.toString()}`);
    }
  };

  // Раскладка: 2 строки, ширины — асимметричные через col-span
  // row1: [7, 5], row2: [4, 4, 4]
  const topRow = items.slice(0, 2);
  const bottomRow = items.slice(2, 5);

  return (
    <div className="w-full space-y-2">
      {/* Верхняя плоскость */}
      <div className="grid grid-cols-12 gap-2">
        {topRow.map((item, idx) => {
          const col = idx === 0 ? "col-span-7" : "col-span-5";
          return (
            <div key={item.id} className={`${col}`}>
              <div
                className="relative w-full h-72 overflow-hidden rounded-xl cursor-pointer"
                onClick={() => handleImageClick(item.id)}
                style={{ contentVisibility: "auto" }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-x-0 bottom-0 px-4 py-8 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <span className="text-white text-2xl font-semibold drop-shadow bg-black/70 px-7 py-2 rounded-2xl">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Нижняя плоскость */}
      <div className="grid grid-cols-12 gap-2">
        {bottomRow.map((item) => (
          <div key={item.id} className="col-span-4">
            <div
              className="relative w-full h-56 overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleImageClick(item.id)}
              style={{ contentVisibility: "auto" }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform"
                loading="lazy"
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <span className="text-white text-2xl font-semibold drop-shadow bg-black/70 px-5 py-1 rounded-2xl">
                  {item.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
