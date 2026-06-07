"use client";

import type { Teacher } from "@/types";
import { TeacherCard } from "@/components/cards/teacher-card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export function TeachersSection({ teachers }: { teachers: Teacher[] }) {
  return (
    <Section>
      <SectionHeader eyebrow="الهيئة التعليمية" title="نخبة من العلماء والمدرسين" />
      <Container>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teachers.map((teacher) => (
            <StaggerItem key={teacher.id}>
              <TeacherCard teacher={teacher} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
