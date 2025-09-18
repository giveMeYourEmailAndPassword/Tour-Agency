interface CountryDeclensions {
  [key: string]: {
    nominative: string; // Именительный (Что? - Турция)
    genitive: string; // Родительный (Чего? - Турции)
    accusative: string; // Винительный (Что? - Турцию)
  };
}

export const countryDeclensions: CountryDeclensions = {
  Турция: {
    nominative: "Турция",
    genitive: "Турции",
    accusative: "в Турцию",
  },
  Египет: {
    nominative: "Египет",
    genitive: "Египта",
    accusative: "в Египет",
  },
  Таиланд: {
    nominative: "Таиланд",
    genitive: "Таиланда",
    accusative: "в Таиланд",
  },
  Вьетнам: {
    nominative: "Вьетнам",
    genitive: "Вьетнама",
    accusative: "во Вьетнам",
  },
  ОАЭ: {
    nominative: "ОАЭ",
    genitive: "ОАЭ",
    accusative: "в ОАЭ",
  },
  Индонезия: {
    nominative: "Индонезия",
    genitive: "Индонезии",
    accusative: "В Индонезию",
  },
  Мальдивы: {
    nominative: "Мальдивы",
    genitive: "Мальдив",
    accusative: "в Мальдивы",
  },
  Малайзия: {
    nominative: "Малайзия",
    genitive: "Малайзии",
    accusative: "в Малайзию",
  },
  Грузия: {
    nominative: "Грузия",
    genitive: "Грузии",
    accusative: "в Грузию",
  },
  Катар: {
    nominative: "Катар",
    genitive: "Катара",
    accusative: "в Катар",
  },
};
