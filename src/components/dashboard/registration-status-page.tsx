"use client";

import Link from "next/link";
import { Clock, LogOut } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

interface RegistrationStatusPageProps {
  title: string;
  message: string;
  detail?: string | null;
  tone?: "pending" | "rejected";
}

export function RegistrationStatusPage({
  title,
  message,
  detail,
  tone = "pending",
}: RegistrationStatusPageProps) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-brand">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <AuthLayout title={title} subtitle={message}>
      <div
        className={`rounded-2xl border p-6 text-center ${
          tone === "rejected"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/80">
          <Clock className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold">{message}</p>
        {detail && <p className="mt-3 text-sm leading-7 opacity-90">{detail}</p>}
        {user && (
          <p className="mt-4 text-sm opacity-80">
            {user.name} — {user.email}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-brand-dark transition hover:bg-brand/5"
        >
          العودة للموقع
        </Link>
        <Button type="button" variant="outline" className="flex-1" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </AuthLayout>
  );
}
