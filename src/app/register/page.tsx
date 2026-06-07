"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, AuthLinks } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { authApi, clearToken } from "@/lib/auth";

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
    try {
      clearToken();
      await authApi.register({
        name: form.get("name") as string,
        email: form.get("email") as string,
        phone: (form.get("phone") as string) || undefined,
        password: form.get("password") as string,
        password_confirmation: form.get("password_confirmation") as string,
      });
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
    <AuthLayout title="إنشاء حساب" subtitle="انضم إلى معهد علم شرعي">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" required placeholder="الاسم الكامل" />
        <Input name="email" type="email" required placeholder="البريد الإلكتروني" />
        <Input name="phone" placeholder="رقم الجوال" />
        <Input name="password" type="password" required placeholder="كلمة المرور" />
        <Input name="password_confirmation" type="password" required placeholder="تأكيد كلمة المرور" />
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </Button>
      </form>
      <AuthLinks />
      <p className="mt-8 text-center text-xs text-muted"><Link href="/">← العودة للموقع</Link></p>
    </AuthLayout>
  );
}
