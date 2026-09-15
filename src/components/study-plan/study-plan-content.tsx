"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Layers } from "lucide-react";
import { StudyPlanTables, countStudyPlanSubjects, countStudyPlanYears } from "@/components/study-plan/study-plan-tables";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import type { AcademicLevel } from "@/types";

export function StudyPlanContent() {
  const [levels, setLevels] = useState<AcademicLevel[]>([]);
  const [intro, setIntro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([api.getAcademicStructureLive(), api.getSettingsLive()])
      .then(([structureRes, settingsRes]) => {
        if (!active) return;
        setLevels(structureRes.data);
        setIntro(settingsRes.data.study_plan_intro_ar ?? null);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-brand/10" />
          <div className="h-96 animate-pulse rounded-2xl bg-brand/10" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
          تعذّر تحميل الخطة الدراسية. يرجى المحاولة لاحقاً.
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      {intro && (
        <div className="mb-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <div className="mb-3 flex items-center gap-2 text-gold">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-semibold">نبذة عن الخطة</span>
          </div>
          <p className="leading-8 text-muted">{intro}</p>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Layers, label: "مراحل دراسية", value: String(levels.length) },
          {
            icon: GraduationCap,
            label: "سنوات أكاديمية",
            value: String(countStudyPlanYears(levels)),
          },
          {
            icon: BookOpen,
            label: "مواد مسجّلة",
            value: String(countStudyPlanSubjects(levels)),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-dark">{item.value}</p>
              <p className="text-sm text-muted">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <StudyPlanTables levels={levels} />
    </Container>
  );
}
