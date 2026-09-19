"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, AuthLinks } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/components/providers/auth-provider";
import { authApi } from "@/lib/auth";
import { getStudentDashboardPath } from "@/lib/student-auth";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, refreshUser, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace(getStudentDashboardPath(user));
    }
  }, [authLoading, isLoggedIn, user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await authApi.login(form.get("email") as string, form.get("password") as string);
      await refreshUser();
      router.push(getStudentDashboardPath(res.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || isLoggedIn) {
    return null;
  }

  return (
    <AuthLayout title="تسجيل الدخول" subtitle="مرحباً بعودتك">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" required placeholder="البريد الإلكتروني" />
        <PasswordInput name="password" required placeholder="كلمة المرور" />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="rounded border-border" />
          تذكرني
        </label>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري الدخول..." : "دخول"}
        </Button>
      </form>
      <AuthLinks />
      <p className="mt-8 text-center text-xs text-muted"><Link href="/">← العودة للموقع</Link></p>
    </AuthLayout>
  );
}
