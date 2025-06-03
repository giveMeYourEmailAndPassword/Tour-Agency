import { useContext, useState } from "react";
import { DataContext } from "../../components/DataProvider";
import { GoStarFill } from "react-icons/go";
import { Skeleton } from "@heroui/react";
import { HotelImage } from "../../components/HotelImage";
import HeaderMOT from "./HeaderMOT";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HotelToursButton } from "../../components/HotelToursButton";
import MobileToursContent from "./MobileToursContent";

export default function MobileOurTours() {
  const {
    tours,
    loading,
    error,
    tourDataStatus,
    fetchNextPage,
    isFetchingNextPage,
    addToFavorite,
    removeFromFavorite,
    favoriteTours,
  } = useContext(DataContext);

  const [activeTabs, setActiveTabs] = useState<{ [key: string]: boolean }>({});

  const handleFavoriteClick = (hotelcode: string, tourId: string) => {
    const tourData = {
      hotelcode,
      tourId,
    };

    const isFavorite = favoriteTours.some(
      (tour) => tour.hotelcode === hotelcode && tour.tourId === tourId
    );

    if (isFavorite) {
      removeFromFavorite(hotelcode, tourId);
    } else {
      addToFavorite(tourData);
    }
  };

  const toggleTab = (hotelcode: string) => {
    setActiveTabs((prev) => ({
      ...prev,
      [hotelcode]: !prev[hotelcode],
    }));
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <HeaderMOT />
        <div className="flex flex-col gap-2 p-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <HeaderMOT />
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (
    tourDataStatus?.state === "finished" &&
    tourDataStatus?.toursfound === 0
  ) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <HeaderMOT />
        <div className="p-4 text-center text-gray-500">
          По вашему запросу ничего не найдено
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <HeaderMOT />
      <div className="flex flex-col gap-2 p-4">
        {tours.map((hotel, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-2 shadow-sm cursor-pointer"
            onClick={(e) => {
              // Предотвращаем всплытие события от кнопок
              if (!(e.target as HTMLElement).closest("button")) {
                toggleTab(hotel.hotelcode);
              }
            }}
          >
            <div className="flex gap-5">
              <div className="relative flex-shrink-0">
                <HotelImage
                  imageUrl={hotel.picturelink}
                  hotelName={hotel.hotelname}
                  hotelcode={hotel.hotelcode}
                  isMobile={true}
                />
                {hotel.hotelrating !== "0" && (
                  <span className="absolute -right-3.5 top-5 text-xs text-white border-2 border-white font-semibold bg-blue-500 py-0.5 px-1 rounded-lg">
                    {hotel.hotelrating.length === 1
                      ? `${hotel.hotelrating}.0`
                      : hotel.hotelrating}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col">
                  <div className="flex mt-2 mb-1">
                    {Array.from(
                      { length: hotel.hotelstars === 0 ? 3 : hotel.hotelstars },
                      (_, index) => (
                        <GoStarFill
                          key={index}
                          className="w-4 h-4 text-yellow-500"
                        />
                      )
                    )}
                  </div>
                  <h2 className="text-lg font-semibold leading-tight">
                    {hotel.hotelname}
                  </h2>
                  <p className="text-gray-600 text-sm leading-tight">
                    {hotel.regionname}
                    {hotel.subregionname == 0 ? "" : `, ${hotel.subregionname}`}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-black text-lg font-semibold">
                    <span className="text-black text-base">Туры от</span>{" "}
                    {hotel.price}
                    {hotel.currency === "EUR"
                      ? "€"
                      : hotel.currency === "USD"
                      ? "$"
                      : hotel.currency}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем всплытие события
                        handleFavoriteClick(
                          hotel.hotelcode,
                          hotel.tours.tour[0].tourid
                        );
                      }}
                      className="flex items-center justify-center w-8 h-8 border-2 rounded-full transition-colors"
                    >
                      {favoriteTours.some(
                        (tour) =>
                          tour.hotelcode === hotel.hotelcode &&
                          tour.tourId === hotel.tours.tour[0].tourid
                      ) ? (
                        <FaHeart className="text-red-500 text-lg" />
                      ) : (
                        <FaRegHeart className="text-blue-600 text-lg" />
                      )}
                    </button>

                    <HotelToursButton
                      onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем всплытие события
                        toggleTab(hotel.hotelcode);
                      }}
                      isActive={activeTabs[hotel.hotelcode]}
                      isMobile={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            {activeTabs[hotel.hotelcode] && (
              <MobileToursContent
                tours={hotel.tours.tour}
                hotelcode={hotel.hotelcode}
              />
            )}
          </div>
        ))}

        {tourDataStatus?.state === "finished" &&
          tours.length < tourDataStatus?.hotelsfound && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 mt-4"
            >
              {isFetchingNextPage ? "Загрузка..." : "Показать еще туры"}
            </button>
          )}
      </div>
    </div>
  );
}
