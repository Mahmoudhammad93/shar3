import { SiteLayout } from "@/components/layout/site-layout";
import { RegulationsContent } from "@/components/regulations/regulations-content";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "اللائحة التنظيمية",
  description:
    "لائحة المعهد التنظيمية: أحكام القبول والحضور والاختبارات والانضباط في معهد إعداد دعاة التوحيد والسنة.",
  path: "/regulations/",
});

export default function RegulationsPage() {
  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/regulations"
        fallbackTitle="اللائحة التنظيمية"
        fallbackSubtitle="ضوابط وأحكام تنظّم العلاقة بين المعهد وطلابه لضمان بيئة علمية محترمة"
      />
      <RegulationsContent />
    </SiteLayout>
  );
}
