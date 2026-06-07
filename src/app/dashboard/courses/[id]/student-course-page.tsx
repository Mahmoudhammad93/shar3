"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LessonViewer } from "@/components/course/lesson-viewer";
import { ProgressBar } from "@/components/ui";
import { CourseThumbnail } from "@/components/ui/course-thumbnail";
import { Button } from "@/components/ui/button";
import { studentApi, type StudentLesson } from "@/lib/auth";

export function StudentCoursePage({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<{
    course: { id: number; title_ar: string; slug: string; image?: string; description_ar?: string; teacher?: string };
    progress: number;
    lessons: StudentLesson[];
  } | null>(null);
  const [activeLesson, setActiveLesson] = useState<StudentLesson | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    studentApi.course(courseId).then((res) => {
      setCourse(res);
      const firstIncomplete = res.lessons.find((l) => !l.is_completed) || res.lessons[0] || null;
      setActiveLesson(firstIncomplete);
    }).catch(console.error);
  }, [courseId]);

  async function markComplete(lessonId: number) {
    setCompleting(true);
    try {
      await studentApi.completeLesson(lessonId);
      const updated = await studentApi.course(courseId);
      setCourse(updated);
      const current = updated.lessons.find((l) => l.id === lessonId) || null;
      setActiveLesson(current);
      const next = updated.lessons.find((l) => !l.is_completed);
      if (next && next.id !== lessonId) {
        setTimeout(() => setActiveLesson(next), 800);
      }
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
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#0a3d34] text-white">
        <div className="grid md:grid-cols-[220px_1fr]">
          <CourseThumbnail
            title={course.course.title_ar}
            slug={course.course.slug}
            image={course.course.image}
            aspectClass="aspect-[16/10] md:aspect-auto md:min-h-full md:h-full"
            className="md:rounded-none"
          />
          <div className="relative px-6 py-8 md:px-8">
            <div className="islamic-pattern absolute inset-0 opacity-15" />
            <div className="relative">
              <p className="text-sm text-white/70">دروس المادة</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">{course.course.title_ar}</h1>
              {course.course.teacher && (
                <p className="mt-2 text-sm text-white/75">المعلم: {course.course.teacher}</p>
              )}
              {course.course.description_ar && (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{course.course.description_ar}</p>
              )}
              <div className="mt-5 max-w-md">
                <div className="mb-2 flex justify-between text-xs text-white/70">
                  <span>التقدم في الدورة</span>
                  <span>{course.progress}%</span>
                </div>
                <ProgressBar value={course.progress} className="h-2 bg-white/20" />
              </div>
              <Button href="/dashboard/courses" variant="white" size="sm" className="mt-5">
                ← العودة لموادي
              </Button>
            </div>
          </div>
        </div>
      </div>

      {course.lessons.length === 0 ? (
        <div className="card p-12 text-center text-muted">
          <p>لا توجد دروس منشورة في هذه الدورة بعد</p>
          <Link href="/dashboard/courses" className="mt-4 inline-block text-brand hover:underline">
            العودة لموادي
          </Link>
        </div>
      ) : (
        <LessonViewer
          lessons={course.lessons}
          activeLesson={activeLesson}
          onSelectLesson={(lesson) => {
            const full = course.lessons.find((l) => l.id === lesson.id) ?? null;
            setActiveLesson(full);
          }}
          onComplete={markComplete}
          completing={completing}
          progress={course.progress}
        />
      )}
    </DashboardLayout>
  );
}
