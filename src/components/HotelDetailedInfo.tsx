import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaCheck, FaYoutube } from "react-icons/fa";
import { Skeleton } from "@heroui/react";

interface HotelDetailedInfoProps {
  hotel: {
    name: string;
    stars: string;
    rating: string;
    description?: string;
    placement?: string;
    territory?: string;
    inroom?: string;
    roomtypes?: string;
    services?: string | string[];
    servicefree?: string;
    servicepay?: string;
    meallist?: string;
    mealtypes?: string;
    build?: string;
    images?: {
      image: string[];
    };
    beach?: string;
    phone?: string;
    site?: string;
    reviews?: {
      review: Array<{
        name: string;
        content: string;
        traveltime: string;
        positive: string;
        negative: string;
        rate: string;
        reviewdate: string;
        reviewtime: string;
        sourcelink: string;
      }>;
    };
    reviewscount?: string;
  };
  isLoading?: boolean;
}

interface InfoSection {
  title: string;
  content: string[];
  isOpen: boolean;
}

export default function HotelDetailedInfo({
  hotel,
  isLoading = false,
}: HotelDetailedInfoProps) {
  const [showAllSections, setShowAllSections] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");

  // Функция для создания секций на основе данных отеля
  const createSections = (): InfoSection[] => {
    const sections: InfoSection[] = [];

    // Описание отеля
    if (hotel.description) {
      sections.push({
        title: "Описание отеля",
        content: [hotel.description],
        isOpen: true,
      });
    }

    // Расположение
    if (hotel.placement) {
      sections.push({
        title: "Расположение",
        content: [hotel.placement],
        isOpen: true,
      });
    }

    // Территория отеля
    if (hotel.territory) {
      sections.push({
        title: "Территория отеля",
        content: hotel.territory.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // Бесплатные услуги
    if (hotel.servicefree) {
      sections.push({
        title: "Бесплатные услуги",
        content: hotel.servicefree.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // Платные услуги
    if (hotel.servicepay) {
      sections.push({
        title: "Платные услуги",
        content: hotel.servicepay.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // Общие услуги
    if (hotel.services) {
      const servicesContent = Array.isArray(hotel.services)
        ? hotel.services
        : hotel.services.split(";").map((item) => item.trim());

      sections.push({
        title: "Услуги",
        content: servicesContent,
        isOpen: true,
      });
    }

    // Питание
    if (hotel.meallist) {
      sections.push({
        title: "Питание",
        content: hotel.meallist.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // Типы питания (рестораны и бары)
    if (hotel.mealtypes) {
      sections.push({
        title: "Рестораны и бары",
        content: hotel.mealtypes.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // В номере
    if (hotel.inroom) {
      sections.push({
        title: "В номере",
        content: hotel.inroom.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    // Типы номеров
    if (hotel.roomtypes) {
      sections.push({
        title: "Типы номеров",
        content: hotel.roomtypes.split(";").map((item) => item.trim()),
        isOpen: true,
      });
    }

    return sections;
  };

  const [sections, setSections] = useState<InfoSection[]>(() =>
    createSections()
  );

  if (isLoading) {
    return (
      <div className="bg-[#F9F9F9] rounded-xl overflow-hidden mt-1">
        <div className="p-6 space-y-4">
          {/* Заголовки табов */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <Skeleton className="w-48 h-6 rounded" />
              <Skeleton className="w-20 h-6 rounded" />
            </div>
            <Skeleton className="w-12 h-6 rounded-full" />
          </div>

          {/* Секции информации */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-3 flex items-center justify-between">
                  <Skeleton className="w-32 h-5 rounded" />
                  <Skeleton className="w-4 h-4 rounded" />
                </div>
                <div className="p-3 space-y-2">
                  {Array.from({ length: 3 }).map((_, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2">
                      <Skeleton className="w-3 h-3 rounded-full mt-1" />
                      <Skeleton className="w-full h-3 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-center gap-2">
            <Skeleton className="w-32 h-10 rounded-lg" />
            <Skeleton className="w-20 h-10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const toggleSection = (index: number) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  // Определяем, какие секции показывать
  const visibleSections = showAllSections ? sections : sections.slice(0, 3);
  const hasMoreSections = sections.length > 3;

  // Компонент для отображения отзывов
  const ReviewsComponent = () => {
    if (!hotel.reviews?.review || hotel.reviews.review.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <p>Отзывы пока отсутствуют</p>
        </div>
      );
    }

    const visibleReviews = showAllReviews
      ? hotel.reviews.review
      : hotel.reviews.review.slice(0, 3);
    const hasMoreReviews = hotel.reviews.review.length > 3;

    return (
      <div className="space-y-4">
        {visibleReviews.map((review, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {review.name ? review.name.charAt(0).toUpperCase() : "А"}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.name || "Анонимный пользователь"}
                  </h4>
                  <p className="text-sm text-gray-500">{review.traveltime}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < parseInt(review.rate)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="text-gray-700 text-sm leading-relaxed">
              {review.content}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {review.reviewdate} в {review.reviewtime}
              </p>
            </div>
          </div>
        ))}

        {/* Кнопка "Показать полностью" или "Скрыть" для отзывов */}
        {hasMoreReviews && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF621F] text-white rounded-lg hover:bg-[#E55A1A] transition-colors font-medium text-sm"
            >
              {showAllReviews ? "Скрыть" : "Показать полностью"}
              {showAllReviews ? (
                <FaChevronUp size={14} />
              ) : (
                <FaChevronDown size={14} />
              )}
            </button>

            {/* Кнопка YouTube */}
            <button
              onClick={() => {
                window.open(
                  `https://www.youtube.com/results?search_query=${hotel.name} обзор отель`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="Посмотреть обзор отеля на YouTube"
            >
              <FaYoutube className="w-5 h-5" />
              <span>Обзор</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#F9F9F9] rounded-xl overflow-hidden mt-1">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("info")}
              className={`text-xl font-semibold transition-colors ${
                activeTab === "info"
                  ? "text-[#2E2E32]"
                  : "text-gray-500 hover:text-[#2e2e32e3]"
              }`}
            >
              Информация об отеле
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-xl font-semibold transition-colors group ${
                activeTab === "reviews"
                  ? "text-[#2E2E32]"
                  : "text-gray-500 hover:text-[#2e2e32e3]"
              }`}
            >
              Отзывы
              {hotel.reviewscount && (
                <span
                  className={`ml-2 text-sm px-2 py-0.5 rounded-full transition-colors ${
                    activeTab === "reviews"
                      ? "bg-[#FF621F] text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-[#ff621fd8] group-hover:text-white"
                  }`}
                >
                  {hotel.reviewscount}
                </span>
              )}
            </button>
          </div>

          {hotel.rating !== "0" && (
            <div className="bg-[#FF621F] text-white text-base font-medium px-3 py-0.5 rounded-[20px]">
              {hotel.rating.length === 1 ? `${hotel.rating}.0` : hotel.rating}
            </div>
          )}
        </div>

        {/* Контент в зависимости от активного таба */}
        {activeTab === "info" ? (
          <>
            {/* Отображаем видимые секции */}
            {visibleSections.map((section, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-3 flex items-center justify-between text-left"
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    {section.title}
                  </h3>
                  {section.isOpen ? (
                    <FaChevronUp className="text-gray-600" size={12} />
                  ) : (
                    <FaChevronDown className="text-gray-600" size={12} />
                  )}
                </button>

                {section.isOpen && section.content.length > 0 && (
                  <div className="p-3 bg-white">
                    <div className="space-y-1.5">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2">
                          <FaCheck
                            className="text-green-500 mt-0.5 flex-shrink-0"
                            size={12}
                          />
                          <span className="text-gray-700 text-xs leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Кнопка "Показать полностью" или "Скрыть" */}
            {hasMoreSections && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowAllSections(!showAllSections)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF621F] text-white rounded-lg hover:bg-[#E55A1A] transition-colors font-medium text-sm"
                >
                  {showAllSections ? "Скрыть" : "Показать полностью"}
                  {showAllSections ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </button>

                <button
                  onClick={() => {
                    window.open(
                      `https://www.youtube.com/results?search_query=${hotel.name} обзор отель`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                  title="Посмотреть обзор отеля на YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                  <span>Обзор</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <ReviewsComponent />
        )}
      </div>
    </div>
  );
}
