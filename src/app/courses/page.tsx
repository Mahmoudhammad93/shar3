import { Suspense } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { api } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { CoursesPageContent } from "./courses-page-content";

export const metadata = buildMetadata({
  title: "الدورات الشرعية",
  description:
    "تصفّح دورات معهد علم شرعي في التفسير والفقه والحديث والعقيدة وغيرها من العلوم الشرعية، على منهج أهل السنة والجماعة، للمبتدئين والمتوسطين والمتقدمين.",
  path: "/courses/",
});

export default async function CoursesPage() {
  const { data: courses } = await api.getCourses();

  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/courses"
        fallbackTitle="الدورات الشرعية"
        fallbackSubtitle="دورات معتمدة في القرآن والتفسير والفقه والحديث والعقيدة — على منهج أهل السنة والجماعة"
      />
      <Suspense fallback={<p className="py-16 text-center text-muted">جاري التحميل...</p>}>
        <CoursesPageContent courses={courses} />
      </Suspense>
    </SiteLayout>
  );
}
