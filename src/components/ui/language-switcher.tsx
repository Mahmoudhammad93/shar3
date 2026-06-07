"use client";

import { Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import { LOCALE_LABELS, type Locale } from "@/lib/locale";
import { useLocale } from "@/components/providers/locale-provider";

type LanguageSwitcherProps = {
  className?: string;
  variant?: "compact" | "settings";
};

export function LanguageSwitcher({ className, variant = "compact" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  if (variant === "settings") {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
        {(["ar", "en"] as Locale[]).map((code) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-4 text-start transition",
                active
                  ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                  : "border-border bg-surface hover:border-brand/30 hover:bg-brand/5"
              )}
              aria-pressed={active}
            >
              <div>
                <p className="font-semibold text-brand-dark">{LOCALE_LABELS[code]}</p>
                <p className="mt-1 text-xs text-muted">
                  {code === "ar" ? "اتجاه من اليمين إلى اليسار" : "Left to right layout"}
                </p>
              </div>
              <Languages className={cn("h-5 w-5", active ? "text-brand" : "text-muted")} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border border-border bg-surface p-0.5",
        className
      )}
      role="group"
      aria-label="Language switcher"
    >
      {(["ar", "en"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-xs font-semibold transition",
            locale === code
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:text-brand"
          )}
          aria-pressed={locale === code}
        >
          <Languages className="h-3.5 w-3.5" />
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}

export function LanguageSettingsSection() {
  const { locale } = useLocale();

  return (
    <section className="card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-brand-dark">
          {locale === "en" ? "Language & direction" : "اللغة واتجاه الواجهة"}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {locale === "en"
            ? "Arabic uses a right sidebar; English uses a left sidebar."
            : "العربية: القائمة على اليمين — English: القائمة على اليسار"}
        </p>
      </div>
      <LanguageSwitcher variant="settings" />
    </section>
  );
}
