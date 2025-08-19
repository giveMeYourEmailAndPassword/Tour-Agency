import { useContext, useState, useEffect } from "react";
import { DataContext } from "../DataProvider";
import { Progress } from "@heroui/react";

export const ProgressBar = () => {
  const { tourDataStatus, isSearching } = useContext(DataContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dots, setDots] = useState(".");
  const progress = tourDataStatus?.progress || 0;
  const state = tourDataStatus?.state || "";

  // Сбрасываем состояние при начале нового поиска
  useEffect(() => {
    if (isSearching) {
      setIsCompleted(false);
      setDots(".");
    }
  }, [isSearching]);

  useEffect(() => {
    if (state === "finished") {
      setIsCompleted(true);
    }
  }, [state]);

  useEffect(() => {
    if (!isCompleted) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev === "...") return ".";
          if (prev === "..") return "...";
          return "..";
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isCompleted]);

  return (
    <div className="w-full rounded-xl z-50 px-4 pb-6 bg-gray-100">
      <div className="text-base font-medium text-gray-500 text-center w-full mb-2">
        {isCompleted ? (
          "Мы нашли для вас лучшие варианты"
        ) : (
          <>Идёт поиск отелей{dots}</>
        )}
      </div>
      <Progress
        value={isCompleted ? 100 : progress}
        color="warning"
        size="sm"
        className="rounded-none"
        aria-label={isCompleted ? "Поиск завершен" : "Прогресс поиска отелей"}
      />
    </div>
  );
};
