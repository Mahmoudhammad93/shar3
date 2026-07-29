"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, AuthLinks } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/components/providers/auth-provider";
import { authApi, clearToken, type RegisterPayload } from "@/lib/auth";

const selectClass =
  "flex h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition focus:border-brand-light focus:ring-2 focus:ring-brand/10";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [authLoading, isLoggedIn, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    if (form.get("password") !== form.get("password_confirmation")) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    const birthYear = form.get("birth_year") as string;
    const birthMonth = form.get("birth_month") as string;
    const birthDay = form.get("birth_day") as string;
    const birthDate =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
        : undefined;

    const payload: RegisterPayload = {
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      whatsapp: (form.get("whatsapp") as string) || undefined,
      password: form.get("password") as string,
      password_confirmation: form.get("password_confirmation") as string,
      gender: (form.get("gender") as "male" | "female") || undefined,
      birth_date: birthDate,
      nationality: (form.get("nationality") as string) || undefined,
      country: (form.get("country") as string) || undefined,
      education_level: (form.get("education_level") as string) || undefined,
      heard_about: (form.get("heard_about") as string) || undefined,
      works_full_time: form.get("works_full_time") === "yes" ? true : form.get("works_full_time") === "no" ? false : undefined,
      participates_other_programs:
        form.get("participates_other_programs") === "yes"
          ? true
          : form.get("participates_other_programs") === "no"
            ? false
            : undefined,
      daily_hours: (form.get("daily_hours") as string) || undefined,
      accept_terms: form.get("accept_terms") === "on",
    };

    try {
      clearToken();
      await authApi.register(payload);
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || isLoggedIn) {
    return null;
  }

  return (
    <AuthLayout title="إنشاء حساب" subtitle="انضم إلى معهد إعداد دعاة التوحيد والسنة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="first_name" required placeholder="الاسم الأول" />
          <Input name="last_name" required placeholder="الاسم الأخير" />
        </div>
        <Input name="email" type="email" required placeholder="البريد الإلكتروني" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="phone" placeholder="رقم الجوال" />
          <Input name="whatsapp" placeholder="رقم الواتساب" />
        </div>
        <PasswordInput name="password" required placeholder="كلمة المرور" />
        <PasswordInput name="password_confirmation" required placeholder="تأكيد كلمة المرور" />

        <div className="grid gap-4 sm:grid-cols-2">
          <select name="gender" className={selectClass} defaultValue="">
            <option value="" disabled>النوع</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          <Input name="nationality" placeholder="الجنسية" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input name="birth_day" placeholder="يوم الميلاد" inputMode="numeric" />
          <Input name="birth_month" placeholder="شهر الميلاد" inputMode="numeric" />
          <Input name="birth_year" placeholder="سنة الميلاد" inputMode="numeric" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="country" placeholder="بلد الإقامة" />
          <select name="education_level" className={selectClass} defaultValue="">
            <option value="">المستوى التعليمي</option>
            <option value="primary">ابتدائي</option>
            <option value="preparatory">إعدادي</option>
            <option value="secondary">ثانوي</option>
            <option value="diploma">معهد / دiploma</option>
            <option value="bachelor">جامعي</option>
            <option value="master">ماجستير</option>
            <option value="phd">دكتوراه</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        <select name="heard_about" className={selectClass} defaultValue="">
          <option value="">كيف سمعت عن المعهد؟</option>
          <option value="friend">صديق</option>
          <option value="social">وسائل التواصل</option>
          <option value="search">محرك بحث</option>
          <option value="teacher">أحد المشايخ</option>
          <option value="other">أخرى</option>
        </select>

        <div className="grid gap-4 sm:grid-cols-2">
          <select name="works_full_time" className={selectClass} defaultValue="">
            <option value="">هل تعمل بدوام كامل؟</option>
            <option value="yes">نعم</option>
            <option value="no">لا</option>
          </select>
          <select name="participates_other_programs" className={selectClass} defaultValue="">
            <option value="">هل تشارك في برامج أخرى؟</option>
            <option value="yes">نعم</option>
            <option value="no">لا</option>
          </select>
        </div>

        <select name="daily_hours" className={selectClass} defaultValue="">
          <option value="">كم ساعة يومياً تستطيع تخصيصها؟</option>
          <option value="1-2">1-2 ساعة</option>
          <option value="2-4">2-4 ساعات</option>
          <option value="4-6">4-6 ساعات</option>
          <option value="6+">أكثر من 6 ساعات</option>
        </select>

        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="accept_terms" required className="mt-1 accent-brand" />
          <span>
            أوافق على{" "}
            <Link href="/about" className="text-brand hover:underline">سياسة الخصوصية</Link>
            {" "}والشروط والأحكام
          </span>
        </label>

        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </Button>
      </form>
      <AuthLinks />
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/volunteer" className="font-semibold text-brand hover:underline">
          التطوع بفريق العمل
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted"><Link href="/">← العودة للموقع</Link></p>
    </AuthLayout>
  );
}
