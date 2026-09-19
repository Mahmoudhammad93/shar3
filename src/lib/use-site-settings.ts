"use client";

import { useSiteSettingsContext } from "@/components/providers/site-settings-provider";
import type { SiteSettings } from "@/types";

/** Live site settings from admin → API. Optional `initial` is used only until the fetch completes. */
export function useSiteSettings(initial?: SiteSettings) {
  const { settings: live, loading } = useSiteSettingsContext();
  const settings = live ?? initial ?? null;

  return {
    settings,
    loading: loading && !settings,
  };
}
