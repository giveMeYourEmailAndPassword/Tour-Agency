import { AccordionSection } from "./AccordionSection";
import { useAccordion } from "../hooks/useAccordion";

const HotelDetails = () => {
  const { openSections, toggleSection, formatText } = useAccordion();

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

  const sections = [
    { key: "placement", title: "Расположение", content: hotel.placement },
    {
      key: "territory",
      title: "Территория и услуги",
      content: formatText(hotel.territory),
    },
    // ... остальные секции
  ].filter((section) => section.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {/* ... рендер секций с использованием AccordionSection */}
    </div>
  );
};
