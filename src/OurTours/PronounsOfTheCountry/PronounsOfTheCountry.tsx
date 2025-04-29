type DeclensionType = {
  [key: string]: {
    from: string; // Склонение для "из города"
    to: string; // Склонение для "в страну"
  };
};

const cityDeclensions: DeclensionType = {
  Бишкек: {
    from: "Бишкека",
    to: "Бишкек",
  },
  Алматы: {
    from: "Алматы",
    to: "Алматы",
  },
  Ташкент: {
    from: "Ташкента",
    to: "Ташкент",
  },
  // Добавьте другие города по необходимости
};

const countryDeclensions: DeclensionType = {
  Турция: {
    from: "Турции",
    to: "Турцию",
  },
  Египет: {
    from: "Египта",
    to: "Египет",
  },
  Таиланд: {
    from: "Таиланда",
    to: "Таиланд",
  },
  // Добавьте другие страны по необходимости
};

export function getCityDeclension(
  cityName: string,
  type: "from" | "to"
): string {
  return cityDeclensions[cityName]?.[type] || cityName;
}

export function getCountryDeclension(
  countryName: string,
  type: "from" | "to"
): string {
  return countryDeclensions[countryName]?.[type] || countryName;
}
