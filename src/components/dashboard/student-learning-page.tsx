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

type LearningPayload = {
  course: { id: number; title_ar: string; slug: string; image?: string; description_ar?: string; teacher?: string };
  progress: number;
  lessons: StudentLesson[];
};

export function StudentLearningPage({
  title,
  subtitle,
  backHref = "/dashboard/courses",
  backLabel = "← العودة لموادي",
  load,
  reload,
}: {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  load: () => Promise<LearningPayload>;
  reload: () => Promise<LearningPayload>;
}) {
  const [course, setCourse] = useState<(LearningPayload & { displayTitle: string }) | null>(null);
  const [activeLesson, setActiveLesson] = useState<StudentLesson | null>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressSaveRef = useRef<Record<number, number>>({});

  useEffect(() => {
    load().then((res) => {
      setCourse({ ...res, displayTitle: title ?? res.course.title_ar });
      const target =
        res.lessons.find((l) => !l.is_completed && !l.is_locked) ||
        firstUnlockedLesson(res.lessons);
      setActiveLesson(target);
    }).catch(console.error);
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
    setCourse((prev) => {
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
      setCourse({ ...updated, displayTitle: title ?? updated.course.title_ar });
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

  if (!course) {
    return (
      <DashboardLayout>
        <p className="text-muted">جاري التحميل...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative mb-8 overflow-hidden rounded-2xl text-white" style={{ backgroundColor: "var(--brand-primary, #004d40)" }}>
        <div className="grid md:grid-cols-[220px_1fr]">
          <CourseThumbnail
            title={course.displayTitle}
            slug={course.course.slug}
            image={course.course.image}
            aspectClass="aspect-[16/10] md:aspect-auto md:min-h-full md:h-full"
            className="md:rounded-none"
          />
          <div className="relative px-6 py-8 md:px-8">
            <div className="islamic-pattern absolute inset-0 opacity-15" />
            <div className="relative">
              <p className="text-sm text-white/70">{subtitle ?? "دروس المادة"}</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">{course.displayTitle}</h1>
              {course.course.teacher && (
                <p className="mt-2 text-sm text-white/75">المعلم: {course.course.teacher}</p>
              )}
              {course.course.description_ar && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{course.course.description_ar}</p>
              )}
              <div className="mt-5 max-w-md">
                <div className="mb-2 flex justify-between text-xs text-white/70">
                  <span>التقدم في المادة</span>
                  <span>{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} className="h-2 bg-white/20" />
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

      {course.lessons.length === 0 ? (
        <div className="card p-12 text-center text-muted">
          <p>لا توجد دروس منشورة في هذه المادة بعد</p>
          <Link href={backHref} className="mt-4 inline-block text-brand hover:underline">
            العودة لموادي
          </Link>
        </div>
      ) : (
        <LessonViewer
          lessons={course.lessons}
          activeLesson={activeLesson}
          onSelectLesson={(lesson) => {
            if (lesson.is_locked) return;
            const full = course.lessons.find((l) => l.id === lesson.id) ?? null;
            setActiveLesson(full);
            setError(null);
          }}
          onComplete={markComplete}
          onProgressUpdate={saveProgress}
          onQuizPassed={handleQuizPassed}
          completing={completing}
          progress={course.progress}
        />
      )}
    </DashboardLayout>
  );
}
