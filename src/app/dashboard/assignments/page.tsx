"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { studentApi, type AssignmentItem } from "@/lib/auth";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "all", label: "الكل" },
  { id: "pending", label: "قيد التنفيذ" },
  { id: "submitted", label: "تم التسليم" },
  { id: "graded", label: "تم التقييم" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function getTab(item: AssignmentItem): TabId {
  if (!item.submission) return "pending";
  if (item.submission.status === "graded") return "graded";
  return "submitted";
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [content, setContent] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<TabId>("all");

  useEffect(() => {
    studentApi.assignments().then((res) => setAssignments(res.data)).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "all") return assignments;
    return assignments.filter((a) => getTab(a) === activeTab);
  }, [assignments, activeTab]);

  async function handleSubmit(id: number) {
    setSubmitting(id);
    try {
      await studentApi.submitAssignment(id, content[id] || "");
      const res = await studentApi.assignments();
      setAssignments(res.data);
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الواجبات والمهام</h1>
        <p className="mt-1 text-sm text-muted">متابعة وتسليم الواجبات الدراسية</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium transition",
              activeTab === tab.id
                ? "bg-brand text-white"
                : "bg-surface text-muted hover:bg-brand/5 hover:text-brand"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((a) => {
          const tab = getTab(a);
          return (
            <div key={a.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-brand-dark">{a.title_ar}</h3>
                  {a.course && <p className="text-sm text-muted">{a.course}</p>}
                  {a.due_at && <p className="mt-1 text-xs text-muted">موعد التسليم: {a.due_at}</p>}
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    tab === "pending" && "bg-amber-100 text-amber-700",
                    tab === "submitted" && "bg-blue-100 text-blue-700",
                    tab === "graded" && "bg-green-100 text-green-700"
                  )}
                >
                  {tab === "pending" && "قيد التنفيذ"}
                  {tab === "submitted" && "تم التسليم"}
                  {tab === "graded" && `الدرجة: ${a.submission?.score}/${a.max_score}`}
                </span>
              </div>
              {a.description_ar && <p className="mt-3 text-sm leading-7 text-muted">{a.description_ar}</p>}
              {tab === "pending" && (
                <div className="mt-4 space-y-3">
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="اكتب إجابتك هنا..."
                    value={content[a.id] || ""}
                    onChange={(e) => setContent({ ...content, [a.id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleSubmit(a.id)}
                    disabled={submitting === a.id}
                    className="btn-primary"
                  >
                    {submitting === a.id ? "جاري التسليم..." : "تسليم الواجب"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center text-muted">لا توجد واجبات في هذا القسم</div>
        )}
      </div>
    </DashboardLayout>
  );
}
