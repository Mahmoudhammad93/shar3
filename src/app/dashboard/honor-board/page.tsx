"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function HonorBoardPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">لوحة شرف</h1>
        <p className="mt-1 text-sm text-muted">أبرز الطلاب المتفوقين في المعهد</p>
      </div>
      <div className="card p-12 text-center text-muted">
        سيتم عرض لوحة الشرف قريباً
      </div>
    </DashboardLayout>
  );
}
