import type { Metadata } from "next";
import Script from "next/script";
import { Cairo } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { DEFAULT_LOCALE, getDirection } from "@/lib/locale";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "معهد علم شرعي",
    template: "%s | معهد علم شرعي",
  },
  description: "مؤسسة تعليمية متخصصة في العلوم الشرعية على منهج أهل السنة والجماعة",
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
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
