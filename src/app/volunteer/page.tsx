"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { submitVolunteer } from "@/lib/auth";

export default function VolunteerPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await submitVolunteer({
        name: form.get("name") as string,
        country: form.get("country") as string,
        phone: form.get("phone") as string,
        whatsapp: (form.get("whatsapp") as string) || undefined,
        work_type: form.get("work_type") as string,
        experience: (form.get("experience") as string) || undefined,
      });
      setMessage(res.message);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إرسال الطلب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="التطوع بفريق العمل" subtitle="ساهم في نشر العلم الشرعي">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" required placeholder="الاسم الكامل" />
        <Input name="country" required placeholder="الدولة" />
        <Input name="phone" required placeholder="رقم الهاتف" />
        <Input name="whatsapp" placeholder="رقم الواتساب" />
        <Input name="work_type" required placeholder="نوع العمل المطلوب التطوع به" />
        <Textarea name="experience" rows={4} placeholder="الخبرة السابقة (اختياري)" />
        {message && <p className="rounded-xl bg-brand/10 p-3 text-sm text-brand">{message}</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري الإرسال..." : "إرسال طلب التطوع"}
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted">
        <Link href="/register">← العودة للتسجيل</Link>
      </p>
    </AuthLayout>
  );
}
