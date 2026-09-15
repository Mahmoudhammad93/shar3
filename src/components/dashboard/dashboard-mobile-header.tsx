"use client";

import { Menu } from "lucide-react";
import { SiteLogoMark } from "@/components/layout/site-logo";
import { useLocale } from "@/components/providers/locale-provider";
import { useDashboardTheme } from "@/components/providers/dashboard-theme-provider";

const DEFAULT_INSTITUTE = { ar: "معهد علم شرعي", en: "Share3a Institute" };

export function DashboardMobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { locale } = useLocale();
  const { settings, theme } = useDashboardTheme();

  const instituteName =
    locale === "en"
      ? settings?.site_name_en ||
        settings?.dashboard_institute_name_en ||
        DEFAULT_INSTITUTE.en
      : settings?.site_name_ar ||
        settings?.dashboard_institute_name_ar ||
        DEFAULT_INSTITUTE.ar;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-4 shadow-sm lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-brand"
        aria-label={locale === "en" ? "Open menu" : "فتح القائمة"}
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <SiteLogoMark
          logoUrl={settings?.logo ?? theme.logoUrl}
          size="sm"
          variant="dark"
          className="shrink-0 rounded-full"
        />
        <p className="truncate text-sm font-bold text-brand-dark">{instituteName}</p>
      </div>
    </header>
  );
}
