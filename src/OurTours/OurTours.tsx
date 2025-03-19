import { useContext, useState } from "react";
import { DataContext } from "../components/DataProvider";
import { GoStarFill } from "react-icons/go";
import { useFormatDate } from "../Hooks/useFormatDate";
import { Skeleton } from "@heroui/react";
import { HotelImage } from "../components/HotelImage";
import { HotelInfoButton } from "../components/HotelInfoButton";
import { HotelInfoContent } from "../components/HotelInfoContent";
import { HotelReviewsButton } from "../components/HotelReviewsButton";
import { HotelReviewsContent } from "../components/HotelReviewsContent";
import { HotelMapContent } from "../components/HotelMapContent";
import { HotelMapButton } from "../components/HotelMapButton";
import { HotelToursButton } from "../components/HotelToursButton";
import { HotelToursContent } from "../components/HotelToursContent";

export default function OurTours() {
  const { tours, loading, error, tourDataStatus } = useContext(DataContext);
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const { formatDate } = useFormatDate();
  const [activeTabs, setActiveTabs] = useState<{
    [hotelcode: string]: "info" | "reviews" | "map" | "tour" | null;
  }>({});

  if (loading) {
    return (
      <div className="flex flex-wrap gap-8 p-12 justify-center items-stretch bg-gray-50">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-sm transition-shadow duration-300 rounded-2xl flex flex-col w-[55rem]"
          >
            <div className="flex gap-5">
              <div className="w-[19rem] h-[14rem]">
                <Skeleton className="rounded-lg w-full h-full" />
              </div>

              <div className="flex flex-col w-full justify-center">
                <div className="flex">
                  <div>
                    <div className="flex flex-col mt-1">
                      <Skeleton className="h-7 w-64 rounded-lg mb-2" />
                      <Skeleton className="h-5 w-48 rounded-lg" />
                    </div>
                    <div className="flex flex-col mt-1">
                      <Skeleton className="h-7 w-64 rounded-lg mb-2" />
                      <Skeleton className="h-5 w-48 rounded-lg" />
                    </div>
                    <div className="mt-4">
                      <div className="flex gap-2 items-center mb-2">
                        <Skeleton className="h-6 w-10 rounded-lg" />
                        <Skeleton className="h-6 w-[90%] rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-black flex items-center justify-center text-3xl">
        {error}
      </p>
    );
  }

  console.log(tourDataStatus);

  const toggleTab = (
    hotelcode: string,
    tab: "info" | "reviews" | "map" | "tour"
  ) => {
    setActiveTabs((prev) => ({
      ...prev,
      [hotelcode]: prev[hotelcode] === tab ? null : tab,
    }));
  };

  return (
    <div className="flex flex-wrap gap-8 p-12 justify-center items-stretch bg-gray-50">
      {tours.length && tours[0]?.tours?.tour ? (
        tours.map((hotel, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-sm transition-shadow duration-300 rounded-2xl flex flex-col w-[55rem]"
          >
            <div className="flex gap-5">
              <HotelImage
                imageUrl={hotel.picturelink}
                hotelName={hotel.hotelname}
                hotelcode={hotel.hotelcode}
              />

              <div className="flex flex-col w-full justify-center">
                <div className="flex">
                  <div>
                    <div className="flex flex-col mt-1">
                      <div className="flex">
                        {Array.from(
                          {
                            length:
                              hotel.hotelstars === 0 ? 3 : hotel.hotelstars,
                          },
                          (_, index) => (
                            <GoStarFill
                              key={index}
                              className="w-4 h-4 text-yellow-500"
                            />
                          )
                        )}
                      </div>
                      <h2 className="text-xl font-bold">{hotel.hotelname}</h2>
                      <p className="text-gray-600">
                        {hotel.regionname}
                        {hotel.subregionname == 0
                          ? ""
                          : `, ${hotel.subregionname}`}
                      </p>
                    </div>
                    <div className="mt-4 h-[4.7rem]">
                      <p className="text-gray-700 text-sm">
                        {hotel.hotelrating !== "0" && (
                          <span className="text-sm text-white font-medium bg-blue-400 py-0.5 px-1 rounded-lg mr-1">
                            {hotel.hotelrating.length === 1
                              ? `${hotel.hotelrating}.0`
                              : hotel.hotelrating}
                          </span>
                        )}
                        {hotel.hoteldescription}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <HotelInfoButton
                        onClick={() => toggleTab(hotel.hotelcode, "info")}
                        isActive={activeTabs[hotel.hotelcode] === "info"}
                      />
                      <HotelReviewsButton
                        onClick={() => toggleTab(hotel.hotelcode, "reviews")}
                        isActive={activeTabs[hotel.hotelcode] === "reviews"}
                      />
                      <HotelMapButton
                        onClick={() => toggleTab(hotel.hotelcode, "map")}
                        isActive={activeTabs[hotel.hotelcode] === "map"}
                      />
                    </div>

                    <div className="flex gap-4 items-center">
                      <p className="text-black text-lg font-semibold">
                        {hotel.price}
                        {hotel.currency === "EUR"
                          ? "€"
                          : hotel.currency === "USD"
                          ? "$"
                          : hotel.currency}
                      </p>
                      <HotelToursButton
                        onClick={() => toggleTab(hotel.hotelcode, "tour")}
                        isActive={activeTabs[hotel.hotelcode] === "tour"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {activeTabs[hotel.hotelcode] === "info" && (
                <HotelInfoContent hotelcode={hotel.hotelcode} />
              )}
              {activeTabs[hotel.hotelcode] === "reviews" && (
                <HotelReviewsContent hotelcode={hotel.hotelcode} />
              )}
              {activeTabs[hotel.hotelcode] === "map" && (
                <HotelMapContent hotelcode={hotel.hotelcode} />
              )}
              {activeTabs[hotel.hotelcode] === "tour" && (
                <HotelToursContent tours={hotel.tours.tour} />
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500">Нет доступных туров</p>
      )}
    </div>
  );
}
