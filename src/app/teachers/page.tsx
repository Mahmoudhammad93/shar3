import { Suspense } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { api } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { TeachersPageContent } from "./teachers-page-content";

export const metadata = buildMetadata({
  title: "المعلمون",
  description:
    "تعرّف على هيئة التدريس في معهد علم شرعي: علماء ومدرسون متخصصون في العلوم الشرعية على منهج أهل السنة والجماعة.",
  path: "/teachers/",
});

export default async function TeachersPage() {
  const { data: teachers } = await api.getTeachers();

  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/teachers"
        fallbackTitle="المعلمون"
        fallbackSubtitle="نخبة من أهل العلم والاختصاص في التفسير والفقه والحديث والعقيدة"
      />
      <Suspense fallback={<p className="py-16 text-center text-muted">جاري التحميل...</p>}>
        <TeachersPageContent teachers={teachers} />
      </Suspense>
    </SiteLayout>
  );
}
