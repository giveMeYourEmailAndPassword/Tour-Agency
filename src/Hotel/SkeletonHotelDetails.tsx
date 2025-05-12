import { Skeleton } from "@heroui/react";
import Header from "../components/Header";
import FloatingControls from "../components/FloatingControls";
import BookingPanel from "../components/BookingPanel";

export default function SkeletonHotelDetails() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div
        className="flex flex-col py-8 max-w-[1560px] mx-auto px-4 md:px-8 lg:px-12 xl:px-36
       min-h-screen"
      >
        {/* Обертка для слайдера и информации */}
        <div className="flex gap-2 h-[420px]">
          {/* Скелетон галереи */}
          <div className="relative w-[61%] h-full">
            <Skeleton className="h-full rounded-2xl" />
          </div>

          {/* Скелетон блока с информацией справа */}
          <div className="w-[40%] bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] h-full">
            <div className="flex justify-center gap-3 my-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="h-[calc(100%-60px)] px-2 pb-2">
              <Skeleton className="h-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Скелетон заголовка и рейтинга */}
        <div className="flex flex-col py-4">
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded-full" />
              <Skeleton className="h-10 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-64 mt-2" />
        </div>

        {/* Скелетон информации о туре */}
        <div className="container mx-auto pb-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-6">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>

            {/* Скелетон размещения */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-36" />
              <div className="flex gap-6">
                <Skeleton className="h-10 w-40 rounded-xl" />
                <Skeleton className="h-10 w-40 rounded-xl" />
              </div>
            </div>

            {/* Скелетон перелета */}
            <div className="space-y-4 w-[50%]">
              <Skeleton className="h-7 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>

            {/* Скелетон цены */}
            <div className="flex justify-end pt-4">
              <Skeleton className="h-14 w-36 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Скелетон описания и аккордеона */}
        <div className="container mx-auto pb-14">
          <div className="flex flex-col py-2">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Скелетон аккордеона */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2">
                  <Skeleton className="h-6 w-full mb-2" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-2">
                  <Skeleton className="h-6 w-full mb-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Добавляем скелетон панели бронирования */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_3px_12px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-[1420px] mx-auto px-28 py-3 flex items-center justify-between">
            {/* Информация о туре */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-16 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-16 h-6" />
              </div>
            </div>

            {/* Цена и кнопки */}
            <div className="flex items-center gap-6">
              {/* Цена */}
              <div className="flex flex-col items-end">
                <Skeleton className="w-16 h-4 mb-1" />
                <Skeleton className="w-28 h-7" />
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <Skeleton className="w-40 h-12 rounded-xl" />
                <Skeleton className="w-32 h-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <FloatingControls />
      </div>
    </div>
  );
}
