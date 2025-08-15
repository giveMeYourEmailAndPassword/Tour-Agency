import { useContext, useEffect, useState } from "react";
import { DataContext } from "../DataProvider";

const useProgressiveLoading = (
  isLoading: boolean,
  actualProgress: number,
  state: string
) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [initialProgress] = useState(() => Math.floor(Math.random() * 16) + 15);

  useEffect(() => {
    // Сбрасываем прогресс только когда поиск действительно завершен
    if (!isLoading && state !== "searching") {
      setDisplayProgress(0);
      return;
    }

    // Если поиск начался и прогресс = 0, показываем начальное значение
    if (state === "searching" && displayProgress === 0) {
      setDisplayProgress(initialProgress);
      return;
    }

    // Обновляем прогресс только если:
    // 1. Идет поиск (state === 'searching')
    // 2. Реальный прогресс больше текущего
    // 3. Состояние не finished
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        // Если получили реальный прогресс и он больше текущего
        if (actualProgress > prev) {
          return actualProgress;
        }

        // Если идет поиск, медленно увеличиваем
        if (state === "searching" && prev < 80) {
          const remainingProgress = 80 - prev;
          const increment = Math.max(0.2, remainingProgress * 0.03);
          return prev + increment;
        }

        // Если поиск завершен, показываем 100%
        if (state === "finished") {
          return 100;
        }

        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, actualProgress, initialProgress, state, displayProgress]);

  return displayProgress;
};

export const ProgressBar = () => {
  const { tourDataStatus, loading } = useContext(DataContext);
  const actualProgress = tourDataStatus?.progress || 0;
  const state = tourDataStatus?.state || "";
  const displayProgress = useProgressiveLoading(loading, actualProgress, state);

  // Показываем прогресс-бар только во время поиска
  if (state !== "searching" && !loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 w-full bg-gray-200">
        <div
          className="h-1 bg-[#FF621F] transition-all duration-700 ease-out"
          style={{
            width: `${displayProgress}%`,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
};
