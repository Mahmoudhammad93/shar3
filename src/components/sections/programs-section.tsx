"use client";

import type { Program } from "@/types";
import { ProgramCard } from "@/components/cards/program-card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export function ProgramsSection({ programs }: { programs: Program[] }) {
  return (
    <Section>
      <SectionHeader
        eyebrow="مسارات تعليمية"
        title="برامجنا العلمية"
        description="مسارات متدرجة من المبتدئ إلى المتقدم في العلوم الشرعية"
      />
      <Container>
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <StaggerItem key={program.id}>
              <ProgramCard program={program} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
