"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { studentApi } from "@/lib/auth";

export default function ProfilePage() {
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الملف الشخصي</h1>
        <p className="mt-1 text-sm text-muted">عرض وتعديل بياناتك الشخصية</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-lg space-y-4 p-6">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم" />
        <Input value={form.email} disabled placeholder="البريد الإلكتروني" className="bg-background" />
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="الجوال" />
        <div className="grid grid-cols-2 gap-4">
          <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="الدولة" />
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="المدينة" />
        </div>
        {saved && <p className="text-sm text-brand">تم حفظ التغييرات</p>}
        <Button type="submit">حفظ التغييرات</Button>
      </form>
    </DashboardLayout>
  );
}
