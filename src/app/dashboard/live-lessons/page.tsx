"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { studentApi, type ScheduleItem } from "@/lib/auth";

function getCountdown(target: string) {
  const diff = new Date(target.replace(" ", "T")).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, live: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes, live: false };
}

export default function LiveLessonsPage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    studentApi.schedule().then((res) => {
      setItems(res.data.filter((item) => item.type === "live"));
    }).catch(console.error);
  }, []);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(a.starts_at.replace(" ", "T")).getTime() -
          new Date(b.starts_at.replace(" ", "T")).getTime()
      ),
    [items]
  );

  const featured = sorted[0];
  const countdown = featured ? getCountdown(featured.starts_at) : null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الدروس المباشرة</h1>
        <p className="mt-1 text-sm text-muted">المحاضرات القادمة والجلسات المباشرة</p>
      </div>

      {featured && countdown && (
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-brand px-6 py-8 text-white md:px-8">
          <div className="islamic-pattern absolute inset-0 opacity-20" />
          <div className="relative">
            <p className="text-sm text-white/70">الدرس القادم</p>
            <h2 className="mt-1 text-2xl font-bold">{featured.title_ar}</h2>
            {featured.course && <p className="mt-1 text-sm text-white/75">{featured.course}</p>}

            {!countdown.live ? (
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { label: "أيام", value: countdown.days },
                  { label: "ساعات", value: countdown.hours },
                  { label: "دقائق", value: countdown.minutes },
                ].map((part) => (
                  <div key={part.label} className="min-w-[72px] rounded-xl bg-white/10 px-4 py-3 text-center">
                    <p className="text-2xl font-bold text-gold">{part.value}</p>
                    <p className="text-xs text-white/65">{part.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gold-light">الدرس متاح الآن</p>
            )}

            {featured.meeting_url && (
              <Button
                href={featured.meeting_url}
                variant="gold"
                size="lg"
                className="mt-6"
              >
                دخول الدرس
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.slice(featured ? 1 : 0).map((item) => (
          <div key={item.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h3 className="font-bold text-brand-dark">{item.title_ar}</h3>
              {item.course && <p className="mt-1 text-sm text-muted">{item.course}</p>}
              <p className="mt-1 text-xs text-muted">{item.starts_at}</p>
            </div>
            {item.meeting_url ? (
              <Button href={item.meeting_url} variant="primary" size="sm">
                دخول الدرس
              </Button>
            ) : (
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs text-brand">قريباً</span>
            )}
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="card p-12 text-center text-muted">لا توجد دروس مباشرة مجدولة حالياً</div>
      )}
    </DashboardLayout>
  );
}
