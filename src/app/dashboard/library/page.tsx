"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { BookOpen, FileText, Search } from "lucide-react";

const librarySections = [
  {
    title: "كتب الفقه",
    icon: BookOpen,
    items: ["منار السبيل", "المغني", "الأم"],
  },
  {
    title: "كتب الحديث",
    icon: FileText,
    items: ["رياض الصالحين", "بلوغ المرام", "فتح الباري"],
  },
  {
    title: "مراجع عامة",
    icon: Search,
    items: ["تفسير ابن كثير", "السيرة النبوية", "العقيدة الواسطية"],
  },
];

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">خزانة المتون</h1>
        <p className="mt-1 text-sm text-muted">المراجع والمصادر العلمية المتاحة للطلاب</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {librarySections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-brand-dark">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-brand/30 hover:bg-brand/5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 p-6 text-center text-sm text-muted">
        سيتم ربط المكتبة الرقمية بالمراجع الكاملة قريباً
      </div>
    </DashboardLayout>
  );
}
