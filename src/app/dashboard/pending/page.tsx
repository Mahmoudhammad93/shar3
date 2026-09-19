"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationStatusPage } from "@/components/dashboard/registration-status-page";
import { useAuth } from "@/components/providers/auth-provider";
import { canAccessAcademicDashboard, isPendingStudent } from "@/lib/student-auth";

export default function PendingRegistrationPage() {
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

    if (!isPendingStudent(user)) {
      router.replace("/dashboard/rejected");
    }
  }, [loading, user, router]);

  if (loading || !user || !isPendingStudent(user)) {
    return null;
  }

  return (
    <RegistrationStatusPage
      title="طلب التسجيل قيد المراجعة"
      message="طلب التسجيل قيد المراجعة من الإدارة"
      detail="تم استلام طلبك بنجاح. سيتم إشعارك عند اعتماد حسابك وتفعيل مسارك الدراسي."
      tone="pending"
    />
  );
}
