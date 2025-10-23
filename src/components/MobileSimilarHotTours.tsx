import { BsFire } from "react-icons/bs";
import { parse, format, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { Skeleton } from "@heroui/react";
import { useNavigate } from "react-router";
import useSimilarHotTours from "../Hooks/useSimilarHotTours";
import starFilled from "../assets/star_fill.svg";
import starOutline from "../assets/star_unfill.svg";
import utensils from "../assets/utensils.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Tour {
  hotelcode: string;
  tourid: string;
  hotelpicture: string;
  hotelname: string;
  hotelstars: string;
  hotelrating: string;
  countryname: string;
  hotelregionname: string;
  meal: string;
  beach?: boolean;
  operatorname?: string;
  departurename: string;
  flydate: string;
  nights: string;
  price: string;
  priceold: string;
  currency: string;
}

interface MobileSimilarHotToursProps {
  countrycode: string;
  departurecode: string;
  currentHotelCode: string;
  currentHotelName: string;
  isLoading?: boolean;
}

// Функция для обрезки названия отеля после 2-х слов
const truncateHotelName = (name: string) => {
  const words = name.split(" ");
  if (words.length > 2) {
    return words.slice(0, 2).join(" ");
  }
  return name;
};

export default function MobileSimilarHotTours({
  countrycode,
  departurecode,
  currentHotelCode,
  currentHotelName,
  isLoading: externalLoading = false,
}: MobileSimilarHotToursProps) {
  const navigate = useNavigate();

  // Проверяем, что у нас есть необходимые параметры для запроса
  const shouldFetch = !!(countrycode && departurecode);

  const { data, isLoading, isError } = useSimilarHotTours(
    countrycode,
    departurecode,
    shouldFetch
  );

  // Если нет необходимых параметров и нет внешней загрузки, не рендерим компонент
  if (!shouldFetch && !externalLoading) {
    return null;
  }

  const formatDateRange = (startDate: string, nights: number) => {
    const start = parse(startDate, "dd.MM.yyyy", new Date());
    const end = addDays(start, nights);

    const startMonth = format(start, "MMMM", { locale: ru });
    const endMonth = format(end, "MMMM", { locale: ru });

    if (startMonth === endMonth) {
      const startDay = format(start, "d", { locale: ru });
      const endDay = format(end, "d", { locale: ru });
      return `${startDay} - ${endDay} ${startMonth}`;
    } else {
      return `${format(start, "d MMMM", { locale: ru })} - ${format(
        end,
        "d MMMM",
        { locale: ru }
      )}`;
    }
  };

  const getMealType = (meal: string) => {
    const mealTypes: { [key: string]: string } = {
      "": "Без питания",
      BB: "Завтрак",
      HB: "Полупансион",
      FB: "Полный пансион",
      AI: "Всё включено",
      UAI: "Ультра всё включено",
      RO: "Без питания",
      "BED & BREAKFAST": "Завтрак",
    };
    return mealTypes[meal] || meal;
  };

  if (isLoading || externalLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Skeleton className="w-40 h-8 rounded" />
          <Skeleton className="w-6 h-6 rounded" />
        </div>
        <div className="relative">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !mx-1 !w-2 !h-2",
              bulletActiveClass: "!bg-[#FF621F] !w-4",
            }}
            className="w-full"
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <SwiperSlide key={index}>
                <div className="w-full p-3 bg-white border border-[#DBE0E5] rounded-[10px]">
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="w-full h-32 rounded" />
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex justify-between items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          <Skeleton className="w-20 h-4" />
                        </div>
                        <Skeleton className="w-16 h-4" />
                      </div>
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-3/4 h-4" />
                    </div>
                    <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                      <Skeleton className="w-16 h-4" />
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <Skeleton className="w-20 h-4" />
                      <div className="flex flex-col items-end gap-1">
                        <Skeleton className="w-24 h-3" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  const similarTours =
    data?.hottours?.tour
      ?.filter(
        (tour) =>
          tour.hotelcode !== currentHotelCode &&
          tour.hotelname !== currentHotelName
      )
      ?.slice(0, 6) || []; // Увеличиваем до 6 для лучшего слайдера

  if (similarTours.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 bg-white rounded-xl px-3 py-2">
      <h2 className="text-xl font-semibold flex items-center gap-1">
        Похожие туры <BsFire className="text-orange-500" />
      </h2>

      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !mx-1 !w-2 !h-2",
            bulletActiveClass: "!opacity-100 !bg-[#FF621F] !w-2",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="w-full"
        >
          {similarTours.map((tour: Tour, index: number) => (
            <SwiperSlide key={index}>
              <div
                className="w-full flex items-center gap-2.5 p-4 bg-white border border-[#DBE0E5] rounded-[10px] cursor-pointer transition-all duration-300"
                onClick={() =>
                  navigate(`/hotel/${tour.hotelcode}/${tour.tourid}`)
                }
              >
                <div className="w-full flex flex-col gap-2">
                  {/* Изображение */}
                  <div className="w-full h-48 md:h-44 rounded">
                    <img
                      src={
                        tour.hotelpicture
                          ? `https:${tour.hotelpicture}`
                          : "/default-image.jpg"
                      }
                      alt={tour.hotelname}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Информация об отеле */}
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex justify-between items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <img
                            key={i}
                            src={
                              i < parseInt(tour.hotelstars)
                                ? starFilled
                                : starOutline
                            }
                            alt={
                              i < parseInt(tour.hotelstars)
                                ? "filled star"
                                : "outline star"
                            }
                            className="w-4 h-4"
                          />
                        ))}
                        {tour.hotelrating !== "0" && (
                          <div className="bg-[#FF621F] text-white text-xs font-medium px-1 rounded-[20px] ml-0.5">
                            {tour.hotelrating.length === 1
                              ? `${tour.hotelrating}.0`
                              : tour.hotelrating}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-[#FF621F]">
                        из {tour.departurename}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[#2E2E32] text-lg font-bold leading-[1.22]">
                        {truncateHotelName(tour.hotelname)}
                      </h3>
                      <p className="text-[#6B7280] text-base leading-[1.29]">
                        {tour.countryname}, {tour.hotelregionname}
                      </p>
                    </div>
                  </div>

                  {/* Теги */}
                  <div className="w-full flex items-center gap-3 pb-1 border-b border-[#DBE0E5]">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-[#2E2E32]">
                        {getMealType(tour.meal)}
                      </span>
                      <img src={utensils} alt="meal" className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Цена и даты */}
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold text-[#2E2E32]">
                        {Number(tour.price) * 2}
                        {tour.currency === "EUR"
                          ? "€"
                          : tour.currency === "USD"
                          ? "$"
                          : tour.currency}
                      </span>
                      {Number(tour.priceold) > Number(tour.price) && (
                        <span className="text-[#6B7280] line-through text-sm">
                          {Number(tour.priceold) * 2}
                          {tour.currency === "EUR"
                            ? "€"
                            : tour.currency === "USD"
                            ? "$"
                            : tour.currency}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-[#2E2E32]">
                        {formatDateRange(tour.flydate, parseInt(tour.nights))}
                      </span>
                      <span className="text-sm text-[#6B7280]">
                        кол-во ночей: {tour.nights}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
