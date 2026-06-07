import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/site-layout";
import { EnrollmentForm } from "@/components/forms/enrollment-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Badge, CurriculumAccordion, VideoPlayer } from "@/components/ui";
import { CourseThumbnail } from "@/components/ui/course-thumbnail";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { getCourseSlugs } from "@/lib/static-params";

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: course } = await api.getCourse(slug);
    const firstLesson = course.lessons?.[0];

    return (
      <SiteLayout>
        <PageHero title={course.title_ar} subtitle={course.description_ar}>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {course.category && <Badge variant="gold">{course.category.name_ar}</Badge>}
            {course.level && <Badge variant="outline" className="border-white/30 text-white">{course.level}</Badge>}
          </div>
        </PageHero>

        <Container className="grid gap-10 py-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <VideoPlayer url={firstLesson?.video_url} title={course.title_ar} />
            <div>
              <h2 className="mb-4 text-xl font-bold text-brand-dark">منهج الدورة</h2>
              <CurriculumAccordion lessons={course.lessons || []} />
            </div>
          </div>
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CourseThumbnail
                title={course.title_ar}
                slug={course.slug}
                image={course.image}
                aspectClass="aspect-[16/10]"
                className="rounded-none"
              />
              <CardContent className="space-y-3 p-6 text-sm">
                <div className="flex justify-between"><span className="text-muted">المستوى</span><span>{course.level || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">المدة</span><span>{course.duration_hours ? `${course.duration_hours} ساعة` : "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted">السعر</span><span className="font-bold text-gold">{course.is_free ? "مجاني" : `${course.price} ر.س`}</span></div>
                <div className="flex justify-between"><span className="text-muted">الدروس</span><span>{course.lessons?.length || 0}</span></div>
                {course.teacher && <div className="flex justify-between"><span className="text-muted">المعلم</span><span>{course.teacher.name_ar}</span></div>}
              </CardContent>
            </Card>
            <EnrollmentForm courseId={course.id} courseTitle={course.title_ar} />
          </div>
        </Container>
      </SiteLayout>
    );
  } catch {
    notFound();
  }
}
