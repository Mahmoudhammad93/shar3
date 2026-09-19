"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { studentApi } from "@/lib/auth";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type EnrollmentState = "loading" | "none" | "pending" | "approved" | "completed";

export function EnrollmentForm({ courseId, courseTitle }: { courseId: number; courseTitle: string }) {
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [guestForm, setGuestForm] = useState({ name: "", email: "", phone: "" });
  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>("loading");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;

    if (!isLoggedIn || !user) {
      setEnrollmentState("none");
      return;
    }

    studentApi
      .courses()
      .then((res) => {
        const existing = res.data.find((item) => item.course.id === courseId);
        if (!existing) {
          setEnrollmentState("none");
          return;
        }
        setEnrollmentState(existing.status as EnrollmentState);
      })
      .catch(() => setEnrollmentState("none"));
  }, [mounted, authLoading, isLoggedIn, user, courseId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLoggedIn && user) {
        const form = new FormData(formEl);
        const res = await studentApi.enroll({
          course_id: courseId,
          notes: (form.get("notes") as string) || undefined,
        });
        setSuccess(res.message);
        setEnrollmentState(
          res.enrollment.status === "pending" ? "pending" : "approved"
        );
        formEl.reset();
        if (res.enrollment.status === "approved") {
          setTimeout(() => router.push("/dashboard/courses"), 1500);
        }
      } else {
        const form = new FormData(formEl);
        const res = await api.postEnrollment({
          name: form.get("name") as string,
          email: form.get("email") as string,
          phone: (form.get("phone") as string) || undefined,
          course_id: courseId,
          notes: (form.get("notes") as string) || undefined,
        });

        if (res.ok) {
          const data = await res.json();
          setSuccess(data.message);
          formEl.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const showSkeleton = !mounted || authLoading || (isLoggedIn && enrollmentState === "loading");

  if (showSkeleton) {
    return (
      <Card className="border-brand/20 bg-brand/5">
        <CardContent className="p-6">
          <div className="h-6 w-2/3 animate-pulse rounded-lg bg-brand/10" />
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-brand/5" />
          <div className="mt-4 h-11 animate-pulse rounded-xl bg-brand/5" />
        </CardContent>
      </Card>
    );
  }

  if (isLoggedIn && (enrollmentState === "approved" || enrollmentState === "completed")) {
    return (
      <Card className="border-brand/20 bg-brand/5">
        <CardContent className="p-6 text-center">
          <h3 className="mb-2 text-lg font-bold text-brand-dark">مسجّل في هذه الدورة</h3>
          <p className="mb-4 text-sm text-muted">يمكنك متابعة الدروس من لوحة التحكم</p>
          <Button href={`/dashboard/courses/${courseId}`} variant="primary" className="w-full">
            متابعة الدراسة
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoggedIn && enrollmentState === "pending") {
    return (
      <Card className="border-brand/20 bg-brand/5">
        <CardContent className="p-6 text-center">
          <h3 className="mb-2 text-lg font-bold text-brand-dark">طلب التسجيل قيد المراجعة</h3>
          <p className="text-sm text-muted">سيتم إشعارك بعد موافقة الإدارة</p>
          <Button href="/dashboard/courses" variant="outline" className="mt-4 w-full">
            الذهاب إلى موادي
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-brand/20 bg-brand/5">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-bold text-brand-dark">التسجيل في: {courseTitle}</h3>

        {isLoggedIn && user && (
          <div className="mb-4 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm">
            <p className="font-medium text-brand-dark">{user.name}</p>
            <p className="text-muted">{user.email}</p>
            <p className="mt-2 text-xs text-muted">سيتم ربط التسجيل بحسابك مباشرةً</p>
          </div>
        )}

        {!isLoggedIn && (
          <p className="mb-4 text-sm text-muted">
            لديك حساب؟{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              سجّل الدخول
            </Link>{" "}
            لتظهر الدورة في لوحة التحكم فوراً
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoggedIn && (
            <>
              <Input
                name="name"
                required
                placeholder="الاسم الكامل"
                value={guestForm.name}
                onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
              />
              <Input
                name="email"
                type="email"
                required
                placeholder="البريد الإلكتروني"
                value={guestForm.email}
                onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
              />
              <Input
                name="phone"
                placeholder="رقم الجوال"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
              />
            </>
          )}
          <Textarea name="notes" rows={3} placeholder="ملاحظات (اختياري)" />
          {success && <p className="rounded-xl bg-brand/10 p-3 text-sm text-brand">{success}</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={loading} variant="primary" className="w-full">
            {loading ? "جاري التسجيل..." : isLoggedIn ? "التسجيل في الدورة" : "إرسال طلب التسجيل"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
