import { useState, useEffect } from "react";

interface BookingForm {
  fullName: string;
  phone: string;
}

interface BookingDetails {
  hotelName: string;
  departure: string;
  flyDate: string;
  nights: number;
  adults: string;
  price: string;
  currency: string;
}

export default function Booking() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingForm>({
    fullName: "",
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

  // Здесь мы будем получать данные о туре из API или из localStorage
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    hotelName: "",
    departure: "",
    flyDate: "",
    nights: 0,
    adults: "",
    price: "",
    currency: "",
  });

  useEffect(() => {
    if (successParam === "true") {
      setIsSuccess(true);
    }
  }, [successParam]);

  useEffect(() => {
    // Получаем сохраненные данные из localStorage
    const savedDetails = localStorage.getItem(`booking_${hotelcode}_${tourId}`);
    if (savedDetails) {
      setBookingDetails(JSON.parse(savedDetails));
    }
  }, [hotelcode, tourId]);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center mt-20">
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
        <div className="flex flex-col items-center justify-center w-[96vh] mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 pt-8 w-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Бронирование тура
              </h1>
            </div>

            {/* Информация о туре */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {bookingDetails.hotelName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Вылет из:</span>{" "}
                    {bookingDetails.departure}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Дата вылета:</span>{" "}
                    {bookingDetails.flyDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Количество ночей:</span>{" "}
                    {bookingDetails.nights}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Туристы:</span>{" "}
                    {bookingDetails.adults}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Стоимость:</span>{" "}
                    {bookingDetails.price}
                    {bookingDetails.currency === "EUR"
                      ? "€"
                      : bookingDetails.currency === "USD"
                      ? "$"
                      : bookingDetails.currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleBooking}>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-gray-700 mb-2">Ваше имя</label>
                  <div className="relative">
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
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="relative group">
                          <span className="text-red-500 text-xl">!</span>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                            <div className="bg-red-50 text-red-500 text-sm py-1 px-3 rounded-lg border border-red-200 whitespace-nowrap">
                              {errors.fullName}
                            </div>
                            <div className="absolute top-full right-3 -mt-1 border-t-8 border-x-8 border-t-red-50 border-x-transparent"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-gray-700 mb-2">
                    Номер телефона
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="+996 XXX XXX XXX"
                    />
                    {errors.phone && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="relative group">
                          <span className="text-red-500 text-xl">!</span>
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                            <div className="bg-red-50 text-red-500 text-sm py-1 px-3 rounded-lg border border-red-200 whitespace-nowrap">
                              {errors.phone}
                            </div>
                            <div className="absolute top-full right-3 -mt-1 border-t-8 border-x-8 border-t-red-50 border-x-transparent"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                Отправить заявку
              </button>

              <p className="text-gray-600 text-center mt-4">
                Нажимая кнопку "Отправить заявку", вы соглашаетесь с тем, что мы
                свяжемся с вами для подтверждения бронирования.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
