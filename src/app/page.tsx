import { SiteLayout } from "@/components/layout/site-layout";
import { api } from "@/lib/api";
import { HeroSection } from "@/components/sections/hero-section";
import { SearchSection } from "@/components/sections/search-section";
import { ProgramsSection } from "@/components/sections/programs-section";
import { CoursesSection } from "@/components/sections/courses-section";
import { TeachersSection } from "@/components/sections/teachers-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";

export default async function HomePage() {
  const data = await api.getHome();

  return (
    <SiteLayout>
      <HeroSection
        settings={data.settings}
        slide={data.hero_slides[0]}
        stats={data.stats}
      />
      <SearchSection />
      <ProgramsSection programs={data.programs} />
      <CoursesSection courses={data.featured_courses} />
      <TeachersSection teachers={data.teachers} />
      <TestimonialsSection testimonials={data.testimonials} />
      <FaqSection faqs={data.faqs} />
      <CtaSection />
    </SiteLayout>
  );
}
