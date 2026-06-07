import { SiteLayout } from "@/components/layout/site-layout";
import { TeacherCard } from "@/components/cards/teacher-card";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";

export default async function TeachersPage() {
  const { data: teachers } = await api.getTeachers();

  return (
    <SiteLayout>
      <PageHero title="المعلمون" subtitle="نخبة من أهل العلم والاختصاص" />
      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </Container>
    </SiteLayout>
  );
}
