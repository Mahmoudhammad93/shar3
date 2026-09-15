"use client";

import { ChevronLeft, ListTree } from "lucide-react";
import { cn } from "@/lib/cn";
import { scrollToStudyPlanSection, type StudyPlanIndexYear } from "@/lib/study-plan-anchors";

export function StudyPlanIndex({ years }: { years: StudyPlanIndexYear[] }) {
  if (years.length === 0) return null;

  return (
    <nav
      className="mb-8 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)] md:p-5"
      aria-label="فهرس الخطة الدراسية"
    >
      <div className="mb-4 flex items-center gap-2 text-brand">
        <ListTree className="h-5 w-5" strokeWidth={1.75} />
        <h2 className="text-sm font-semibold">فهرس الخطة الدراسية</h2>
      </div>

      <ul className="space-y-4">
        {years.map((year) => (
          <li key={year.anchorId} className="rounded-form border border-border/80 bg-brand/[0.02] p-3">
            <button
              type="button"
              onClick={() => scrollToStudyPlanSection(year.anchorId)}
              className="group flex w-full items-start justify-between gap-2 text-start transition hover:text-brand"
            >
              <span>
                <span className="block text-sm font-bold text-brand-dark group-hover:text-brand">
                  {year.name}
                </span>
                {year.levelName && (
                  <span className="mt-0.5 block text-xs text-gold">{year.levelName}</span>
                )}
              </span>
              <ChevronLeft
                className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-brand"
                strokeWidth={1.75}
              />
            </button>

            {year.semesters.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-s-2 border-gold/25 ps-3">
                {year.semesters.map((semester) => (
                  <li key={semester.anchorId}>
                    <button
                      type="button"
                      onClick={() => scrollToStudyPlanSection(semester.anchorId)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-form px-2 py-1.5 text-start text-sm text-muted transition",
                        "hover:bg-brand/5 hover:text-brand-dark",
                      )}
                    >
                      <span>{semester.name}</span>
                      <ChevronLeft className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
