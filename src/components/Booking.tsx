import { useState, useEffect } from "react";
import Header from "./Header";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface BookingForm {
  fullName: string;
  phone: string;
}

interface BookingDetails {
  hotelName: string;
  departure: string;
  flyDate: string;
  nights: number;
  adults: number; // ← Изменить с string на number
  price: number; // ← Изменить с string на number
  currency: string;
  country: string;
  region: string;
  mealType: string; // Тип питания
  roomType?: string; // Тип номера (опционально)
  hotelcode?: string; // добавляем поле
  operatorLink?: string; // добавляем поле
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
    adults: 0, // ← Изменить с "" на 0
    price: 0, // ← Изменить с "" на 0
    currency: "",
    country: "",
    region: "",
    mealType: "",
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
      const parsed = JSON.parse(savedDetails);
      // Убеждаемся, что числовые поля действительно числа
      setBookingDetails({
        ...parsed,
        nights: Number(parsed.nights) || 0,
        adults: Number(parsed.adults) || 0,
        price: Number(parsed.price) || 0,
      });
    }
  }, [hotelcode, tourId]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Введите ФИО";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите телефон";
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
      // Форматируем телефон в правильный формат (убираем пробелы, скобки и дефисы)
      const formattedPhone = formData.phone.replace(/[\s\(\)-]/g, "");

      // Форматируем дату в формат YYYY-MM-DD
      const [day, month, year] = bookingDetails.flyDate.split(".");
      const formattedDate = `${year}-${month}-${day}`;

      const bookingRequestData = {
        // Информация о клиенте
        clientName: formData.fullName,
        clientPhone: formattedPhone,

        // Информация о туре
        tourId: tourId || "",
        hotelName: bookingDetails.hotelName,
        country: bookingDetails.country,
        region: bookingDetails.region,
        hotelcode: bookingDetails.hotelcode,
        operatorLink: bookingDetails.operatorLink,

        // Детали поездки
        departure: bookingDetails.departure,
        flyDate: formattedDate, // Отформатированная дата
        nights: bookingDetails.nights,
        adults: bookingDetails.adults, // Только цифры
        mealType: bookingDetails.mealType || undefined,
        roomType: bookingDetails.roomType || undefined,

        // Стоимость
        price: bookingDetails.price,
        currency: bookingDetails.currency,
      };

      // Отправляем запрос на бэкенд
      const response = await fetch(`${API_BASE_URL}/booking/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequestData),
      });

      if (!response.ok) {
        // Получаем детали ошибки
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при отправке заявки");
      }

      // Очищаем данные из localStorage после успешной отправки
      localStorage.removeItem(`booking_${hotelcode}_${tourId}`);

      // После успешного бронирования
      window.location.href = `/hotel/${hotelcode}/${tourId}/booking?success=true`;
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setErrors({
        ...errors,
        submit:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при бронировании",
      });
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
    <div className="bg-gray-100 md:bg-white min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center py-[10%] md:py-12">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-4 md:p-0 py-[40%] md:py-[10%]">
            <div className="bg-white p-4 md:p-8 rounded-lg md:rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-green-600 text-center mb-2 md:mb-4">
                Бронирование успешно выполнено!
              </h2>
              <p className="text-gray-600 text-center mb-2 md:mb-6">
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
          <div className="flex flex-col items-center justify-center w-full  md:w-[96vh] md:mx-auto p-4 md:px-4">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 md:pt-8 w-full">
              <div className="flex flex-col mb-2 md:mb-6">
                <h1 className="text-2xl font-bold text-gray-900 ">
                  Бронирование тура
                </h1>
                <h2 className="text-lg font-semibold text-gray-800">
                  {bookingDetails.hotelName}
                </h2>
                <p className="text-gray-600 text-lg">
                  {bookingDetails.country}, {bookingDetails.region}
                </p>
              </div>

              {/* Информация о туре */}
              <div className="bg-gray-50 p-4 rounded-lg mb-2 md:mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Вылет из:</span>{" "}
                      {bookingDetails.departure}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Дата вылета:</span>{" "}
                      {bookingDetails.flyDate}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Туристы:</span>{" "}
                      {bookingDetails.adults}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Количество ночей:</span>{" "}
                      {bookingDetails.nights}
                    </p>
                  </div>
                </div>
              </div>

              {/* Форма */}
              <form onSubmit={handleBooking}>
                <div className="space-y-2 md:space-y-4">
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
                        placeholder="Введите ваше имя"
                      />
                      {errors.fullName && (
                        <>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-red-500 text-xl">!</span>
                          </div>
                          <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg py-1 px-3 z-10">
                            <div className="flex items-center">
                              <span className="text-amber-500 text-xl mr-2">
                                !
                              </span>
                              <span className="text-gray-700">
                                Заполните это поле.
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="relative mt-8">
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
                        <>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-red-500 text-xl">!</span>
                          </div>
                          <div className="absolute top-full mt-1 bg-white border rounded-md shadow-lg py-1 px-3 z-10">
                            <div className="flex items-center">
                              <span className="text-amber-500 text-xl mr-2">
                                !
                              </span>
                              <span className="text-gray-700">
                                {errors.phone === "Введите телефон"
                                  ? "Заполните это поле."
                                  : "Введите корректный номер телефона."}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center mt-2">
                    <p className="text-gray-600 font-medium">Стоимость тура:</p>
                    <p className="text-orange-500 font-bold text-3xl md:text-4xl">
                      {typeof bookingDetails.price === "number"
                        ? bookingDetails.price
                        : 0}
                      {bookingDetails.currency === "EUR"
                        ? "€"
                        : bookingDetails.currency === "USD"
                        ? "$"
                        : bookingDetails.currency}
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="mt-6 w-54 px-6 py-3 bg-[#FF621F] text-white 
                rounded-xl font-medium hover:bg-[#FF621F] transition-colors"
                  >
                    Отправить заявку
                  </button>
                </div>

                <p className="text-gray-600 text-center mt-4">
                  Нажимая кнопку "Отправить заявку", вы соглашаетесь с тем, что
                  мы свяжемся с вами для подтверждения бронирования.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
