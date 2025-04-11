import { useState } from "react";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { format, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { PiMapPinFill } from "react-icons/pi";
import { ImCalendar } from "react-icons/im";
import { IoMoonOutline } from "react-icons/io5";
import { FaUtensils, FaHome, FaBed } from "react-icons/fa";
import { IoClose, IoAirplane } from "react-icons/io5";
import { CircularProgress } from "@heroui/react";

interface Tour {
  price: number;
  nights: number;
  operatorcode: number;
  operatorname: string;
  flydate: string;
  placement: string;
  adults: number;
  child: number;
  room: string;
  tourname: string;
  regular: number;
  hotelstatus: number;
  mealcode: number;
  mealrussian: string;
  meal: string;
  tourid: string;
  currency: string;
  priceue: number;
  visa: number;
  fuelcharge: number;
  hotelcode?: number;
  departurename?: string;
  hotelregionname?: string;
}

interface DetailsOfTourProps {
  tour: Tour;
  hotelcode: number;
}

export const DetailsOfTour = ({ tour, hotelcode }: DetailsOfTourProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useHotelDetails(
    hotelcode.toString(),
    tour.tourid,
    isModalOpen
  );

  const formatDate = (dateString: string) => {
    const date = parse(dateString, "dd.MM.yyyy", new Date());
    return format(date, "d MMMM", { locale: ru });
  };

  const getMealType = (meal: string) => {
    const mealTypes = {
      RO: "Без питания",
      BB: "Только завтрак",
      HB: "Завтрак, ужин",
      FB: "Полный пансион",
      AI: "Все включено",
      UAI: "Ультра все включено",
    };
    return mealTypes[meal as keyof typeof mealTypes] || meal;
  };

  const hotel = data?.hotel?.data?.hotel;
  const tourInfo = data?.tour?.data?.tour;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{hotel?.hotelname}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <CircularProgress color="default" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold">
                        Информация о туре
                      </h2>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <ImCalendar />
                          <p className="text-black">
                            {formatDate(tourInfo.flydate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <IoMoonOutline />
                          <p className="text-black">{tourInfo.nights} ночей</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaUtensils />
                          <p className="text-black">
                            {getMealType(tourInfo.meal)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold">Размещение</h3>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <FaHome />
                          <p className="text-black">{tourInfo.room}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaBed />
                          <p className="text-black">
                            {tourInfo.placement === "2 взрослых"
                              ? "Два взрослых"
                              : tourInfo.placement}
                          </p>
                        </div>
                      </div>
                    </div>

                    {tourInfo.departurename && tourInfo.hotelregionname && (
                      <div className="flex flex-col w-96">
                        <h3 className="text-lg font-semibold">Перелет</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <IoAirplane className="-rotate-45" />
                            {`${tour.departurename} - ${tour.hotelregionname}`}
                          </div>
                          <p className="text-black">
                            {formatDate(tourInfo.flydate)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex w-full justify-end">
                      <p className="text-black flex gap-2 items-baseline text-xl font-semibold">
                        за двоих
                        <span className="text-2xl text-orange-500 font-bold">
                          {tourInfo.price}
                          {tourInfo.currency === "EUR"
                            ? "€"
                            : tourInfo.currency === "USD"
                            ? "$"
                            : tourInfo.currency}
                        </span>
                      </p>
                    </div>
                  </div>

                  {data?.result?.hotel?.[0] && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-xl font-bold mb-4">
                        Информация об отеле
                      </h3>
                      <div className="prose max-w-none space-y-4">
                        <div>
                          <p className="font-medium">Название:</p>
                          <p>{hotel?.hotelname}</p>
                        </div>
                        <div>
                          <p className="font-medium">Рейтинг:</p>
                          <p>
                            {hotel?.hotelstars}★ ({hotel?.hotelrating})
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Расположение:</p>
                          <p>
                            {hotel?.countryname}, {hotel?.regionname},{" "}
                            {hotel?.subregionname}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Описание:</p>
                          <p>{hotel?.hoteldescription}</p>
                        </div>
                        {hotel?.picturelink && (
                          <div>
                            <img
                              src={hotel?.picturelink}
                              alt={hotel?.hotelname}
                              className="rounded-lg w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
