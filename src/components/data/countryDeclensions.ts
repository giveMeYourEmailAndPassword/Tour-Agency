interface CountryDeclensions {
  [key: string]: {
    nominative: string; // Именительный (Что? - Турция)
    genitive: string; // Родительный (Чего? - Турции)
  };
}

export const countryDeclensions: CountryDeclensions = {
  Турция: {
    nominative: "Турция",
    genitive: "Турции",
  },
  Египет: {
    nominative: "Египет",
    genitive: "Египта",
  },
  Таиланд: {
    nominative: "Таиланд",
    genitive: "Таиланда",
  },
  Вьетнам: {
    nominative: "Вьетнам",
    genitive: "Вьетнама",
  },
  ОАЭ: {
    nominative: "ОАЭ",
    genitive: "ОАЭ",
  },
  Индонезия: {
    nominative: "Индонезия",
    genitive: "Индонезии",
  },
  Мальдивы: {
    nominative: "Мальдивы",
    genitive: "Мальдив",
  },
  Малайзия: {
    nominative: "Малайзия",
    genitive: "Малайзии",
  },
  Грузия: {
    nominative: "Грузия",
    genitive: "Грузии",
  },
  Катар: {
    nominative: "Катар",
    genitive: "Катара",
  },
};
