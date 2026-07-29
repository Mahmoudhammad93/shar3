"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { studentApi } from "@/lib/auth";

interface QuizQuestion {
  id: number;
  question_ar: string;
  options: { id: number; option_ar: string }[];
}

export function LessonQuiz({
  lessonId,
  quizPassed,
  onPassed,
}: {
  lessonId: number;
  quizPassed?: boolean;
  onPassed?: () => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setSuccess("");
    setAnswers({});
    studentApi
      .lessonQuiz(lessonId)
      .then((res) => setQuestions(res.questions))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [lessonId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await studentApi.submitLessonQuiz(lessonId, answers);
      setSuccess(res.message);
      onPassed?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إرسال الإجابات");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">جاري تحميل الأسئلة...</p>;
  }

  if (questions.length === 0) {
    return null;
  }

  if (quizPassed) {
    return (
      <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
        ✓ اجتزت أسئلة هذا الدرس
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-background p-5">
      <h4 className="font-bold text-brand-dark">أسئلة الدرس</h4>
      {questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-2">
          <legend className="text-sm font-semibold text-brand-dark">
            {index + 1}. {question.question_ar}
          </legend>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm transition hover:border-brand/30"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                  className="accent-brand"
                  required
                />
                <span>{option.option_ar}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-xl bg-brand/10 p-3 text-sm text-brand">{success}</p>}
      <Button type="submit" disabled={submitting || questions.some((q) => !answers[q.id])}>
        {submitting ? "جاري التحقق..." : "إرسال الإجابات"}
      </Button>
    </form>
  );
}

export function ReportErrorButton({ lessonId }: { lessonId?: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("other");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await studentApi.reportError({
        lesson_id: lessonId,
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
        error_type: errorType,
        description,
      });
      setMessage(res.message);
      setDescription("");
      setTimeout(() => setOpen(false), 1500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "تعذّر إرسال البلاغ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        أبلغ عن خطأ
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-2xl bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold text-brand-dark">إبلاغ عن خطأ</h3>
            <select
              value={errorType}
              onChange={(e) => setErrorType(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm"
              required
            >
              <option value="broken_link">رابط لا يعمل</option>
              <option value="video">مشكلة في الفيديو</option>
              <option value="content">مشكلة في المحتوى</option>
              <option value="other">أخرى</option>
            </select>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="صف المشكلة..."
              required
            />
            {message && <p className="text-sm text-brand">{message}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? "جاري الإرسال..." : "إرسال"}</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
