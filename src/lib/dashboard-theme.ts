import type { CSSProperties } from "react";
import type { SiteSettings } from "@/types";

export type DashboardStyle = "classic" | "modern" | "minimal" | "compact";
export type DashboardLayout = "wide" | "container";
export type DashboardSidebarStyle = "dark" | "light";

export interface DashboardTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  sidebar: string;
  accent: string;
  accentLight: string;
  background: string;
  style: DashboardStyle;
  layout: DashboardLayout;
  sidebarStyle: DashboardSidebarStyle;
  showPattern: boolean;
  compactMode: boolean;
  logoUrl?: string;
}

const DEFAULTS: DashboardTheme = {
  primary: "#004d40",
  primaryDark: "#003830",
  primaryLight: "#00695c",
  sidebar: "#0a3d34",
  accent: "#c9a227",
  accentLight: "#e6c04a",
  background: "#f4f7f6",
  style: "classic",
  layout: "wide",
  sidebarStyle: "dark",
  showPattern: true,
  compactMode: false,
};

function normalizeHex(color?: string | null, fallback = "#000000"): string {
  if (!color) return fallback;
  const hex = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return fallback;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = normalizeHex(hex).slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
}

function mix(hex: string, target: string, weight: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  return rgbToHex(
    a.r + (b.r - a.r) * weight,
    a.g + (b.g - a.g) * weight,
    a.b + (b.b - a.b) * weight
  );
}

export function resolveDashboardLogo(settings: SiteSettings | null): string | undefined {
  if (!settings) return undefined;
  if (settings.dashboard_use_site_logo !== false && settings.logo) return settings.logo;
  return settings.dashboard_logo || settings.logo;
}

export function buildDashboardTheme(settings: SiteSettings | null): DashboardTheme {
  const primary = normalizeHex(settings?.dashboard_primary_color, DEFAULTS.primary);
  const sidebar = normalizeHex(settings?.dashboard_sidebar_color, DEFAULTS.sidebar);
  const accent = normalizeHex(settings?.dashboard_accent_color, DEFAULTS.accent);
  const background = normalizeHex(settings?.dashboard_background_color, DEFAULTS.background);

  return {
    primary,
    primaryDark: mix(primary, "#000000", 0.25),
    primaryLight: mix(primary, "#ffffff", 0.2),
    sidebar,
    accent,
    accentLight: mix(accent, "#ffffff", 0.25),
    background,
    style: (settings?.dashboard_style as DashboardStyle) || DEFAULTS.style,
    layout: (settings?.dashboard_layout as DashboardLayout) || DEFAULTS.layout,
    sidebarStyle: (settings?.dashboard_sidebar_style as DashboardSidebarStyle) || DEFAULTS.sidebarStyle,
    showPattern: settings?.dashboard_show_pattern !== false,
    compactMode: settings?.dashboard_compact_mode === true,
    logoUrl: resolveDashboardLogo(settings),
  };
}

export function dashboardThemeCssVars(theme: DashboardTheme): CSSProperties {
  return {
    "--brand-primary": theme.primary,
    "--brand-primary-dark": theme.primaryDark,
    "--brand-primary-light": theme.primaryLight,
    "--brand-gold": theme.accent,
    "--brand-gold-light": theme.accentLight,
    "--dashboard-sidebar": theme.sidebar,
    "--dashboard-background": theme.background,
    "--background": theme.background,
  } as React.CSSProperties;
}

export function dashboardShellClass(theme: DashboardTheme): string {
  const classes = ["dashboard-shell", `dashboard-style-${theme.style}`, `dashboard-layout-${theme.layout}`];
  if (theme.compactMode) classes.push("dashboard-compact");
  if (theme.showPattern) classes.push("dashboard-pattern");
  if (theme.sidebarStyle === "light") classes.push("dashboard-sidebar-light");
  return classes.join(" ");
}
