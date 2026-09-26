import { SiteLayout } from "@/components/layout/site-layout";
import { StudyPlanContent } from "@/components/study-plan/study-plan-content";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الخطة الدراسية",
  description:
    "اطّلع على الخطة الدراسية في معهد إعداد دعاة التوحيد والسنة: المواد والمتون والكتب الأساسية والتكميلية لكل فصل دراسي على منهج أهل السنة والجماعة.",
  path: "/study-plan/",
});

export default function StudyPlanPage() {
  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/study-plan"
        fallbackTitle="الخطة الدراسية"
        fallbackSubtitle="منهج علمي متدرّج يجمع بين الحفظ والمتون الأساسية والكتب التكميلية في العلوم الشرعية"
      />
      <StudyPlanContent />
    </SiteLayout>
  );
}
