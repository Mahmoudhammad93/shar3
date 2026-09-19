import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";
import { SiteThemeApplier } from "@/components/providers/site-theme-applier";
import { SiteFavicon } from "@/components/layout/site-favicon";
import { JsonLd } from "@/components/seo/json-ld";
import { api } from "@/lib/api";
import { DEFAULT_LOCALE, getDirection } from "@/lib/locale";
import { buildMetadata, organizationJsonLd, SITE } from "@/lib/seo";
import { buildSiteTheme, siteThemeCssBlock, siteThemeCssVars } from "@/lib/site-theme";
import type { SiteSettings } from "@/types";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shar3.chiefcoder.net"),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  applicationName: SITE.name,
  category: "education",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

async function loadInitialSettings(): Promise<SiteSettings | null> {
  try {
    const { data } = await api.getSettings();
    return data;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = DEFAULT_LOCALE;
  const dir = getDirection(locale);
  const initialSettings = await loadInitialSettings();
  const initialTheme = buildSiteTheme(initialSettings);
  const initialThemeStyle = siteThemeCssVars(initialTheme);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} h-full scroll-smooth`}
      style={initialThemeStyle}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: siteThemeCssBlock(initialTheme) }} />
        {process.env.NODE_ENV === "production" ? <script src="/config.js" /> : null}
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <SiteFavicon />
        <SiteSettingsProvider initialSettings={initialSettings}>
          <SiteThemeApplier />
          <LocaleProvider initialLocale={locale}>
            <AuthProvider>{children}</AuthProvider>
          </LocaleProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
