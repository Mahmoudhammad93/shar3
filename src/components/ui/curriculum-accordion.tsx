import { Clock, Lock } from "lucide-react";

export function CurriculumAccordion({
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
