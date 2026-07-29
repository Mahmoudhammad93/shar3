"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { studentApi, type StudentProfile } from "@/lib/auth";
import { cn } from "@/lib/cn";

function displayValue(value?: string | null) {
  return value?.trim() ? value : "—";
}

function ProfileField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
      <dt className="mb-1 text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm font-medium text-brand-dark">{displayValue(value)}</dd>
    </div>
  );
}

function statusBadgeClass(status?: number) {
  switch (status) {
    case 1:
      return "bg-brand/10 text-brand";
    case 2:
      return "bg-blue-50 text-blue-700";
    case 3:
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "", country: "", city: "" });
  const [photoError, setPhotoError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi
      .profile()
      .then((res) => {
        setProfile(res.student);
        setPhotoError(false);
        setForm({
          name: res.user.name,
          email: res.user.email,
          phone: res.student.phone || "",
          whatsapp: res.student.whatsapp || "",
          country: res.student.country_label || res.student.country || "",
          city: res.student.city || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await studentApi.updateProfile({
      name: form.name,
      phone: form.phone,
      whatsapp: form.whatsapp,
      country: form.country,
      city: form.city,
    });
    setProfile(res.student);
    setPhotoError(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted">جاري تحميل الملف الشخصي...</p>
      </DashboardLayout>
    );
  }

  const showPhoto = profile?.photo && !photoError;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الملف الشخصي</h1>
        <p className="mt-1 text-sm text-muted">عرض وتعديل بياناتك الشخصية</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/20 bg-brand/5">
            {showPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photo!}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setPhotoError(true)}
              />
            ) : (
              <User className="h-10 w-10 text-brand/60" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-brand-dark">{form.name || "—"}</h2>
            <p className="mt-1 text-sm text-muted">{form.email}</p>
            {profile?.status_label && (
              <span
                className={cn(
                  "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                  statusBadgeClass(profile.status)
                )}
              >
                {profile.status_label}
              </span>
            )}
          </div>
        </section>

        <section className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-brand-dark">البيانات الشخصية</h3>

          <div className="mb-6 space-y-4">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="الاسم الكامل"
            />
            <Input value={form.email} disabled placeholder="البريد الإلكتروني" className="bg-background" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="الجوال"
              />
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="واتساب"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="الدولة"
              />
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="المدينة"
              />
            </div>
          </div>

          <dl className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileField label="الاسم الأول" value={profile?.first_name} />
            <ProfileField label="الاسم الأخير" value={profile?.last_name} />
            <ProfileField label="الجنس" value={profile?.gender_label} />
            <ProfileField label="تاريخ الميلاد" value={profile?.birth_date} />
            <ProfileField label="الجنسية" value={profile?.nationality} />
            <ProfileField label="رقم الهوية" value={profile?.national_id} />
          </dl>

          {saved && <p className="mt-4 text-sm text-brand">تم حفظ التغييرات</p>}
          <div className="mt-4">
            <Button type="submit">حفظ التغييرات</Button>
          </div>
        </section>

        <section className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-brand-dark">البيانات الأكاديمية</h3>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileField label="المستوى التعليمي" value={profile?.education_level_label} />
            <ProfileField label="كيف سمعت عن المعهد؟" value={profile?.heard_about_label} />
            <ProfileField label="العمل بدوام كامل" value={profile?.works_full_time_label} />
            <ProfileField label="المشاركة في برامج أخرى" value={profile?.participates_other_programs_label} />
            <ProfileField label="الساعات اليومية للدراسة" value={profile?.daily_hours_label} />
            <ProfileField label="تاريخ الموافقة على الشروط" value={profile?.terms_accepted_at} />
          </dl>
        </section>
      </form>
    </DashboardLayout>
  );
}
