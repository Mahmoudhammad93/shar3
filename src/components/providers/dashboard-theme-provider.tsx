"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  buildDashboardTheme,
  dashboardShellClass,
  dashboardThemeCssVars,
  type DashboardTheme,
} from "@/lib/dashboard-theme";
import type { SiteSettings } from "@/types";

interface DashboardThemeContextValue {
  settings: SiteSettings | null;
  theme: DashboardTheme;
  loading: boolean;
  refresh: () => Promise<void>;
}

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const { data } = await api.getSettings();
      setSettings(data);
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const theme = useMemo(() => buildDashboardTheme(settings), [settings]);

  return (
    <DashboardThemeContext.Provider value={{ settings, theme, loading, refresh }}>
      <div
        className={dashboardShellClass(theme)}
        style={dashboardThemeCssVars(theme)}
        data-dashboard-style={theme.style}
        data-dashboard-layout={theme.layout}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error("useDashboardTheme must be used within DashboardThemeProvider");
  }
  return ctx;
}
