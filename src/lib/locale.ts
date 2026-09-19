export type Locale = "ar" | "en";

export const LOCALE_COOKIE = "share3a-locale";
export const DEFAULT_LOCALE: Locale = "ar";

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}

export function parseLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "ar";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};
