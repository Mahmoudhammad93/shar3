import { SiteLayout } from "@/components/layout/site-layout";
import { ProgramsList } from "@/components/programs/programs-list";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { api } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "البرامج العلمية",
  description:
    "خطة دراسية على خمس سنوات: السنة التمهيدية، مستوى التأصيل العلمي، ومستوى التخصص في العلوم الشرعية على منهج أهل السنة والجماعة.",
  path: "/programs/",
});

export default async function ProgramsPage() {
  const { data: programs } = await api.getPrograms();

  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/programs"
        fallbackTitle="البرامج العلمية"
        fallbackSubtitle="مسارات متدرجة على خمس سنوات من التأسيس إلى التأصيل ثم التخصص"
      />
      <ProgramsList initialPrograms={programs} />
    </SiteLayout>
  );
}
