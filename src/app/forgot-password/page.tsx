"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="استعادة كلمة المرور" subtitle="سنرسل لك رابط إعادة التعيين">
      <form className="space-y-4">
        <Input name="email" type="email" required placeholder="البريد الإلكتروني" />
        <Button type="submit" className="w-full">إرسال الرابط</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-brand hover:underline">← العودة لتسجيل الدخول</Link>
      </p>
    </AuthLayout>
  );
}
