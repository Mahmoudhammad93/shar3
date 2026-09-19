"use client";

import { GraduationCap, Layers } from "lucide-react";

interface AcademicContextBannerProps {
  level?: string | null;
  year?: string | null;
  semester?: string | null;
}

export function AcademicContextBanner({ level, year, semester }: AcademicContextBannerProps) {
  if (!level && !year && !semester) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl border border-brand/15 bg-brand/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-brand">
        <GraduationCap className="h-5 w-5" />
        <h2 className="text-base font-bold">مسارك الأكاديمي الحالي</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "المستوى", value: level },
          { label: "السنة الدراسية", value: year },
          { label: "الفصل الحالي", value: semester },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted">{item.label}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-brand-dark">
              <Layers className="h-4 w-4 text-gold" />
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
