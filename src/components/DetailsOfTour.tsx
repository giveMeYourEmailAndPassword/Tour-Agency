import { useState } from "react";
import { useParams } from "react-router-dom";

interface DetailsOfTourProps {
  tour: any;
}

export const DetailsOfTour = ({ tour }: DetailsOfTourProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex px-8 py-1 bg-slate-200 rounded-full font-medium text-black hover:bg-green-600/80 transition-colors"
      >
        {tour.price}
        {tour.currency === "EUR"
          ? "€"
          : tour.currency === "USD"
          ? "$"
          : tour.currency}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-6xl mx-4 my-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-50"
            >
              <span className="text-2xl">✕</span>
            </button>

            <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 rounded-2xl">
              {/* Информация о туре */}
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Информация о туре
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Тур</h3>
                      <p className="text-lg">{tour.tourname}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Туроператор</h3>
                      <p className="text-lg">{tour.operatorname}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Дата вылета</h3>
                    <p className="text-lg">{tour.flydate}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Длительность</h3>
                    <p className="text-lg">{tour.nights} ночей</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Питание</h3>
                    <p className="text-lg">{tour.mealrussian}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Размещение</h3>
                    <p className="text-lg">{tour.room}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Количество гостей
                    </h3>
                    <p className="text-lg">{tour.adults} взр.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Стоимость</h3>
                  <p className="text-2xl font-semibold text-orange-500">
                    {tour.price}
                    {tour.currency === "EUR"
                      ? "€"
                      : tour.currency === "USD"
                      ? "$"
                      : tour.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
