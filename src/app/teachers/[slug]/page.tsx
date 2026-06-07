import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { CourseCard } from "@/components/cards/course-card";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { getTeacherSlugs } from "@/lib/static-params";

export async function generateStaticParams() {
  const slugs = await getTeacherSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: teacher } = await api.getTeacher(slug);

    return (
      <SiteLayout>
        <PageHero title={teacher.name_ar} subtitle={teacher.title_ar}>
          {teacher.specializations && (
            <p className="mt-2 text-sm text-gold">{teacher.specializations}</p>
          )}
        </PageHero>
        <Container className="py-12">
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-6 text-center md:flex-row md:text-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-brand/10 ring-4 ring-brand/5">
              {teacher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={teacher.photo} alt={teacher.name_ar} className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-14 w-14 text-brand/40" />
              )}
            </div>
            {teacher.bio_ar && <p className="leading-8 text-muted">{teacher.bio_ar}</p>}
          </div>
          {teacher.courses && teacher.courses.length > 0 && (
            <>
              <h2 className="mb-8 text-2xl font-bold text-brand-dark">دورات المعلم</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {teacher.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
          <Link href="/teachers" className="mt-8 inline-flex items-center gap-2 text-brand">
            <ArrowRight className="h-4 w-4" />
            العودة للمعلمين
          </Link>
        </Container>
      </SiteLayout>
    );
  } catch {
    notFound();
  }
}
