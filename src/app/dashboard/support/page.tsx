"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { Mail, MessageCircle, Settings } from "lucide-react";

export default function SupportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(formEl);
    const res = await api.postContact({
      name: (form.get("name") as string) || user?.name || "",
      email: (form.get("email") as string) || user?.email || "",
      phone: (form.get("phone") as string) || undefined,
      subject: (form.get("subject") as string) || "طلب دعم فني - بوابة الطالب",
      message: form.get("message") as string,
    });

    setLoading(false);
    if (res.ok) {
      setSuccess("تم إرسال طلب الدعم بنجاح. سنتواصل معك قريباً.");
      formEl.reset();
    } else {
      setError("تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الدعم الفني</h1>
        <p className="mt-1 text-sm text-muted">تواصل مع فريق الدعم للمساعدة في أي مشكلة تقنية</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-brand-dark">رسالة سريعة</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              أرسل استفسارك وسيرد عليك فريق الدعم خلال 24 ساعة
            </p>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-brand-dark">البريد</h2>
            <p className="mt-2 text-sm text-muted">support@share3a.com</p>
          </div>

          <Link href="/dashboard/settings" className="card flex items-center gap-3 p-5 transition hover:bg-brand/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-brand-dark">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-brand-dark">الإعدادات</p>
              <p className="text-xs text-muted">تعديل الملف الشخصي</p>
            </div>
          </Link>
        </div>

        <div className="card p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="name" defaultValue={user?.name} required placeholder="الاسم" />
              <Input name="email" type="email" defaultValue={user?.email} required placeholder="البريد" />
            </div>
            <Input name="phone" placeholder="رقم الجوال (اختياري)" />
            <Input name="subject" placeholder="الموضوع" defaultValue="طلب دعم فني" />
            <Textarea name="message" required rows={6} placeholder="اشرح مشكلتك بالتفصيل..." />
            {success && <p className="rounded-xl bg-brand/10 p-3 text-sm text-brand">{success}</p>}
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الإرسال..." : "إرسال طلب الدعم"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
