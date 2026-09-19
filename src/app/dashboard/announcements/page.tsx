"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { api } from "@/lib/api";
import type { Announcement } from "@/types";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    api.getAnnouncements().then((res) => setItems(res.data)).catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الإشعارات</h1>
        <p className="mt-1 text-sm text-muted">آخر الأخبار والإعلانات من المعهد</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="card block p-5 transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-brand-dark">{item.title_ar}</h3>
                {item.excerpt_ar && (
                  <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{item.excerpt_ar}</p>
                )}
              </div>
              {item.published_at && (
                <span className="shrink-0 text-xs text-muted">{item.published_at}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="card p-12 text-center text-muted">لا توجد إعلانات حالياً</div>
      )}
    </DashboardLayout>
  );
}
