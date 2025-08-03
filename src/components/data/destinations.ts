export const destinations = [
  {
    id: 1,
    name: "Египет",
    regions: [{ id: 6, name: "Шарм-эль-Шейх" }],
  },
  {
    id: 2,
    name: "Тайланд",
    regions: [
      { id: 62, name: "Бангкок" },
      { id: 8, name: "Пхукет" },
      { id: 7, name: "Паттайя" },
    ],
  },
  {
    id: 4,
    name: "Турция",
    regions: [
      { id: 20, name: "Анталья" },
      { id: 19, name: "Аланья" },
      { id: 21, name: "Белек" },
      { id: 22, name: "Кемер" },
      { id: 24, name: "Бодрум" },
      { id: 277, name: "Стамбул" },
      { id: 23, name: "Сиде" },
    ],
  },
  {
    id: 16,
    name: "Вьетнам",
    regions: [
      { id: 87, name: "Нячанг" },
      // { id: 104, name: "Фукуок" },
      { id: 103, name: "Дананг" },
    ],
  },
  {
    id: 9,
    name: "ОАЭ",
    regions: [
      { id: 45, name: "Дубай" },
      { id: 43, name: "Абу-Даби" },
      { id: 48, name: "Шарджа" },
      { id: 46, name: "Рас-Эль-Хайм" },
      { id: 47, name: "Фуджейра" },
    ],
  },
  {
    id: 7,
    name: "Индонезия",
    regions: [{ id: 37, name: "Бали" }],
  },
  {
    id: 8,
    name: "Мальдивы",
    regions: [{ id: 42, name: "Мальдивы" }],
  },
  // {
  //   id: 12,
  //   name: "Шри-Ланка",
  //   regions: [
  //     { id: 56, name: "Коломбо" },
  //     { id: 594, name: "Хиккадува" },
  //     { id: 593, name: "Унаватуна" },
  //     { id: 591, name: "Канди" },
  //     { id: 590, name: "Галле" },
  //     { id: 53, name: "Бентота" },
  //     { id: 589, name: "Аругам Бей" },
  //     { id: 54, name: "Калутары" },
  //     { id: 58, name: "Сигирия" },
  //     { id: 592, name: "Тангаль" },
  //     { id: 59, name: "Тринкомали" },
  //   ],
  // },
  {
    id: 36,
    name: "Малайзия",
    regions: [
      { id: 327, name: "Куала Лумпур" },
      { id: 328, name: "Лангкави" },
    ],
  },
  {
    id: 54,
    name: "Грузия",
    regions: [
      { id: 480, name: "Батуми" },
      { id: 476, name: "Тбилиси" },
    ],
  },
  {
    id: 79,
    name: "Катар",
    regions: [{ id: 608, name: "Доха" }],
  },
];

export const departures = [
  { id: 80, name: "Бишкек" },
  { id: 60, name: "Алматы" },
];

export interface Destination {
  id: number;
  name: string;
  regions: Region[];
}

export interface Region {
  id: number;
  name: string;
}

export interface Departure {
  id: number;
  name: string;
}
