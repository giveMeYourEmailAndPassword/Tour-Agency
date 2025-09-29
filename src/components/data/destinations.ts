import ae1 from "../../assets/AE/dubai_mall_056.jpg";
import ae2 from "../../assets/AE/dubai_mall_067.jpg";

import eg1 from "../../assets/EG/pexels-andreea-ch-371539-1369212.jpg";
import eg2 from "../../assets/EG/pexels-axp-photography-500641970-18991572.jpg";

import id1 from "../../assets/ID/Kafedralnyy-sobor-Dzhakarty-1.jpg";
import id2 from "../../assets/ID/SHosse-v-tsentre-Dzhakarty.jpg";

import mv1 from "../../assets/MV/pexels-asadphoto-1430677.jpg";
import mv2 from "../../assets/MV/pexels-asadphoto-1450360.jpg";
import mv3 from "../../assets/MV/pexels-asadphoto-3293148.jpg";
import mv4 from "../../assets/MV/pexels-asadphoto-3601453.jpg";

import th1 from "../../assets/TH/pexels-duichantran-31188948.jpg";

import tr1 from "../../assets/TR/pexels-arefin-879478.jpg";
import tr2 from "../../assets/TR/pexels-smuldur-2048865.jpg";

import vn1 from "../../assets/VN/pexels-tomfisk-1551491.jpg";
import vn2 from "../../assets/VN/pexels-tomfisk-2032110.jpg";
import vn3 from "../../assets/VN/pexels-truongbanreview-2847871.jpg";

export const destinations = [
  {
    id: 1,
    name: "Египет",
    code: "EG",
    regions: [{ id: 6, name: "Шарм-эль-Шейх" }],
    images: [eg1, eg2],
  },
  {
    id: 2,
    name: "Тайланд",
    code: "TH",
    regions: [
      { id: 62, name: "Бангкок" },
      { id: 8, name: "Пхукет" },
      { id: 7, name: "Паттайя" },
    ],
    images: [th1],
  },
  {
    id: 4,
    name: "Турция",
    code: "TR",
    regions: [
      { id: 20, name: "Анталья" },
      { id: 19, name: "Аланья" },
      { id: 21, name: "Белек" },
      { id: 22, name: "Кемер" },
      { id: 24, name: "Бодрум" },
      { id: 277, name: "Стамбул" },
      { id: 23, name: "Сиде" },
    ],
    images: [tr1, tr2],
  },
  {
    id: 16,
    name: "Вьетнам",
    code: "VN",
    regions: [
      { id: 87, name: "Нячанг" },
      // { id: 104, name: "Фукуок" },
      { id: 103, name: "Дананг" },
    ],
    images: [vn1, vn2, vn3],
  },
  {
    id: 9,
    name: "ОАЭ",
    code: "AE",
    regions: [
      { id: 45, name: "Дубай" },
      { id: 43, name: "Абу-Даби" },
      { id: 49, name: "Шарджа" },
      { id: 46, name: "Рас-Эль-Хайм" },
      { id: 47, name: "Фуджейра" },
    ],
    images: [ae1, ae2],
  },
  {
    id: 7,
    name: "Индонезия",
    code: "ID",
    regions: [{ id: 37, name: "Бали" }],
    images: [id1, id2],
  },
  {
    id: 8,
    name: "Мальдивы",
    code: "MV",
    regions: [{ id: 42, name: "Мальдивы" }],
    images: [mv1, mv2, mv3, mv4],
  },
  // {
  //   id: 12,
  //   name: "Шри-Ланка",
  //   regions: [ ... ],
  // },
  {
    id: 36,
    name: "Малайзия",
    code: "MY",
    regions: [
      { id: 327, name: "Куала Лумпур" },
      { id: 328, name: "Лангкави" },
    ],
    // images отсутствуют (нет ассетов)
  },
  {
    id: 54,
    name: "Грузия",
    code: "GE",
    regions: [
      { id: 480, name: "Батуми" },
      { id: 476, name: "Тбилиси" },
    ],
    // images отсутствуют (нет ассетов)
  },
  {
    id: 79,
    name: "Катар",
    code: "QA",
    regions: [{ id: 608, name: "Доха" }],
    // images отсутствуют (нет ассетов)
  },
];

export const departures = [
  { id: 80, name: "Бишкек" },
  { id: 60, name: "Алматы" },
];

export interface Destination {
  id: number;
  name: string;
  code: string;
  regions: Region[];
  images?: string[];
}

export interface Region {
  id: number;
  name: string;
}

export interface Departure {
  id: number;
  name: string;
}
