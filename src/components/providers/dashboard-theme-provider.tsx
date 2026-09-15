"use client";

import { createContext, useContext, useMemo } from "react";
import { useSiteSettings } from "@/lib/use-site-settings";
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
  const { settings, loading } = useSiteSettings();
  const theme = useMemo(() => buildDashboardTheme(settings), [settings]);

  return (
    <DashboardThemeContext.Provider
      value={{
        settings,
        theme,
        loading,
        refresh: async () => {
          /* settings refresh is handled by SiteSettingsProvider */
        },
      }}
    >
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
