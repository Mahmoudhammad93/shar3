import { Suspense } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { PageHero } from "@/components/sections/page-hero";
import { api } from "@/lib/api";
import { CoursesPageContent } from "./courses-page-content";

export default async function CoursesPage() {
  const { data: courses } = await api.getCourses();

  return (
    <SiteLayout>
      <PageHero title="الدورات الشرعية" subtitle="استكشف دوراتنا في مختلف العلوم الشرعية" />
      <Suspense fallback={<p className="py-16 text-center text-muted">جاري التحميل...</p>}>
        <CoursesPageContent courses={courses} />
      </Suspense>
    </SiteLayout>
  );
}
