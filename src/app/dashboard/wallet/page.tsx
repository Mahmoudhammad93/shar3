"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">المحفظة</h1>
        <p className="mt-1 text-sm text-muted">إدارة الرصيد والمدفوعات</p>
      </div>
      <div className="card p-12 text-center text-muted">
        سيتم تفعيل المحفظة قريباً
      </div>
    </DashboardLayout>
  );
}
