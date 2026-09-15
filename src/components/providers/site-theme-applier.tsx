"use client";

import { useLayoutEffect } from "react";
import { useSiteSettingsContext } from "@/components/providers/site-settings-provider";
import { buildSiteTheme, siteThemeCssVars } from "@/lib/site-theme";

function applySiteTheme(settings: ReturnType<typeof useSiteSettingsContext>["settings"]) {
  const vars = siteThemeCssVars(buildSiteTheme(settings));
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    if (typeof value === "string") {
      root.style.setProperty(key, value);
    }
  });
}

export function SiteThemeApplier() {
  const { settings } = useSiteSettingsContext();

  useLayoutEffect(() => {
    applySiteTheme(settings);
  }, [settings]);

  return null;
}
