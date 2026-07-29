import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { CourseCard } from "@/components/cards/course-card";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { getProgramSlugs } from "@/lib/static-params";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: program } = await api.getProgram(slug);
    return buildMetadata({
      title: program.name_ar,
      description:
        program.description_ar ||
        `برنامج ${program.name_ar} في معهد علم شرعي — مسار تعليمي في العلوم الشرعية على منهج أهل السنة والجماعة.`,
      path: `/programs/${slug}/`,
    });
  } catch {
    return buildMetadata({ title: "برنامج علمي", path: `/programs/${slug}/` });
  }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: program } = await api.getProgram(slug);

    return (
      <SiteLayout>
        <PageHero title={program.name_ar} subtitle={`${program.duration} • ${program.level}`} />
        <Container className="py-12">
          {program.description_ar && (
            <p className="mx-auto mb-12 max-w-3xl text-center leading-8 text-muted">{program.description_ar}</p>
          )}
          <h2 className="mb-8 text-2xl font-bold text-brand-dark">دورات البرنامج</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {program.courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Link href="/programs" className="mt-8 inline-flex items-center gap-2 text-brand hover:text-brand-dark">
            <ArrowRight className="h-4 w-4" />
            العودة للبرامج
          </Link>
        </Container>
      </SiteLayout>
    );
  } catch {
    notFound();
  }
}
