import { useContext, useEffect, useState } from "react";
import { DataContext } from "../DataProvider";

const useProgressiveLoading = (
  isLoading: boolean,
  actualProgress: number,
  state: string
) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [initialProgress] = useState(() => Math.floor(Math.random() * 7) + 7); // 7-14%
  const [isFinishing, setIsFinishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Сброс состояний при новом поиске
    if (state === "searching" || state === "starting") {
      setIsComplete(false);
      setIsFinishing(false);
    }

    // Если состояние finished и еще не начали завершающую анимацию
    if (state === "finished" && !isFinishing && !isComplete) {
      setIsFinishing(true);
      return;
    }

    // Если анимация завершена, останавливаем
    if (isComplete) {
      return;
    }

    // Если завершающая анимация достигла 100%
    if (isFinishing && displayProgress >= 100) {
      const timeout = setTimeout(() => {
        setIsComplete(true);
      }, 300);
      return () => clearTimeout(timeout);
    }

    // Если поиск начался и прогресс = 0, показываем начальное значение
    if (
      (state === "searching" || state === "starting") &&
      displayProgress === 0
    ) {
      setDisplayProgress(initialProgress);
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        // Не обновляем, если анимация завершена
        if (isComplete) return prev;

        // Если идет завершающая анимация
        if (isFinishing) {
          const remaining = 100 - prev;
          if (remaining <= 0) return 100;
          return prev + Math.max(1, remaining * 0.1);
        }

        // Если получили реальный прогресс и он больше текущего
        if (actualProgress > prev) {
          const diff = actualProgress - prev;
          // Быстрый, но плавный догон до actualProgress
          return prev + Math.max(0.8, diff * 0.3);
        }

        // Если идет поиск, очень медленно увеличиваем в начале
        if ((state === "searching" || state === "starting") && prev < 30) {
          // Очень медленное движение в начале
          return prev + 0.1;
        } else if (
          (state === "searching" || state === "starting") &&
          prev < 80
        ) {
          const remainingProgress = 80 - prev;
          // Постепенное замедление после 30%
          const increment = Math.max(0.05, remainingProgress * 0.01);
          return prev + increment;
        }

        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [
    isLoading,
    actualProgress,
    initialProgress,
    state,
    displayProgress,
    isFinishing,
    isComplete,
  ]);

  return displayProgress;
};

export const ProgressBar = () => {
  const { tourDataStatus, loading } = useContext(DataContext);
  const actualProgress = tourDataStatus?.progress || 0;
  const state = tourDataStatus?.state || "";
  const displayProgress = useProgressiveLoading(loading, actualProgress, state);

  if (
    !loading &&
    state !== "searching" &&
    state !== "starting" &&
    displayProgress === 0
  )
    return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 w-full bg-gray-200">
        <div
          className="h-1 bg-[#FF621F] transition-all duration-300 ease-out transform origin-left"
          style={{
            width: `${displayProgress}%`,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: displayProgress === 100 ? 0.8 : 1,
            transform: `scaleX(${displayProgress === 0 ? 0 : 1})`,
          }}
        />
      </div>
    </div>
  );
};
