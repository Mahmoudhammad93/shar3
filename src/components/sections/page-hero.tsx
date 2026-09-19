import { Container } from "@/components/ui/container";
import { PageTitle, SectionDescription } from "@/components/ui/typography";

export function PageHero({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand py-16 text-white md:py-20">
      <div className="islamic-pattern absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.15),transparent_50%)]" />
      <Container className="relative text-center">
        <PageTitle>{title}</PageTitle>
        {subtitle && <SectionDescription className="mx-auto mt-4 max-w-2xl text-white/80">{subtitle}</SectionDescription>}
        {children}
      </Container>
    </section>
  );
}
