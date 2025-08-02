import { useEffect } from "react";
import FilterSection from "./filters/FilterSection";
import Checkbox from "./filters/Checkbox";
import Tag from "./filters/Tag";

export default function Filters() {
  useEffect(() => {
    sessionStorage.removeItem("searchData");
  }, []);

  return (
    <div className="w-[240px] border border-[#DBE0E5] rounded-lg p-4 flex flex-col gap-3">
      {/* Тип отеля */}
      <FilterSection title="Тип отеля">
        <Checkbox label="Любой" checked />
        <Checkbox label="Отель" />
        <Checkbox label="Гостевой дом" />
        <Checkbox label="Апартаменты" />
        <Checkbox label="Вилла" />
      </FilterSection>

      {/* Рейтинг */}
      <FilterSection title="Рейтинг">
        <Checkbox label="Любой" checked />
        <Checkbox label="3,0 и более" />
        <Checkbox label="3,5 и более" />
        <Checkbox label="4,0 и более" />
        <Checkbox label="4,5 и более" />
      </FilterSection>

      {/* Услуги отеля */}
      <FilterSection title="Услуги отеля">
        <div className="flex flex-wrap gap-1">
          <Tag label="Водные горки" onRemove={() => {}} />
          <Tag label="Детское меню" onRemove={() => {}} />
          <Tag label="Кухня в номере" onRemove={() => {}} />
        </div>
      </FilterSection>

      {/* Для детей */}
      <FilterSection title="Для детей" isCollapsible>
        <Checkbox label="Водные горки" checked />
        <Checkbox label="Детское меню" checked />
        <Checkbox label="Мини-клуб" />
        <Checkbox label="Детская анимация" />
        <Checkbox label="Детская площадка" />
      </FilterSection>

      {/* Номер */}
      <FilterSection title="Номер" isCollapsible>
        <Checkbox label="Кухня в номере" checked />
        <Checkbox label="Балкон в номере" />
        <Checkbox label="Wi-Fi в номере" />
        <Checkbox label="Кондиционер" />
        <Checkbox label="Размещение с животными" />
      </FilterSection>

      {/* Пляж */}
      <FilterSection title="Пляж" isCollapsible>
        <Checkbox label="Первая линия" />
        <Checkbox label="Собственный пляж" />
        <Checkbox label="Песчаный пляж" />
        <Checkbox label="Галечный пляж" />
      </FilterSection>

      {/* Территория */}
      <FilterSection title="Территория" isCollapsible>
        <Checkbox label="Бассейн" />
        <Checkbox label="Бассейн с подогревом" />
        <Checkbox label="Водные горки" />
        <Checkbox label="СПА-центр" />
        <Checkbox label="Ресторан/кафе" />
        <Checkbox label="Спортзал" />
        <Checkbox label="Теннис" />
        <Checkbox label="Футбол" />
        <Checkbox label="Новый отель" />
      </FilterSection>

      {/* Услуги */}
      <FilterSection title="Услуги" isCollapsible>
        <Checkbox label="Анимация" />
        <Checkbox label="Дискотека" />
        <Checkbox label="Wi-Fi" />
        <Checkbox label="Размещение одиноких мужчин" />
        <Checkbox label="Только для взрослых" />
      </FilterSection>

      {/* Тип отеля */}
      <FilterSection title="Тип отеля" isCollapsible>
        <Checkbox label="Активный" />
        <Checkbox label="Городской" />
        <Checkbox label="Семейный" />
        <Checkbox label="VIP" />
      </FilterSection>

      {/* Доп.фильтры */}
      <FilterSection title="Доп.фильтры">
        <Checkbox label="Мгновенное подтверждение" />
      </FilterSection>
    </div>
  );
}
