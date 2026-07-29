import type { Metadata } from "next";
import Script from "next/script";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_LOCALE, getDirection } from "@/lib/locale";
import { buildMetadata, organizationJsonLd, SITE } from "@/lib/seo";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = DEFAULT_LOCALE;
  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <head>
        <Script src="/config.js" strategy="beforeInteractive" />
        <JsonLd data={organizationJsonLd()} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
