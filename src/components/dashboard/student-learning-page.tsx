"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LessonViewer } from "@/components/course/lesson-viewer";
import { ProgressBar } from "@/components/ui";
import { CourseThumbnail } from "@/components/ui/course-thumbnail";
import { Button } from "@/components/ui/button";
import { studentApi, type StudentLesson } from "@/lib/auth";

function firstUnlockedLesson(lessons: StudentLesson[]): StudentLesson | null {
  return lessons.find((l) => !l.is_locked) || lessons[0] || null;
}

export type LearningPayload = {
  /** Present for Course learning; may be null for Subject-only / preparation. */
  course: {
    id: number;
    title_ar: string;
    slug: string;
    image?: string;
    description_ar?: string;
    teacher?: string;
  } | null;
  subject?: {
    id: number;
    name_ar: string;
    slug: string;
    primary_text_ar?: string | null;
    supplementary_text_ar?: string | null;
    memorization_ar?: string | null;
  } | null;
  progress: number;
  lessons: StudentLesson[];
};

export function StudentLearningPage({
  title,
  subtitle,
  backHref = "/dashboard/courses",
  backLabel = "← العودة لموادي",
  emptyMessage = "لم تتم إضافة دروس لهذا المقرر بعد.",
  lessonListTitle = "دروس المادة",
  progressLabel = "التقدم في المادة",
  load,
  reload,
}: {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  emptyMessage?: string;
  lessonListTitle?: string;
  progressLabel?: string;
  load: () => Promise<LearningPayload>;
  reload: () => Promise<LearningPayload>;
}) {
  const [payload, setPayload] = useState<(LearningPayload & { displayTitle: string }) | null>(null);
  const [activeLesson, setActiveLesson] = useState<StudentLesson | null>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressSaveRef = useRef<Record<number, number>>({});

  useEffect(() => {
    load()
      .then((res) => {
        const displayTitle =
          title ?? res.subject?.name_ar ?? res.course?.title_ar ?? "المقرر";
        setPayload({ ...res, displayTitle });
        const target =
          res.lessons.find((l) => !l.is_completed && !l.is_locked) ||
          firstUnlockedLesson(res.lessons);
        setActiveLesson(target);
      })
      .catch(console.error);
  }, [load, title]);

  const saveProgress = useCallback(async (lessonId: number, percent: number) => {
    const lastSaved = progressSaveRef.current[lessonId] ?? 0;
    const milestone = percent >= 95 || percent - lastSaved >= 10;
    if (!milestone) return;

    progressSaveRef.current[lessonId] = percent;

    try {
      await studentApi.updateLessonProgress(lessonId, percent);
    } catch {
      // Progress sync is best-effort.
    }
  }, []);

  async function handleQuizPassed(lessonId: number) {
    setPayload((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lessons: prev.lessons.map((l) =>
          l.id === lessonId ? { ...l, quiz_passed: true } : l
        ),
      };
    });
    setActiveLesson((prev) => (prev?.id === lessonId ? { ...prev, quiz_passed: true } : prev));
  }

  async function markComplete(lessonId: number) {
    setCompleting(true);
    setError(null);
    try {
      await studentApi.completeLesson(lessonId);
      const updated = await reload();
      const displayTitle =
        title ?? updated.subject?.name_ar ?? updated.course?.title_ar ?? "المقرر";
      setPayload({ ...updated, displayTitle });
      const current = updated.lessons.find((l) => l.id === lessonId) || null;
      setActiveLesson(current);
      const next = updated.lessons.find((l) => !l.is_completed && !l.is_locked);
      if (next && next.id !== lessonId) {
        setTimeout(() => setActiveLesson(next), 800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إكمال الدرس");
    } finally {
      setCompleting(false);
    }
  }

  if (!payload) {
    return (
      <DashboardLayout>
        <p className="text-muted">جاري التحميل...</p>
      </DashboardLayout>
    );
  }

  const thumbnailSlug = payload.course?.slug ?? payload.subject?.slug ?? "subject";
  const teacher = payload.course?.teacher;
  const description =
    payload.course?.description_ar ??
    payload.subject?.primary_text_ar ??
    undefined;

  return (
    <DashboardLayout>
      <div
        className="relative mb-8 overflow-hidden rounded-2xl text-white"
        style={{ backgroundColor: "var(--brand-primary, #004d40)" }}
      >
        <div className="grid md:grid-cols-[220px_1fr]">
          <CourseThumbnail
            title={payload.displayTitle}
            slug={thumbnailSlug}
            image={payload.course?.image}
            aspectClass="aspect-[16/10] md:aspect-auto md:min-h-full md:h-full"
            className="md:rounded-none"
          />
          <div className="relative px-6 py-8 md:px-8">
            <div className="islamic-pattern absolute inset-0 opacity-15" />
            <div className="relative">
              <p className="text-sm text-white/70">{subtitle ?? "دروس المادة"}</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">{payload.displayTitle}</h1>
              {teacher && (
                <p className="mt-2 text-sm text-white/75">المعلم: {teacher}</p>
              )}
              {description && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{description}</p>
              )}
              <div className="mt-5 max-w-md">
                <div className="mb-2 flex justify-between text-xs text-white/70">
                  <span>{progressLabel}</span>
                  <span>{payload.progress}%</span>
                </div>
                <ProgressBar value={payload.progress} className="h-2 bg-white/20" />
              </div>
              <Button href={backHref} variant="white" size="sm" className="mt-5">
                {backLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {payload.lessons.length === 0 ? (
        <div className="card p-12 text-center text-muted">
          <p>{emptyMessage}</p>
          <Link href={backHref} className="mt-4 inline-block text-brand hover:underline">
            {backLabel}
          </Link>
        </div>
      ) : (
        <LessonViewer
          lessons={payload.lessons}
          activeLesson={activeLesson}
          onSelectLesson={(lesson) => {
            if (lesson.is_locked) return;
            const full = payload.lessons.find((l) => l.id === lesson.id) ?? null;
            setActiveLesson(full);
            setError(null);
          }}
          onComplete={markComplete}
          onProgressUpdate={saveProgress}
          onQuizPassed={handleQuizPassed}
          completing={completing}
          progress={payload.progress}
          lessonListTitle={lessonListTitle}
        />
      )}
    </DashboardLayout>
  );
}
