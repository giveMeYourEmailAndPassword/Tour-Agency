import { useContext, useEffect, useState } from "react";
import OurTours from "./OurTours/OurTours";
import MobileOurTours from "./MobileOurTours/MobileOurTours";
import { DataContext } from "../components/DataProvider";

const useProgressiveLoading = (isLoading: boolean, actualProgress: number) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [initialProgress] = useState(() => Math.floor(Math.random() * 16) + 15); // 15-30%

  useEffect(() => {
    if (!isLoading) {
      // Плавно скрываем прогресс-бар
      const timeout = setTimeout(() => {
        setDisplayProgress(0);
      }, 300);
      return () => clearTimeout(timeout);
    }

    // При старте загрузки показываем начальный прогресс
    setDisplayProgress(initialProgress);

    // Медленное автоматическое увеличение
    const autoIncrement = setInterval(() => {
      setDisplayProgress((prev) => {
        // Если реальный прогресс больше текущего, догоняем его
        if (actualProgress > prev) {
          return actualProgress;
        }

        // Иначе медленно растем до 80%
        if (prev < 80) {
          // Чем ближе к 80%, тем медленнее растем
          const remainingProgress = 80 - prev;
          const increment = Math.max(0.2, remainingProgress * 0.03);
          return prev + increment;
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(autoIncrement);
  }, [isLoading, actualProgress, initialProgress]);

  return displayProgress;
};

const ProgressBar = () => {
  const { tourDataStatus, loading } = useContext(DataContext);
  const actualProgress = tourDataStatus?.progress || 0;
  const displayProgress = useProgressiveLoading(loading, actualProgress);

  if (!loading && actualProgress === 0) return null;

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

const ResponsiveOurTours = () => {
  return (
    <>
      <ProgressBar />
      <div className="hidden md:block">
        <OurTours />
      </div>
      <div className="block md:hidden">
        <MobileOurTours />
      </div>
    </>
  );
};

export default ResponsiveOurTours;
