import countries from "i18n-iso-countries";
import ar from "i18n-iso-countries/langs/ar.json";

countries.registerLocale(ar);

export type CountryOption = {
  value: string;
  label: string;
  code: string;
};

let cachedOptions: CountryOption[] | null = null;

export function getCountryOptions(): CountryOption[] {
  if (cachedOptions) return cachedOptions;

  const names = countries.getNames("ar", { select: "official" });

  cachedOptions = Object.entries(names)
    .map(([code, label]) => ({
      value: label,
      label,
      code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ar"));

  return cachedOptions;
}

export function findCountryOption(value?: string | null): CountryOption | null {
  if (!value) return null;
  return getCountryOptions().find((option) => option.value === value || option.code === value) ?? null;
}
