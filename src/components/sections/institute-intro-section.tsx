import { Container } from "@/components/ui/container";
import { INSTITUTE_INTRO, SITE } from "@/lib/seo";

export function InstituteIntroSection() {
  return (
    <section className="border-y border-border bg-surface/80 py-14" aria-labelledby="institute-intro-heading">
      <Container className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-sm font-semibold text-gold">{SITE.tagline}</p>
        <h2 id="institute-intro-heading" className="text-2xl font-bold text-brand-dark md:text-3xl">
          معهد متخصص في العلوم الشرعية
        </h2>
        <p className="mt-5 text-base leading-8 text-muted md:text-lg">{INSTITUTE_INTRO}</p>
      </Container>
    </section>
  );
}
