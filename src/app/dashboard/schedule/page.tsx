"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { studentApi, type ScheduleItem } from "@/lib/auth";
import { cn } from "@/lib/cn";

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function getDayIndex(dateStr: string) {
  const date = new Date(dateStr.replace(" ", "T"));
  return (date.getDay() + 1) % 7;
}

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    studentApi.schedule().then((res) => setItems(res.data)).catch(console.error);
  }, []);

  const grid = useMemo(() => {
    const map = new Map<string, ScheduleItem>();
    items.forEach((item) => {
      const hour = item.starts_at.split(" ")[1]?.slice(0, 5) || "08:00";
      const day = getDayIndex(item.starts_at);
      map.set(`${day}-${hour}`, item);
    });
    return map;
  }, [items]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الجدول الأسبوعي</h1>
        <p className="mt-1 text-sm text-muted">مواعيد المحاضرات والدروس خلال الأسبوع</p>
      </div>

      <div className="card overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-8 border-b border-border bg-brand/5 text-sm font-semibold text-brand-dark">
            <div className="p-3 text-center">الوقت</div>
            {DAYS.map((day) => (
              <div key={day} className="border-s border-border p-3 text-center">
                {day}
              </div>
            ))}
          </div>

          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0">
              <div className="flex items-center justify-center p-3 text-xs font-medium text-muted">
                {hour}
              </div>
              {DAYS.map((day, dayIndex) => {
                const item = grid.get(`${dayIndex}-${hour}`);
                return (
                  <div key={`${day}-${hour}`} className="min-h-[72px] border-s border-border p-2">
                    {item && (
                      <div
                        className={cn(
                          "h-full rounded-lg p-2 text-xs leading-5 text-white",
                          item.type === "exam" ? "bg-red-800/90" : "bg-brand"
                        )}
                      >
                        <p className="font-semibold">{item.title_ar}</p>
                        {item.course && <p className="mt-1 text-white/75">{item.course}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <div className="card mt-4 p-12 text-center text-muted">لا توجد مواعيد في الجدول حالياً</div>
      )}
    </DashboardLayout>
  );
}
