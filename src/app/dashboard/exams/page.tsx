"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { studentApi, type ScheduleItem } from "@/lib/auth";

export default function ExamsPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    studentApi.schedule().then((res) => {
      setItems(res.data.filter((item) => item.type === "exam"));
    }).catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الاختبارات</h1>
        <p className="mt-1 text-sm text-muted">مواعيد الاختبارات والامتحانات القادمة</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
            <div>
              <h3 className="font-bold text-brand-dark">{item.title_ar}</h3>
              {item.course && <p className="mt-1 text-sm text-muted">{item.course}</p>}
              <p className="mt-2 text-xs text-muted">موعد الاختبار: {item.starts_at}</p>
              {item.description_ar && (
                <p className="mt-2 text-sm leading-7 text-muted">{item.description_ar}</p>
              )}
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              اختبار
            </span>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card p-12 text-center text-muted">لا توجد اختبارات مجدولة حالياً</div>
      )}
    </DashboardLayout>
  );
}
