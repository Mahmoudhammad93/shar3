import type { CSSProperties } from "react";
import type { SiteSettings } from "@/types";

export interface SiteTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
  foreground: string;
  border: string;
}

const DEFAULTS: SiteTheme = {
  primary: "#002b5b",
  primaryDark: "#001a38",
  primaryLight: "#1a4478",
  accent: "#c5a04d",
  accentLight: "#d4b56a",
  background: "#f7f9fc",
  foreground: "#0a1f3d",
  border: "#e2e8f0",
};

function normalizeHex(color?: string | null, fallback = "#000000"): string {
  if (!color) return fallback;

  let hex = color.trim();

  if (/^#[0-9a-fA-F]{3,6}#$/.test(hex)) {
    hex = hex.slice(0, -1);
  } else if (/^[0-9a-fA-F]{3,6}#$/.test(hex)) {
    hex = `#${hex.slice(0, -1)}`;
  } else if (/^[0-9a-fA-F]{3,6}$/.test(hex)) {
    hex = `#${hex}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase();
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
    a.b + (b.b - a.b) * weight,
  );
}

export function buildSiteTheme(settings: SiteSettings | null): SiteTheme {
  const primary = normalizeHex(settings?.website_primary_color, DEFAULTS.primary);
  const accent = normalizeHex(settings?.website_accent_color, DEFAULTS.accent);
  const background = normalizeHex(settings?.website_background_color, DEFAULTS.background);

  return {
    primary,
    primaryDark: mix(primary, "#000000", 0.28),
    primaryLight: mix(primary, "#ffffff", 0.18),
    accent,
    accentLight: mix(accent, "#ffffff", 0.22),
    background,
    foreground: mix(primary, "#000000", 0.15),
    border: mix(background, primary, 0.08),
  };
}

export function siteThemeCssBlock(theme: SiteTheme): string {
  const vars = siteThemeCssVars(theme);

  return `:root{${Object.entries(vars)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([key, value]) => `${key}:${value}`)
    .join(";")}}`;
}

export function siteThemeCssVars(theme: SiteTheme): CSSProperties {
  return {
    "--brand-primary": theme.primary,
    "--brand-primary-dark": theme.primaryDark,
    "--brand-primary-light": theme.primaryLight,
    "--brand-gold": theme.accent,
    "--brand-gold-light": theme.accentLight,
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--brand-surface": "#ffffff",
    "--brand-border": theme.border,
    "--color-brand": theme.primary,
    "--color-brand-dark": theme.primaryDark,
    "--color-brand-light": theme.primaryLight,
    "--color-gold": theme.accent,
    "--color-gold-light": theme.accentLight,
    "--color-background": theme.background,
    "--color-foreground": theme.foreground,
    "--color-border": theme.border,
    "--shadow-card": `0 4px 24px -4px ${theme.primary}14`,
    "--shadow-card-hover": `0 12px 40px -8px ${theme.primary}26`,
  } as CSSProperties;
}
