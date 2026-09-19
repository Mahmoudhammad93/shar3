"use client";

import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { AboutContent } from "@/components/about/about-content";
import { useSiteSettings } from "@/lib/use-site-settings";

export function AboutPageContent() {
  const { settings } = useSiteSettings();

  return (
    <>
      <ConfigurablePageHero
        path="/about"
        fallbackTitle="عن المعهد"
        fallbackSubtitle={settings?.tagline_ar || "تعليم العلوم الشرعية على منهج أهل السنة والجماعة"}
      />
      <AboutContent initial={settings ?? undefined} />
    </>
  );
}
