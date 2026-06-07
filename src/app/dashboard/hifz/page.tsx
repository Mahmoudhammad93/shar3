"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function HifzPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">متابعة الحفظ</h1>
        <p className="mt-1 text-sm text-muted">تتبّع progress حفظك ومراجعة السور</p>
      </div>
      <div className="card p-12 text-center text-muted">
        سيتم تفعيل متابعة الحفظ قريباً
      </div>
    </DashboardLayout>
  );
}
