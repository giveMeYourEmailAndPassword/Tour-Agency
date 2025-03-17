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

export default function OurTours() {
  const { tours, loading, error, tourDataStatus } = useContext(DataContext);
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const { formatDate } = useFormatDate();
  const [activeTabs, setActiveTabs] = useState<{
    [hotelcode: string]: "info" | "reviews" | "map" | null;
  }>({});

  if (loading) {
    return (
      <div className="flex flex-wrap gap-8 p-12 justify-center items-stretch bg-gray-50">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-[32rem] min-h-[45rem]">
            <Skeleton className="rounded-2xl w-full h-64 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-6 w-1/2 rounded-lg mt-2" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-1/2 rounded-lg" />
                <Skeleton className="h-10 w-1/2 rounded-lg" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3 rounded-lg" />
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="h-24 w-full rounded-lg" />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-5 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-24 rounded-lg" />
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

  const toggleTours = (hotelIndex: number) => {
    setExpandedCards((prev: { [key: number]: boolean }) => ({
      ...prev,
      [hotelIndex]: !prev[hotelIndex],
    }));
  };

  const toggleTab = (hotelcode: string, tab: "info" | "reviews" | "map") => {
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
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-500">Нет доступных туров</p>
      )}
    </div>
  );
}
