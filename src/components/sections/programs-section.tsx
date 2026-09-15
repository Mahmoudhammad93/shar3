"use client";

import { useEffect, useState } from "react";
import type { Program } from "@/types";
import { ProgramCard } from "@/components/cards/program-card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { api } from "@/lib/api";

export function ProgramsSection({ programs: initialPrograms }: { programs: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);

  useEffect(() => {
    api
      .getProgramsLive()
      .then((response) => {
        if (response.data.length > 0) {
          setPrograms(response.data);
        }
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, []);

  if (programs.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader
        eyebrow="مسارات تعليمية"
        title="برامجنا العلمية"
        description="خطة دراسية متكاملة على خمس سنوات: السنة التمهيدية، ثم التأصيل العلمي، ثم التخصص في إحدى الشعب الأربع"
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
