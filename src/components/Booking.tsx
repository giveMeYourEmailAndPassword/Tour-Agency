import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingPanel from "./BookingPanel";

export default function Booking() {
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Здесь будет логика обработки бронирования
  const handleBooking = async () => {
    try {
      // Здесь будет ваш API запрос для бронирования
      // const response = await api.createBooking(...)

      // Временно имитируем успешное бронирование
      setIsSuccess(true);
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center pt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
              Бронирование успешно выполнено!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Спасибо за ваш выбор! Детали бронирования отправлены на вашу
              почту.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl 
              font-medium hover:bg-green-500 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Оформление бронирования
            </h1>

            {/* Здесь форма бронирования */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking();
              }}
            >
              {/* Поля формы */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">ФИО</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Введите ваше полное имя"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Введите ваш email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white 
                rounded-xl font-medium hover:bg-blue-500 transition-colors"
              >
                Подтвердить бронирование
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
