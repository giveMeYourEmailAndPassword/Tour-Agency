import { useParams } from "react-router";
import useHotelDetails from "../Hooks/UseHotelDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Header from "./Header";
import { useState } from "react";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";

export default function HotelDetails() {
  const { hotelcode } = useParams();
  const { data, isLoading, isError } = useHotelDetails(hotelcode!);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-3xl font-medium text-blue-600 animate-pulse">
          Загрузка данных об отеле...
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.hotel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-3xl font-medium text-red-600">
          Не удалось загрузить информацию об отеле.
        </div>
      </div>
    );
  }

  const hotel = data?.data?.hotel;

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="text-3xl font-medium text-gray-600">
          Данные об отеле отсутствуют
        </div>
      </div>
    );
  }

  const formatText = (text: string) => {
    return text
      .split(";")
      .map((item) => `· ${item.trim()}`)
      .join("\n");
  };

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-36 mt-12">
        {/* Галерея изображений */}

        {hotel.images?.image.length > 0 && (
          <div className="relative group">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: "!bg-white !scale-110",
                bulletClass: "swiper-pagination-bullet !mx-1",
              }}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop={true}
              className="w-full h-[70vh] rounded-2xl"
            >
              {hotel.images.image.map((img: string, index: number) => (
                <SwiperSlide key={index} className="relative">
                  <img
                    src={`https:${img}`}
                    alt={`Фото отеля ${hotel.name}`}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 rounded-2xl" />
                </SwiperSlide>
              ))}

              <div
                className="swiper-button-prev !text-white !opacity-0 group-hover:!opacity-100 transition-all duration-300 
              !w-12 !h-12 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-xl hover:!bg-black/35"
              />
              <div
                className="swiper-button-next !text-white !opacity-0 group-hover:!opacity-100 transition-all duration-300 
              !w-12 !h-12 !bg-black/30 !backdrop-blur-md !rounded-full after:!text-xl hover:!bg-black/35"
              />
            </Swiper>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Кнопки навигации */}
          <div className="flex justify-center gap-8 mb-12">
            <button className="px-8 py-3 border-3 text-gray-500 rounded-2xl text-lg font-medium transition-colors">
              На карте
            </button>
            <button className="px-14 py-3 border-3 text-gray-500 rounded-2xl text-lg font-medium transition-colors">
              Отзывы
            </button>
            <button className="px-8 py-3 border-3 text-gray-500 rounded-2xl text-lg font-medium transition-colors">
              You<span className="text-red-600">Tube</span>
            </button>
          </div>

          {/* Заголовок и рейтинг */}
          <div className="mb-6 flex flex-col ">
            <div className="flex gap-6 items-baseline">
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-gray-800">
                {hotel.name}
              </h1>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-1 rounded-full shadow-sm">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="font-semibold text-lg">{hotel.rating}</span>
                </div>
                <div className="bg-blue-100 px-4 py-1 rounded-full shadow-sm flex items-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {hotel.stars} / 5
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-2xl">
              {hotel.region}, {hotel.country}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="space-y-3">
              {/* Расположение */}
              {hotel.placement && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("placement")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">Расположение</h2>
                    <span className="text-gray-600">
                      {openSections.includes("placement") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("placement") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {hotel.placement}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Территория и услуги */}
              {hotel.territory && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("territory")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">
                      Территория и услуги
                    </h2>
                    <span className="text-gray-600">
                      {openSections.includes("territory") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("territory") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatText(hotel.territory)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* В номере */}
              {hotel.inroom && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("inroom")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">В номере</h2>
                    <span className="text-gray-600">
                      {openSections.includes("inroom") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("inroom") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatText(hotel.inroom)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Типы номеров */}
              {hotel.roomtypes && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("roomtypes")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">Типы номеров</h2>
                    <span className="text-gray-600">
                      {openSections.includes("roomtypes") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("roomtypes") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatText(hotel.roomtypes)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Сервисы */}
              {hotel.services && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("services")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">Сервисы</h2>
                    <span className="text-gray-600">
                      {openSections.includes("services") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("services") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatText(hotel.services)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Для детей */}
              {hotel.child && (
                <div className="bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
                  <button
                    onClick={() => toggleSection("child")}
                    className="w-full py-2 px-3 flex justify-between items-center"
                  >
                    <h2 className="text-lg text-gray-600">Для детей</h2>
                    <span className="text-gray-600">
                      {openSections.includes("child") ? (
                        <CiSquareMinus className="w-7 h-7 text-gray-500" />
                      ) : (
                        <CiSquarePlus className="w-7 h-7 text-gray-500" />
                      )}
                    </span>
                  </button>
                  {openSections.includes("child") && (
                    <div className="px-8 pb-8">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatText(hotel.child)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Питание */}
          {hotel.meallist && (
            <div className="col-span-2 mt-2 bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
              <button
                onClick={() => toggleSection("mealtypes")}
                className="w-full py-2 px-3 flex justify-between items-center"
              >
                <h2 className="text-lg text-gray-600">Питание</h2>
                <span className="text-gray-600">
                  {openSections.includes("mealtypes") ? (
                    <CiSquareMinus className="w-7 h-7 text-gray-500" />
                  ) : (
                    <CiSquarePlus className="w-7 h-7 text-gray-500" />
                  )}
                </span>
              </button>
              {openSections.includes("mealtypes") && (
                <div className="px-8 pb-3">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {formatText(hotel.meallist)}
                  </p>
                </div>
              )}
            </div>
          )}

          {hotel.beach && (
            <div className="col-span-2 mt-2 bg-white/80 backdrop-blur-lg border-2 border-gray-300 rounded-md transition-all duration-300">
              <button
                onClick={() => toggleSection("mealtypes")}
                className="w-full py-2 px-3 flex justify-between items-center"
              >
                <h2 className="text-lg text-gray-600">Пляж</h2>
                <span className="text-gray-600">
                  {openSections.includes("mealtypes") ? (
                    <CiSquareMinus className="w-7 h-7 text-gray-500" />
                  ) : (
                    <CiSquarePlus className="w-7 h-7 text-gray-500" />
                  )}
                </span>
              </button>
              {openSections.includes("mealtypes") && (
                <div className="px-8 pb-3">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {formatText(hotel.beach)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
