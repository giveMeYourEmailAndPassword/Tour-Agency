import { useContext, useState, useMemo } from "react";
import { DataContext } from "../components/DataProvider";
import { GoStarFill } from "react-icons/go";
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
import Header from "../components/Header";
import OurToursFilters from "../OurTours/FiltersForOurTours/OurToursFilter";
import {
  getCityDeclension,
  getCountryDeclension,
} from "../OurTours/PronounsOfTheCountry/PronounsOfTheCountry";
import FloatingControls from "../components/FloatingControls";

export default function OurToursForManager() {
  const {
    tours,
    loading,
    error,
    tourDataStatus,
    cities,
    countries,
    params,
    fetchNextPage,
    isFetchingNextPage,
    countryResults,
  } = useContext(DataContext);

  // Добавляем состояние для активной страны
  const [activeCountry, setActiveCountry] = useState<string>(
    params.param2 || ""
  );

  // Состояние для табов отелей
  const [activeTabs, setActiveTabs] = useState<{
    [hotelcode: string]: "info" | "reviews" | "map" | "tour" | null;
  }>({});

  // Изменим получение доступных стран
  const availableCountries = useMemo(() => {
    if (!countryResults) return [];

    return Object.entries(countryResults)
      .filter(([_, data]) => data?.data?.result?.hotel?.length > 0)
      .map(([countryId]) => countryId);
  }, [countryResults]);

  // Функция для переключения страны
  const handleCountryChange = (countryId: string) => {
    setActiveCountry(countryId);
    setActiveTabs({}); // Сбрасываем активные табы при смене страны
  };

  // Получаем выбранный город и страну
  const selectedCity =
    cities.find((city) => city.id === params?.param1)?.label || "";
  const selectedCountry =
    countries.find((country) => country.id === params?.param2)?.label || "";

  // Формируем заголовок
  const title = selectedCity
    ? `Туры ${
        selectedCountry && countries.length > 0
          ? `в ${getCountryDeclension(selectedCountry, "to")}`
          : "(Выберите страну)"
      } из ${getCityDeclension(selectedCity, "from")}`
    : "\u00A0".repeat(14);

  // Проверяем наличие стран
  if (countries.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="w-full bg-blue-500">
          <div className="max-w-[1560px] mx-auto mb-8">
            <div className="flex flex-col gap-12 h-96 pt-12">
              {/* Пустой div для сохранения высоты */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="w-full bg-blue-500">
          <div className="max-w-[1560px] md:mx-auto mb-8">
            <div className="flex flex-col gap-12 h-96 pt-12">
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold max-w-[80rem] px-4 md:px-36">
                Для менеджеров <br />
                {title}
              </h1>
              <OurToursFilters />
            </div>
          </div>
        </div>
        <div className="max-w-[1560px] flex flex-wrap gap-4 justify-center items-center mx-auto pb-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-sm transition-shadow duration-300 rounded-2xl flex flex-col w-[62rem]"
            >
              <div className="flex gap-5">
                <div className="w-[19rem] h-52">
                  <Skeleton className="rounded-lg w-full h-full" />
                </div>

                <div className="flex flex-col w-full justify-center">
                  <div className="flex">
                    <div>
                      <div className="flex flex-col mt-1">
                        <Skeleton className="h-7 w-96 rounded-lg mb-2" />
                        <Skeleton className="h-5 w-[30rem] rounded-lg" />
                      </div>
                      <div className="flex flex-col mt-1">
                        <Skeleton className="h-7 w-64 rounded-lg mb-2" />
                        <Skeleton className="h-5 w-[30rem] rounded-lg" />
                      </div>
                      <div className="mt-4">
                        <div className="flex gap-2 items-center mb-2">
                          <Skeleton className="h-6 w-16 rounded-lg" />
                          <Skeleton className="h-6 w-[100%] rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <FloatingControls />
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

  if (
    tourDataStatus?.state === "finished" &&
    tourDataStatus?.toursfound === 0
  ) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="w-full bg-blue-500">
          <div className="max-w-[1560px] mx-auto mb-8">
            <div className="flex flex-col gap-12 h-96 pt-12">
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-semibold md:font-bold max-w-[80rem] px-4 md:px-36">
                Для менеджеров <br />
                {title}
              </h1>
              <div className="hidden md:block">
                <OurToursFilters />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1560px] min-h-[40vh] flex flex-wrap gap-4 p-12 justify-center items-center mx-auto">
          <p className="text-xl text-gray-500 mt-[-80px]">
            По вашему запросу ничего не найдено
          </p>
        </div>
      </div>
    );
  }

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
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="w-full bg-blue-500">
        <div className="max-w-[1560px] mx-auto mb-8">
          <div className="flex flex-col gap-12 h-96 pt-12">
            {countries.length > 0 && (
              <h1 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold max-w-[80rem] px-4 md:px-36">
                Для менеджеров <br />
                {title}
              </h1>
            )}
            <div className="hidden md:block">
              <OurToursFilters />
            </div>
          </div>
        </div>
      </div>

      {/* Изменим отображение табов стран */}
      <div className="max-w-[1560px] mx-auto mt-4 mb-8">
        <div className="flex gap-2 px-4 border-b">
          {Object.keys(countryResults || {}).map((countryId) => {
            const country = countries.find((c) => c.id === countryId);
            const hotelCount =
              countryResults[countryId]?.data?.result?.hotel?.length || 0;

            return (
              <button
                key={countryId}
                onClick={() => handleCountryChange(countryId)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                  ${
                    activeCountry === countryId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {country?.label || countryId} ({hotelCount})
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1560px] flex flex-wrap gap-4 justify-center items-center mx-auto pb-8">
        {loading ? (
          // Скелетон загрузки
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-sm transition-shadow duration-300 rounded-2xl flex flex-col w-[62rem]"
            >
              <div className="flex gap-5">
                <div className="w-[19rem] h-52">
                  <Skeleton className="rounded-lg w-full h-full" />
                </div>
                <div className="flex flex-col w-full justify-center">
                  <div className="flex">
                    <div>
                      <div className="flex flex-col mt-1">
                        <Skeleton className="h-7 w-96 rounded-lg mb-2" />
                        <Skeleton className="h-5 w-[30rem] rounded-lg" />
                      </div>
                      <div className="flex flex-col mt-1">
                        <Skeleton className="h-7 w-64 rounded-lg mb-2" />
                        <Skeleton className="h-5 w-[30rem] rounded-lg" />
                      </div>
                      <div className="mt-4">
                        <div className="flex gap-2 items-center mb-2">
                          <Skeleton className="h-6 w-16 rounded-lg" />
                          <Skeleton className="h-6 w-[100%] rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : countryResults && Object.keys(countryResults).length > 0 ? (
          activeCountry &&
          countryResults[activeCountry]?.data?.result?.hotel ? (
            // Отображение отелей для выбранной страны
            countryResults[activeCountry].data.result.hotel.map(
              (hotel, index) => (
                <div
                  key={index}
                  className="p-4 bg-white shadow-sm transition-shadow duration-300 rounded-xl flex flex-col w-[62rem]"
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
                                    hotel.hotelstars === 0
                                      ? 3
                                      : hotel.hotelstars,
                                },
                                (_, index) => (
                                  <GoStarFill
                                    key={index}
                                    className="w-4 h-4 text-yellow-500"
                                  />
                                )
                              )}
                            </div>
                            <h2 className="text-xl font-bold">
                              {hotel.hotelname}
                            </h2>
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
                                <span className="text-sm text-white font-medium bg-blue-500 py-0.5 px-1 rounded-lg mr-1">
                                  {hotel.hotelrating.length === 1
                                    ? `${hotel.hotelrating}.0`
                                    : hotel.hotelrating}
                                </span>
                              )}
                              {hotel.hoteldescription.length > 300
                                ? `${hotel.hoteldescription.slice(0, 300)}...`
                                : hotel.hoteldescription}
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
                              onClick={() =>
                                toggleTab(hotel.hotelcode, "reviews")
                              }
                              isActive={
                                activeTabs[hotel.hotelcode] === "reviews"
                              }
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
                  <div>
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
                      <HotelToursContent
                        tours={hotel.tours.tour}
                        hotelcode={hotel.hotelcode}
                      />
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-[30vh]">
              <p className="text-xl text-gray-500 mb-4">
                Выберите страну для просмотра туров
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[30vh]">
            <p className="text-xl text-gray-500 mb-4">
              Подождите, идет загрузка туров...
            </p>
          </div>
        )}

        {/* Кнопка "Показать еще" - обновляем условие */}
        {activeCountry &&
          countryResults[activeCountry]?.data?.status?.state === "finished" &&
          countryResults[activeCountry]?.data?.result?.hotel?.length <
            countryResults[activeCountry]?.data?.status?.hotelsfound && (
            <div className="w-full flex justify-center pt-8">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 w-[13rem]"
              >
                {isFetchingNextPage ? "Загрузка..." : "Показать еще туры"}
              </button>
            </div>
          )}
      </div>
      <FloatingControls />
    </div>
  );
}
