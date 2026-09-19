"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function ForumPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">المنتدى الدراسي</h1>
        <p className="mt-1 text-sm text-muted">ناقش الدروس واطرح أسئلتك مع زملائك</p>
      </div>
      <div className="card p-12 text-center text-muted">
        سيتم تفعيل المنتدى الدراسي قريباً
      </div>
    </DashboardLayout>
  );
}
