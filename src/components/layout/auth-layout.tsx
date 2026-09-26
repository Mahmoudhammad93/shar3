"use client";

import Link from "next/link";
import { SiteLogoMark } from "@/components/layout/site-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useSiteSettings } from "@/lib/use-site-settings";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { settings } = useSiteSettings();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden w-full flex-col items-center justify-center overflow-hidden bg-brand p-12 text-white lg:flex lg:w-1/2">
        <div className="islamic-pattern absolute inset-0 opacity-30" />
        <div className="relative text-center">
          <SiteLogoMark
            logoUrl={settings?.logo}
            size="lg"
            variant="dark"
            className="mx-auto mb-8 shadow-lg"
          />
          <h1 className="text-3xl font-bold">{settings?.site_name_ar || "معهد إعداد دعاة التوحيد والسنة"}</h1>
          <p className="mx-auto mt-4 max-w-sm leading-8 text-white/80">
            {settings?.tagline_ar || "منارة للعلوم الشرعية — طلب العلم فريضة على كل مسلم"}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex justify-end">
            <LanguageSwitcher />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthLinks() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted">
      <Link href="/login" className="hover:text-brand">تسجيل الدخول</Link>
      <Link href="/register" className="hover:text-brand">إنشاء حساب</Link>
      <Link href="/forgot-password" className="hover:text-brand">نسيت كلمة المرور؟</Link>
    </div>
  );
}
