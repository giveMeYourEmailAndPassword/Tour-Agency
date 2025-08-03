import React, { useState, useContext } from "react";
import { DataContext } from "../DataProvider";

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#FDDEC2]">
    <span className="text-base text-[#2E2E32]">{label}</span>
    <button onClick={onRemove} className="text-[#2E2E32]">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4L12 12M4 12L12 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
);

// Группируем сервисы по категориям
const CATEGORIES = {
  "Услуги отеля": [], // Пустой массив, так как это заголовок для выбранных услуг
  "Для детей": [
    "Водные горки",
    "Детское меню",
    "Мини-клуб",
    "Детская анимация",
    "Детская площадка",
  ],
  Номер: [
    "Кухня в номере",
    "Балкон в номере",
    "Wi-Fi в номере",
    "Кондиционер",
    "Размещение с животными",
  ],
  Пляж: ["Первая линия", "Собственный пляж", "Песчаный пляж", "Галечный пляж"],
  Территория: [
    "Бассейн",
    "Бассейн с подогревом",
    "Водные горки",
    "СПА-центр",
    "Ресторан/кафе",
    "Спортзал",
    "Теннис",
    "Футбол",
    "Новый отель",
  ],
  Услуги: [
    "Анимация",
    "Дискотека",
    "Wi-Fi",
    "Размещение одиноких мужчин",
    "Только для взрослых",
  ],
  "Тип отеля": ["Активный", "Городской", "Семейный", "VIP"],
};

export default function HotelService() {
  const { setData, params } = useContext(DataContext);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    () => params.param10 || []
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Для детей",
  ]); // По умолчанию открыта секция "Для детей"

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const newServices = prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service];

      // Обновляем контекст данных
      setData("param10", newServices);
      return newServices;
    });
  };

  const toggleSection = (section: string) => {
    if (section === "Услуги отеля") return; // Не сворачиваем секцию с тегами
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const removeService = (service: string) => {
    toggleService(service);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Заголовок "Услуги отеля" и теги */}
      <div className="flex flex-col gap-2">
        <span className="text-base text-[#2E2E32] font-semibold border-b border-[#DBE0E5] pb-2">
          Услуги отеля
        </span>
        {selectedServices.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedServices.map((service) => (
              <Tag
                key={service}
                label={service}
                onRemove={() => removeService(service)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Секции с услугами */}
      {Object.entries(CATEGORIES).map(([category, services]) => {
        if (category === "Услуги отеля") return null; // Пропускаем, так как уже отобразили выше
        return (
          <div key={category} className="flex flex-col gap-1.5">
            <button
              className="flex items-center justify-between text-[#2E2E32] text-base font-semibold"
              onClick={() => toggleSection(category)}
            >
              <span>{category}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  expandedSections.includes(category) ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 12.5L10 7.5L5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {expandedSections.includes(category) && (
              <div className="flex flex-col gap-0.5">
                {services.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedServices.includes(service)
                          ? "bg-[#FF621F] border-[#FF621F]"
                          : "border-[#7E8389]"
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      {selectedServices.includes(service) && (
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.33301 4L3.99967 6.66667L9.33301 1.33334"
                            stroke="white"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-base text-[#2E2E32]">{service}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
