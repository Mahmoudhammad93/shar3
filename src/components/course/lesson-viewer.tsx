"use client";

import { CheckCircle2, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { VideoPlayer } from "@/components/ui/video-player";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export interface LessonItem {
  id: number;
  title_ar: string;
  content_ar?: string;
  video_url?: string;
  duration_minutes?: number;
  sort_order?: number;
  is_completed?: boolean;
  progress_percent?: number;
}

function formatContent(content?: string) {
  if (!content) return null;
  return content.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    const html = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/• /g, "• ");
    return (
      <p
        key={i}
        className="mb-3 leading-8 text-muted last:mb-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export function LessonViewer({
  lessons,
  activeLesson,
  onSelectLesson,
  onComplete,
  completing,
  progress,
  readOnly = false,
}: {
  lessons: LessonItem[];
  activeLesson: LessonItem | null;
  onSelectLesson: (lesson: LessonItem) => void;
  onComplete?: (lessonId: number) => void;
  completing?: boolean;
  progress?: number;
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {activeLesson ? (
          <>
            <VideoPlayer url={activeLesson.video_url} title={activeLesson.title_ar} />
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-brand-dark">{activeLesson.title_ar}</h3>
                  {activeLesson.duration_minutes && (
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <Clock className="h-4 w-4" />
                      {activeLesson.duration_minutes} دقيقة
                    </span>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">{formatContent(activeLesson.content_ar)}</div>
                {!readOnly && onComplete && !activeLesson.is_completed && (
                  <Button
                    className="mt-6"
                    onClick={() => onComplete(activeLesson.id)}
                    disabled={completing}
                  >
                    {completing ? "جاري الحفظ..." : "إكمال الدرس ✓"}
                  </Button>
                )}
                {!readOnly && activeLesson.is_completed && (
                  <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
                    <CheckCircle2 className="h-4 w-4" />
                    تم إكمال هذا الدرس
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center text-muted">لا توجد دروس متاحة</Card>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-brand-dark">دروس المادة</h3>
          {progress !== undefined && (
            <span className="text-sm font-medium text-gold">{progress}%</span>
          )}
        </div>
        {progress !== undefined && <ProgressBar value={progress} className="mb-4" />}
        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const active = activeLesson?.id === lesson.id;
            const completed = lesson.is_completed;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson)}
                className={cn(
                  "card w-full p-4 text-start transition",
                  active && "border-brand bg-brand/5 ring-1 ring-brand/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                      completed ? "bg-brand/15 text-brand" : "bg-background text-muted"
                    )}
                  >
                    {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-brand-dark">{lesson.title_ar}</p>
                    {lesson.duration_minutes && (
                      <p className="mt-1 text-xs text-muted">{lesson.duration_minutes} دقيقة</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CurriculumPreview({
  lessons,
  lockedMessage = "محتوى الدرس متاح بعد التسجيل في الدورة",
}: {
  lessons: { id: number; title_ar: string; content_ar?: string; duration_minutes?: number; sort_order: number }[];
  lockedMessage?: string;
}) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isPreview = index === 0;
        return (
          <details
            key={lesson.id}
            className="group rounded-2xl border border-border bg-surface shadow-sm"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold text-brand-dark">
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-sm text-brand">
                  {index + 1}
                </span>
                {lesson.title_ar}
              </span>
              <span className="flex items-center gap-2">
                {lesson.duration_minutes && (
                  <span className="flex items-center gap-1 text-xs font-normal text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {lesson.duration_minutes} د
                  </span>
                )}
                {!isPreview && <Lock className="h-4 w-4 text-muted" />}
              </span>
            </summary>
            <div className="border-t border-border px-4 py-4 text-sm">
              {isPreview && lesson.content_ar ? (
                <div className="leading-7 text-muted">
                  {lesson.content_ar.split("\n").slice(0, 6).map((line, i) => (
                    <p key={i} className="mb-2">{line.replace(/\*\*/g, "")}</p>
                  ))}
                  <p className="mt-3 text-xs text-brand">… سجّل في الدورة لمشاهدة بقية المحتوى</p>
                </div>
              ) : (
                <p className="flex items-center gap-2 text-muted">
                  <Lock className="h-4 w-4 shrink-0" />
                  {lockedMessage}
                </p>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
