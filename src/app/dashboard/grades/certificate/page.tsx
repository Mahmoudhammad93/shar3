"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CertificateActions, CertificateDocument } from "@/components/certificate/certificate-document";
import { studentApi, type CertificateDetail } from "@/lib/auth";

function CertificateViewContent() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("معرّف الشهادة غير صالح");
      setLoading(false);
      return;
    }

    studentApi
      .certificate(id)
      .then((res) => setCertificate(res.certificate))
      .catch(() => setError("تعذّر تحميل الشهادة"))
      .finally(() => setLoading(false));
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return <p className="text-muted">جاري تحميل الشهادة...</p>;
  }

  if (error || !certificate) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{error || "الشهادة غير موجودة"}</p>
        <Link href="/dashboard/grades/" className="text-brand hover:underline">
          ← العودة للشهادات
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/grades/"
            className="mb-2 inline-flex items-center gap-1 text-sm text-brand hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للشهادات
          </Link>
          <h1 className="text-2xl font-bold text-brand-dark">عرض الشهادة</h1>
          <p className="mt-1 text-sm text-muted">{certificate.course_title}</p>
        </div>
        <CertificateActions fileUrl={certificate.file_url} onPrint={handlePrint} />
      </div>

      <CertificateDocument data={certificate} />

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print,
          .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            padding: 0;
          }
          .certificate-actions,
          nav,
          aside,
          footer,
          header {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default function CertificateViewPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<p className="text-muted">جاري التحميل...</p>}>
        <CertificateViewContent />
      </Suspense>
    </DashboardLayout>
  );
}
