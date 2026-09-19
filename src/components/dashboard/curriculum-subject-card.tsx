"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export interface CurriculumSubjectItem {
  subject_id: number;
  name_ar: string;
  slug: string;
  primary_text_ar?: string | null;
  supplementary_text_ar?: string | null;
  memorization_ar?: string | null;
  course?: {
    id: number;
    slug: string;
    title_ar: string;
  } | null;
}

export function CurriculumSubjectCard({ subject }: { subject: CurriculumSubjectItem }) {
  const card = (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <BookOpen className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-brand-dark">{subject.name_ar}</h3>
      {subject.primary_text_ar && (
        <p className="mt-2 text-sm leading-7 text-muted">
          <span className="font-medium text-brand-dark">اسم الكتاب: </span>
          {subject.primary_text_ar}
        </p>
      )}
      {subject.supplementary_text_ar && (
        <p className="mt-2 text-sm leading-7 text-muted">
          <span className="font-medium text-brand-dark">تكميلي: </span>
          {subject.supplementary_text_ar}
        </p>
      )}
      {subject.memorization_ar && (
        <p className="mt-2 text-sm leading-7 text-muted">
          <span className="font-medium text-brand-dark">حفظ: </span>
          {subject.memorization_ar}
        </p>
      )}
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
        ابدأ الدراسة
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </span>
    </div>
  );

  return (
    <Link href={`/dashboard/subjects/${subject.slug}`} className="block">
      {card}
    </Link>
  );
}
