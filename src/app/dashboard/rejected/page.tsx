"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationStatusPage } from "@/components/dashboard/registration-status-page";
import { useAuth } from "@/components/providers/auth-provider";
import { canAccessAcademicDashboard, isRejectedStudent } from "@/lib/student-auth";

export default function RejectedRegistrationPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (canAccessAcademicDashboard(user)) {
      router.replace("/dashboard/courses");
      return;
    }

    if (!isRejectedStudent(user)) {
      router.replace("/dashboard/pending");
    }
  }, [loading, user, router]);

  if (loading || !user || !isRejectedStudent(user)) {
    return null;
  }

  return (
    <RegistrationStatusPage
      title="تم رفض طلب التسجيل"
      message="تم رفض طلب التسجيل"
      detail={user.student?.rejection_reason ?? "يرجى التواصل مع إدارة المعهد للاستفسار."}
      tone="rejected"
    />
  );
}
