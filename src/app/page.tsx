import { SiteLayout } from "@/components/layout/site-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaSection } from "@/components/sections/cta-section";
import { CoursesSection } from "@/components/sections/courses-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InstituteIntroSection } from "@/components/sections/institute-intro-section";
import { ProgramsSection } from "@/components/sections/programs-section";
import { SearchSection } from "@/components/sections/search-section";
import { TeachersSection } from "@/components/sections/teachers-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { api } from "@/lib/api";
import { buildMetadata, faqJsonLd, SITE, websiteJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  description: `${SITE.name} يقدّم برامج ودورات في التوحيد والتفسير والفقه والحديث على منهج السلف. سجّل الآن وابدأ رحلتك في طلب العلم الشرعي وإعداد الدعاة.`,
  path: "/",
  keywords: [
    ...SITE.keywords,
    "تسجيل معهد دعاة التوحيد",
    "دورات توحيد مجانية",
    "إعداد دعاة أونلاين",
  ],
});

export default async function HomePage() {
  const data = await api.getHome();
  const heroSlides = data.hero_slides ?? [];
  const programs = data.programs ?? [];
  const featuredCourses = data.featured_courses ?? [];
  const teachers = data.teachers ?? [];
  const testimonials = data.testimonials ?? [];
  const faqs = data.faqs ?? [];
  const faqSchema = faqJsonLd(faqs);

  return (
    <SiteLayout>
      <JsonLd data={[websiteJsonLd(), ...(faqSchema ? [faqSchema] : [])]} />
      <HeroSection slide={heroSlides[0]} />
      <InstituteIntroSection />
      <SearchSection />
      <ProgramsSection programs={programs} />
      <CoursesSection
        courses={featuredCourses}
        visible={data.homepage_featured_courses_visible}
      />
      <TeachersSection teachers={teachers} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <CtaSection />
    </SiteLayout>
  );
}
