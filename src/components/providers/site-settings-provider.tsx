"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/types";

type SiteSettingsContextValue = {
  settings: SiteSettings | null;
  loading: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: null,
  loading: true,
});

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: SiteSettings | null;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings ?? null);
  const [loading, setLoading] = useState(!initialSettings);

  useEffect(() => {
    let active = true;

    api
      .getSettingsLive()
      .then(({ data }) => {
        if (active) setSettings(data);
      })
      .catch(() => {
        // Keep SSR/initial settings when live refresh fails (e.g. CORS during local dev).
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  return useContext(SiteSettingsContext);
}
