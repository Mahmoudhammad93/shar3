"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LanguageSettingsSection } from "@/components/ui/language-switcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { studentApi } from "@/lib/auth";

export default function SettingsPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", city: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    studentApi.profile().then((res) => {
      setForm({
        name: res.user.name,
        email: res.user.email,
        phone: res.student.phone || "",
        country: res.student.country || "",
        city: res.student.city || "",
      });
    }).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await studentApi.updateProfile({
      name: form.name,
      phone: form.phone,
      country: form.country,
      city: form.city,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const t = {
    title: locale === "en" ? "Settings" : "الإعدادات",
    subtitle: locale === "en" ? "Manage your account preferences" : "إدارة تفضيلات حسابك",
    profile: locale === "en" ? "Profile information" : "معلومات الحساب",
    name: locale === "en" ? "Full name" : "الاسم",
    email: locale === "en" ? "Email" : "البريد الإلكتروني",
    phone: locale === "en" ? "Phone" : "الجوال",
    country: locale === "en" ? "Country" : "الدولة",
    city: locale === "en" ? "City" : "المدينة",
    save: locale === "en" ? "Save changes" : "حفظ التغييرات",
    saved: locale === "en" ? "Changes saved successfully" : "تم حفظ التغييرات",
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-dark">{t.title}</h1>
        <p className="mt-1 text-sm text-muted">{t.subtitle}</p>
      </div>

      <div className="space-y-6">
        <LanguageSettingsSection />

        {user?.role === "admin" || user?.role === "staff" ? (
          <section className="card max-w-lg space-y-3 p-6">
            <h3 className="text-lg font-bold text-brand-dark">
              {locale === "en" ? "Administration" : "إدارة النظام"}
            </h3>
            <p className="text-sm text-muted">
              {locale === "en"
                ? "Manage site content, courses, and student dashboard settings from the admin panel."
                : "إدارة محتوى الموقع والدورات وإعدادات لوحة الطالب من لوحة الإدارة."}
            </p>
            <Button
              href={
                process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:8000/admin"
              }
              variant="outline"
            >
              {locale === "en" ? "Open admin panel" : "فتح لوحة الإدارة"}
            </Button>
          </section>
        ) : null}

        <section className="card max-w-lg space-y-4 p-6">
          <h3 className="text-lg font-bold text-brand-dark">{t.profile}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-muted">{t.name}</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">{t.email}</label>
              <Input value={form.email} disabled className="bg-background" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">{t.phone}</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-muted">{t.country}</label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">{t.city}</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
            {saved && <p className="text-sm text-brand">{t.saved}</p>}
            <Button type="submit">{t.save}</Button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
