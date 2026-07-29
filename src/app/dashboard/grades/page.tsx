"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { studentApi, type CertificateItem, type GradeItem } from "@/lib/auth";

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  useEffect(() => {
    studentApi.grades().then((res) => {
      setGrades(res.grades);
      setCertificates(res.certificates);
    }).catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">الشهادات</h1>
        <p className="mt-1 text-sm text-muted">شهادات إتمام المواد ودرجاتك</p>
      </div>

      <section className="mb-10">
        <h3 className="mb-4 font-semibold text-brand-dark">الشهادات</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.id} className="card border-gold/30 p-6">
              <div className="mb-3 text-3xl">🎓</div>
              <h4 className="font-bold text-brand-dark">{c.course}</h4>
              <p className="mt-1 text-sm text-muted">رقم الشهادة: {c.certificate_number}</p>
              <p className="text-xs text-muted">تاريخ الإصدار: {c.issued_at}</p>
              <Button
                href={`/dashboard/grades/certificate/?id=${c.id}`}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Eye className="h-4 w-4" />
                عرض الشهادة
              </Button>
            </div>
          ))}
          {certificates.length === 0 && <p className="text-muted">لا توجد شهادات بعد</p>}
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-semibold text-brand-dark">الدرجات</h3>
        <div className="space-y-3">
          {grades.map((g, i) => (
            <div key={i} className="card flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{g.assignment}</p>
                <p className="text-sm text-muted">{g.course}</p>
              </div>
              <span className="text-lg font-bold text-gold">{g.score}/{g.max_score}</span>
            </div>
          ))}
          {grades.length === 0 && <p className="text-muted">لا توجد درجات مسجّلة بعد</p>}
        </div>
      </section>
    </DashboardLayout>
  );
}
