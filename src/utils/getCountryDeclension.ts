import { countryDeclensions } from "../components/data/countryDeclensions";

export type CountryCase = "nominative" | "genitive" | "accusative";

export function getCountryDeclension(
  countryName: string,
  grammaticalCase: CountryCase
): string {
  const entry = countryDeclensions[countryName];
  if (!entry) return countryName;
  return entry[grammaticalCase] ?? countryName;
}
