"use client";

import { Printer, Award } from "lucide-react";
import type { CertificateDetail } from "@/lib/auth";

export function CertificateDocument({ data }: { data: CertificateDetail }) {
  return (
    <div className="certificate-print mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border-4 border-gold bg-[#fffdf8] p-1 shadow-xl">
        <div className="relative border-2 border-brand/30 bg-gradient-to-b from-white to-[#f8fbf9] px-6 py-10 md:px-12 md:py-14">
          {/* Corner ornaments */}
          <div className="pointer-events-none absolute inset-4 border border-gold/40" />
          <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-gold" />
          <div className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-gold" />
          <div className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-gold" />
          <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-gold" />

          <div className="relative text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <Award className="h-8 w-8 text-gold" strokeWidth={1.5} />
            </div>

            <p className="text-sm font-medium tracking-wide text-gold">{data.institute_tagline || "منارة للعلوم الشرعية"}</p>
            <h1 className="mt-2 text-2xl font-bold text-brand-dark md:text-3xl">{data.institute_name}</h1>
            {data.academic_year && (
              <p className="mt-1 text-sm text-muted">{data.academic_year}</p>
            )}

            <div className="mx-auto my-6 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />

            <p className="text-lg font-semibold text-brand">شهادة إتمام</p>
            <p className="mt-2 text-sm leading-8 text-muted md:text-base">
              تشهد {data.institute_name} بأن الطالب/ـة
            </p>

            <h2 className="my-4 text-3xl font-bold text-brand-dark md:text-4xl">{data.student_name}</h2>

            <p className="text-sm leading-8 text-muted md:text-base">
              قد أتم بنجاح متطلبات مادة
            </p>
            <h3 className="my-3 text-xl font-bold text-brand md:text-2xl">{data.course_title}</h3>

            <p className="mx-auto max-w-2xl text-sm leading-8 text-muted md:text-base">
              وذلك بعد اجتياز الدروس والاختبارات المعتمدة، فنبارك له/لها هذا الإنجاز
              ونسأل الله أن ينفع به في الدنيا والآخرة.
            </p>

            <div className="mx-auto my-8 grid max-w-lg grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-border bg-white/80 px-4 py-3">
                <p className="text-xs text-muted">رقم الشهادة</p>
                <p className="mt-1 font-semibold text-brand-dark">{data.certificate_number}</p>
              </div>
              <div className="rounded-xl border border-border bg-white/80 px-4 py-3">
                <p className="text-xs text-muted">تاريخ الإصدار</p>
                <p className="mt-1 font-semibold text-brand-dark">{data.issued_at_label}</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8 md:gap-16">
              <div className="text-center">
                <div className="mx-auto mb-2 h-px w-32 bg-brand/40" />
                <p className="text-sm font-semibold text-brand-dark">
                  {data.teacher_name || "المعلم المسؤول"}
                </p>
                {data.teacher_title && (
                  <p className="mt-1 text-xs text-muted">{data.teacher_title}</p>
                )}
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 h-px w-32 bg-brand/40" />
                <p className="text-sm font-semibold text-brand-dark">إدارة المعهد</p>
                <p className="mt-1 text-xs text-muted">ختم وتوقيع</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateActions({
  fileUrl,
  onPrint,
}: {
  fileUrl?: string | null;
  onPrint: () => void;
}) {
  return (
    <div className="certificate-actions mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-dark"
      >
        <Printer className="h-4 w-4" />
        طباعة الشهادة
      </button>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5"
        >
          تحميل PDF
        </a>
      )}
    </div>
  );
}
