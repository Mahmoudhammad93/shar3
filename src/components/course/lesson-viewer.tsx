"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clock, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  bunnyStatusMessage,
  lessonHasEffectiveVideo,
  mediaOfType,
  resolveAudioStreamUrl,
  resolveLessonMediaItems,
  resolveVideoPlaybackUrl,
  selectPrimaryMedia,
} from "@/lib/lesson-media";
import type { LessonWithMedia } from "@/types/lesson-media";
import { TrackedVideoPlayer, VIDEO_WATCH_THRESHOLD } from "@/components/ui/tracked-video-player";
import { VideoPlayer } from "@/components/ui/video-player";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { LessonQuiz, ReportErrorButton } from "@/components/course/lesson-quiz";
import { LessonAudioPlayer } from "@/components/course/lesson-audio-player";
import { LessonAttachments } from "@/components/course/lesson-attachments";

export type LessonItem = LessonWithMedia;

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

function LessonVideoSection({
  lesson,
  readOnly,
  savedProgress,
  onProgressUpdate,
  onVideoComplete,
}: {
  lesson: LessonItem;
  readOnly: boolean;
  savedProgress: number;
  onProgressUpdate: (percent: number) => void;
  onVideoComplete: () => void;
}) {
  const items = resolveLessonMediaItems(lesson);
  const primary = selectPrimaryMedia(items, "video");
  if (!primary) return null;

  const status = primary.bunny?.status ?? null;
  const statusMessage = bunnyStatusMessage(status);
  const playbackUrl = resolveVideoPlaybackUrl(primary);

  if (!playbackUrl) {
    if (statusMessage) {
      return (
        <Card>
          <CardContent className="p-5 text-sm text-muted" role="status">
            <p className="font-semibold text-brand-dark">الفيديو</p>
            <p className="mt-2">{statusMessage}</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <section aria-label="الفيديو" className="space-y-2">
      <h4 className="text-sm font-bold text-brand-dark">الفيديو</h4>
      {!readOnly ? (
        <TrackedVideoPlayer
          key={`${lesson.id}-${playbackUrl}`}
          url={playbackUrl}
          title={lesson.title_ar}
          initialProgress={savedProgress}
          onProgressUpdate={onProgressUpdate}
          onVideoComplete={onVideoComplete}
        />
      ) : (
        <VideoPlayer url={playbackUrl} title={lesson.title_ar} />
      )}
    </section>
  );
}

export function LessonViewer({
  lessons,
  activeLesson,
  onSelectLesson,
  onComplete,
  onProgressUpdate,
  onQuizPassed,
  completing,
  progress,
  readOnly = false,
  lessonListTitle = "دروس المادة",
}: {
  lessons: LessonItem[];
  activeLesson: LessonItem | null;
  onSelectLesson: (lesson: LessonItem) => void;
  onComplete?: (lessonId: number) => void;
  onProgressUpdate?: (lessonId: number, percent: number) => void;
  onQuizPassed?: (lessonId: number) => void;
  completing?: boolean;
  progress?: number;
  readOnly?: boolean;
  lessonListTitle?: string;
}) {
  const [manualVideoComplete, setManualVideoComplete] = useState<Record<number, boolean>>({});
  const activeLessonIdRef = useRef(activeLesson?.id);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const activeLessonButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeLessonIdRef.current = activeLesson?.id;
    onProgressUpdateRef.current = onProgressUpdate;
  }, [activeLesson?.id, onProgressUpdate]);

  const mediaItems = useMemo(
    () => (activeLesson ? resolveLessonMediaItems(activeLesson) : []),
    [activeLesson]
  );
  const primaryAudio = useMemo(
    () => selectPrimaryMedia(mediaItems, "audio"),
    [mediaItems]
  );
  const fileItems = useMemo(() => mediaOfType(mediaItems, "file"), [mediaItems]);

  const videoRequired = activeLesson ? lessonHasEffectiveVideo(activeLesson) : false;
  const audioUrl = resolveAudioStreamUrl(primaryAudio, activeLesson ?? undefined);
  const savedProgress = activeLesson?.progress_percent ?? 0;
  const videoWatched =
    !activeLesson
      ? false
      : !videoRequired
        ? true
        : savedProgress >= VIDEO_WATCH_THRESHOLD || !!manualVideoComplete[activeLesson.id];

  useEffect(() => {
    activeLessonButtonRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLesson?.id]);

  const handleProgressUpdate = useCallback(
    (percent: number) => {
      const lessonId = activeLessonIdRef.current;
      if (!lessonId || readOnly) return;
      onProgressUpdateRef.current?.(lessonId, percent);
      if (percent >= VIDEO_WATCH_THRESHOLD) {
        setManualVideoComplete((prev) => ({ ...prev, [lessonId]: true }));
      }
    },
    [readOnly]
  );

  const handleVideoComplete = useCallback(() => {
    const lessonId = activeLessonIdRef.current;
    if (!lessonId) return;
    setManualVideoComplete((prev) => ({ ...prev, [lessonId]: true }));
  }, []);

  const canComplete =
    (!videoRequired || videoWatched) && (!activeLesson?.has_quiz || activeLesson?.quiz_passed);

  function handleSelectLesson(lesson: LessonItem) {
    if (!readOnly && lesson.is_locked) return;
    onSelectLesson(lesson);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {activeLesson ? (
          <>
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-brand-dark">{activeLesson.title_ar}</h3>
                  {activeLesson.duration_minutes ? (
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <Clock className="h-4 w-4" />
                      {activeLesson.duration_minutes} دقيقة
                    </span>
                  ) : null}
                </div>
                {activeLesson.content_ar ? (
                  <div className="prose prose-sm max-w-none">{formatContent(activeLesson.content_ar)}</div>
                ) : null}
              </CardContent>
            </Card>

            <LessonVideoSection
              lesson={activeLesson}
              readOnly={readOnly}
              savedProgress={savedProgress}
              onProgressUpdate={handleProgressUpdate}
              onVideoComplete={handleVideoComplete}
            />

            {audioUrl ? (
              <LessonAudioPlayer key={`audio-${activeLesson.id}`} streamUrl={audioUrl} />
            ) : null}

            <LessonAttachments items={fileItems} />

            {!readOnly &&
              (activeLesson.has_quiz || onComplete || activeLesson.is_completed) && (
                <Card>
                  <CardContent className="space-y-4 p-6 md:p-8">
                    {activeLesson.has_quiz && (
                      <LessonQuiz
                        lessonId={activeLesson.id}
                        quizPassed={activeLesson.quiz_passed}
                        onPassed={() => onQuizPassed?.(activeLesson.id)}
                      />
                    )}
                    {onComplete && !activeLesson.is_completed && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => onComplete(activeLesson.id)}
                            disabled={completing || !canComplete}
                          >
                            {completing ? "جاري الحفظ..." : "إكمال الدرس ✓"}
                          </Button>
                          <ReportErrorButton lessonId={activeLesson.id} />
                        </div>
                        {videoRequired && !videoWatched && (
                          <p className="text-sm text-muted">
                            شاهد الفيديو كاملاً ({VIDEO_WATCH_THRESHOLD}%) لتفعيل إكمال الدرس
                          </p>
                        )}
                        {activeLesson.has_quiz && !activeLesson.quiz_passed && videoWatched && (
                          <p className="text-sm text-muted">
                            يجب اجتياز أسئلة الدرس قبل الإكمال والانتقال للدرس التالي
                          </p>
                        )}
                      </div>
                    )}
                    {activeLesson.is_completed && (
                      <p className="inline-flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
                        <CheckCircle2 className="h-4 w-4" />
                        تم إكمال هذا الدرس
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
          </>
        ) : (
          <Card className="p-12 text-center text-muted">لا توجد دروس متاحة حالياً</Card>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-brand-dark">{lessonListTitle}</h3>
          {progress !== undefined && (
            <span className="text-sm font-medium text-gold">{progress}%</span>
          )}
        </div>
        {progress !== undefined && <ProgressBar value={progress} className="mb-4" />}
        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const active = activeLesson?.id === lesson.id;
            const completed = lesson.is_completed;
            const locked = !readOnly && !!lesson.is_locked;
            return (
              <button
                key={lesson.id}
                ref={active ? activeLessonButtonRef : undefined}
                type="button"
                onClick={() => handleSelectLesson(lesson)}
                disabled={locked}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative w-full overflow-hidden rounded-2xl border p-4 text-start transition",
                  active
                    ? "border-2 border-gold bg-gold/10 shadow-md ring-2 ring-gold/25"
                    : "card border-border hover:border-brand/30 hover:bg-brand/5",
                  locked && "cursor-not-allowed opacity-60"
                )}
              >
                {active && <span className="absolute inset-y-3 end-0 w-1 rounded-full bg-gold" aria-hidden />}
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
                      active && !completed
                        ? "bg-gold/25 text-brand-dark"
                        : completed
                          ? "bg-brand/15 text-brand"
                          : locked
                            ? "bg-muted/20 text-muted"
                            : "bg-background text-muted"
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : active ? (
                      <PlayCircle className="h-4 w-4 fill-brand/20" />
                    ) : locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    {active && (
                      <span className="mb-1 inline-flex rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold text-brand-dark">
                        الدرس الحالي
                      </span>
                    )}
                    <p
                      className={cn(
                        "text-sm text-brand-dark",
                        active ? "font-bold" : "font-semibold"
                      )}
                    >
                      {lesson.title_ar}
                    </p>
                    {locked && (
                      <p className="mt-1 text-xs text-muted">أكمل الدرس السابق أولاً</p>
                    )}
                    {!locked && lesson.duration_minutes ? (
                      <p className="mt-1 text-xs text-muted">{lesson.duration_minutes} دقيقة</p>
                    ) : null}
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
