import { useState, useEffect } from "react";

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
}

export default function Booking() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingForm>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  // Получаем параметры из URL
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const successParam = searchParams.get("success");

  // Получаем hotelcode и tourId из пути
  const matches = path.match(/\/hotel\/(\d+)\/(\d+)\/booking/);
  const hotelcode = matches?.[1];
  const tourId = matches?.[2];

  useEffect(() => {
    if (successParam === "true") {
      setIsSuccess(true);
    }
  }, [successParam]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Введите ФИО";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите телефон";
    } else if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = "Введите корректный номер телефона";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Здесь будет ваш API запрос для бронирования
      // const response = await api.createBooking({ ...formData, hotelcode, tourId })

      // После успешного бронирования
      window.location.href = `/hotel/${hotelcode}/${tourId}/booking?success=true`;
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setErrors({ ...errors, submit: "Произошла ошибка при бронировании" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Очищаем ошибку поля при изменении
    if (errors[name as keyof BookingForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
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
              onClick={() => (window.location.href = "/")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl 
              font-medium hover:bg-green-500 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Оформление бронирования
            </h1>

            <form onSubmit={handleBooking}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">ФИО</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите ваше полное имя"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+7 (___) ___-__-__"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
              )}

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
