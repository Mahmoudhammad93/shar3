import { SiteLayout } from "@/components/layout/site-layout";
import { ProgramCard } from "@/components/cards/program-card";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";

export default async function ProgramsPage() {
  const { data: programs } = await api.getPrograms();

  return (
    <SiteLayout>
      <PageHero title="البرامج العلمية" subtitle="مسارات تعليمية متكاملة ومتدرجة" />
      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </Container>
    </SiteLayout>
  );
}
