import { SiteLayout } from "@/components/layout/site-layout";
import { AboutPageContent } from "@/components/about/about-page-content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "عن المعهد",
  description:
    "تعرّف على معهد إعداد دعاة التوحيد والسنة: مؤسسة تعليمية إسلامية تُعنى بتيسير طلب العلم الشرعي على منهج أهل السنة والجماعة في التفسير والفقه والحديث والعقيدة.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <SiteLayout>
      <AboutPageContent />
    </SiteLayout>
  );
}
