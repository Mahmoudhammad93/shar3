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
import { buildMetadata, websiteJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  description:
    "معهد علم شرعي يقدّم دورات وبرامج في القرآن والتفسير والفقه والحديث والعقيدة على منهج أهل السنة والجماعة. سجّل الآن وابدأ رحلتك في طلب العلم الشرعي.",
  path: "/",
});

export default async function HomePage() {
  const data = await api.getHome();

  return (
    <SiteLayout>
      <JsonLd data={websiteJsonLd()} />
      <HeroSection slide={data.hero_slides[0]} />
      <InstituteIntroSection />
      <SearchSection />
      <ProgramsSection programs={data.programs} />
      <CoursesSection
        courses={data.featured_courses}
        visible={data.homepage_featured_courses_visible}
      />
      <TeachersSection teachers={data.teachers} />
      <TestimonialsSection testimonials={data.testimonials} />
      <FaqSection faqs={data.faqs} />
      <CtaSection />
    </SiteLayout>
  );
}
