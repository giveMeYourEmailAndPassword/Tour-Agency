import { useMemo, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { destinations } from "./data/destinations";
import { DataContext } from "./DataProvider";

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

// Skeleton компонент для карточки страны
const CountrySkeleton = ({ colSpan }: { colSpan: string }) => (
  <div className={colSpan}>
    <div className="relative w-full h-72 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="absolute inset-x-0 bottom-0 px-4 py-8 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
        <div className="bg-gray-300 h-8 w-32 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// Skeleton компонент для нижней строки
const BottomRowSkeleton = () => (
  <div className="col-span-4">
    <div className="relative w-full h-56 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
        <div className="bg-gray-300 h-8 w-24 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

export default function GallaryCountries() {
  const navigate = useNavigate();
  const { params, setData } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const imagesRef = useRef<string[]>([]);

  // Мемоизируем случайный выбор стран и изображений
  const items = useMemo(() => {
    // Получаем все страны с изображениями
    const countriesWithImages = destinations.filter(
      (d) => (d.images?.length || 0) > 0
    );

    // Перемешиваем массив и берем первые 5 элементов
    const shuffledCountries = shuffleArray(countriesWithImages).slice(0, 5);

    // Создаем элементы с случайными изображениями
    const result = shuffledCountries.map((d) => ({
      id: d.id,
      name: d.name,
      img: getRandomElement(d.images!),
    }));

    // Сохраняем ссылки на изображения для отслеживания загрузки
    imagesRef.current = result.map((item) => item.img);

    return result;
  }, []);

  // Отслеживаем загрузку изображений
  useEffect(() => {
    const handleImageLoad = (src: string) => {
      setLoadedImages((prev) => {
        const newSet = new Set(prev);
        newSet.add(src);
        return newSet;
      });
    };

    const handleImageError = (src: string) => {
      // В случае ошибки тоже считаем изображение "загруженным"
      setLoadedImages((prev) => {
        const newSet = new Set(prev);
        newSet.add(src);
        return newSet;
      });
    };

    // Предзагружаем изображения
    imagesRef.current.forEach((src) => {
      const img = new Image();
      img.onload = () => handleImageLoad(src);
      img.onerror = () => handleImageError(src);
      img.src = src;
    });
  }, []);

  // Проверяем, загружены ли все изображения
  useEffect(() => {
    if (
      loadedImages.size === imagesRef.current.length &&
      imagesRef.current.length > 0
    ) {
      // Добавляем небольшую задержку для плавности
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loadedImages]);

  // Функция для обработки клика по картинке
  const handleImageClick = async (countryId: number) => {
    // Находим страну по ID
    const country = destinations.find((d) => d.id === countryId);
    if (country) {
      // Получаем все регионы страны
      const regions = country.regions.map((region) => region.id);

      // Сначала обновляем параметры в контексте
      setData("param2", country.id.toString());
      setData("param2Regions", regions);

      // Создаем URL параметры
      const searchParams = new URLSearchParams();

      // Добавляем текущие параметры из контекста
      if (params.param1) searchParams.set("departure", params.param1);
      // Используем ID страны
      searchParams.set("country", country.id.toString());
      searchParams.set("regions", regions.join(","));

      if (params.param3?.startDay)
        searchParams.set("nightsFrom", params.param3.startDay.toString());
      if (params.param3?.endDay)
        searchParams.set("nightsTo", params.param3.endDay.toString());
      // Убираем использование param4 для дат - они должны быть получены из кода страны
      if (params.param5?.adults)
        searchParams.set("adults", params.param5.adults.toString());
      if (params.param5?.childrenList?.length)
        searchParams.set("children", params.param5.childrenList.join(","));
      if (params.param6?.length)
        searchParams.set("hotelTypes", params.param6.join(","));
      if (params.param7?.length) searchParams.set("meal", params.param7[0]);
      if (params.param8?.length) searchParams.set("rating", params.param8[0]);
      if (params.param9) searchParams.set("stars", params.param9.toString());
      if (params.param10?.length)
        searchParams.set("services", params.param10.join(","));
      if (params.param11) {
        searchParams.set("charterOnly", "true");
      }

      // Добавляем флаг, что переход из галереи
      searchParams.set("fromGallery", "true");

      const newUrl = `/OurTours?${searchParams.toString()}`;

      // Переходим на страницу OurTours с параметрами
      navigate(newUrl);

      // Поиск запустится автоматически на странице OurTours
      // Параметры уже обновлены через setData выше
    }
  };

  // Раскладка: 2 строки, ширины — асимметричные через col-span
  // row1: [7, 5], row2: [4, 4, 4]
  const topRow = items.slice(0, 2);
  const bottomRow = items.slice(2, 5);

  // Показываем skeleton во время загрузки
  if (isLoading) {
    return (
      <div className="w-full space-y-2">
        {/* Десктопная раскладка skeleton */}
        <div className="hidden md:block">
          {/* Верхняя плоскость skeleton */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <CountrySkeleton colSpan="col-span-7" />
            <CountrySkeleton colSpan="col-span-5" />
          </div>

          {/* Нижняя плоскость skeleton */}
          <div className="grid grid-cols-12 gap-2">
            <BottomRowSkeleton />
            <BottomRowSkeleton />
            <BottomRowSkeleton />
          </div>
        </div>

        {/* Мобильная раскладка skeleton */}
        <div className="md:hidden space-y-2">
          {/* Первое большое изображение skeleton */}
          <div className="w-full">
            <div className="relative w-full h-64 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="absolute inset-x-0 bottom-0 px-4 py-6 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
                <div className="bg-gray-300 h-6 w-24 rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Два маленьких изображения skeleton */}
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <div className="relative w-full h-40 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
                  <div className="bg-gray-300 h-4 w-16 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="relative w-full h-40 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
                  <div className="bg-gray-300 h-4 w-16 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Последнее большое изображение skeleton */}
          <div className="w-full">
            <div className="relative w-full h-64 overflow-hidden rounded-xl bg-gray-200 animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="absolute inset-x-0 bottom-0 px-4 py-6 bg-gradient-to-t from-gray-300/60 via-gray-300/30 to-transparent">
                <div className="bg-gray-300 h-6 w-24 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 mt-[-6px] md:mt-0">
      {/* Десктопная раскладка */}
      <div className="hidden md:block">
        {/* Верхняя плоскость */}
        <div className="grid grid-cols-12 gap-2 mb-2">
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

      {/* Мобильная раскладка: 1 большое, 2 маленьких, 1 большое */}
      <div className="md:hidden space-y-2">
        {/* Первое большое изображение */}
        <div className="w-full">
          <div
            className="relative w-full h-48 overflow-hidden rounded-xl cursor-pointer"
            onClick={() => handleImageClick(items[0].id)}
            style={{ contentVisibility: "auto" }}
          >
            <img
              src={items[0].img}
              alt={items[0].name}
              className="w-full h-full object-cover transition-transform"
            />
            <div className="absolute inset-x-0 bottom-0 px-4 py-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent items-center justify-center">
              <span className="text-white text-base font-semibold drop-shadow bg-black/70 px-4 py-1 rounded-2xl">
                {items[0].name}
              </span>
            </div>
          </div>
        </div>

        {/* Два маленьких изображения */}
        <div className="grid grid-cols-2 gap-2">
          {items.slice(1, 3).map((item) => (
            <div key={item.id} className="w-full">
              <div
                className="relative w-full h-40 overflow-hidden rounded-xl cursor-pointer"
                onClick={() => handleImageClick(item.id)}
                style={{ contentVisibility: "auto" }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform"
                />
                <div className="absolute inset-x-0 bottom-0 px-3 py-3 bg-gradient-to-t from-black/60 via-black/30 to-transparent items-center justify-center">
                  <span className="text-white text-base font-semibold drop-shadow bg-black/70 px-4 py-1 rounded-2xl">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Последнее большое изображение */}
        <div className="w-full">
          <div
            className="relative w-full h-48 overflow-hidden rounded-xl cursor-pointer"
            onClick={() => handleImageClick(items[3].id)}
            style={{ contentVisibility: "auto" }}
          >
            <img
              src={items[3].img}
              alt={items[3].name}
              className="w-full h-full object-cover transition-transform"
            />
            <div className="absolute inset-x-0 bottom-0 px-4 py-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent items-center justify-center">
              <span className="text-white text-base font-semibold drop-shadow bg-black/70 px-4 py-1 rounded-2xl">
                {items[3].name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
