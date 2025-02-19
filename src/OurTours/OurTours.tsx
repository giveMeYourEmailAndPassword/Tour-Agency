import { useContext } from "react";
import { DataContext } from "../components/DataProvider";
import { GoStarFill } from "react-icons/go";

export default function OurTours() {
  const { tours, loading, error } = useContext(DataContext);

  if (loading) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        Загрузка туров...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        {error}
      </p>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        Туры не найдены
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 p-8 justify-center ">
      {tours.length > 0 ? (
        tours.map((hotel, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-md flex flex-col w-[30rem]"
          >
            <img
              src={hotel.picturelink || "/placeholder.jpg"}
              alt={hotel.hotelname}
              width={320}
              height={200}
              className="rounded-lg"
            />
            <div className="flex flex-col gap-1 mt-2">
              <div>
                <p className="text-black font-semibold">{hotel.hotelname}</p>
                <p className="text-black">{hotel.regionname}</p>
              </div>
              <p className="text-black">
                {hotel.hoteldescription || "Нет описания"}
              </p>
              <p className="text-black">
                От{" "}
                <span className="font-bold">
                  {hotel.price ? `$${hotel.price}` : "Цена не указана"}
                </span>{" "}
                за человека
              </p>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <GoStarFill
                    key={index}
                    color={index < hotel.hotelstars ? "gold" : "gray"}
                  />
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Нет доступных туров</p>
      )}
    </div>
  );
}
