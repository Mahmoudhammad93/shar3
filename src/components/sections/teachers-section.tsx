"use client";

import { useEffect, useState } from "react";
import type { Teacher } from "@/types";
import { TeacherCard } from "@/components/cards/teacher-card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { api } from "@/lib/api";

export function TeachersSection({ teachers: initialTeachers }: { teachers: Teacher[] }) {
  const [teachers, setTeachers] = useState(initialTeachers);

  useEffect(() => {
    api
      .getFeaturedTeachersLive()
      .then((featured) => {
        setTeachers(featured);
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, []);

  if (teachers.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader
        eyebrow="الهيئة التعليمية"
        title="نخبة من العلماء والمدرسين"
        description="مدرسون متخصصون في العلوم الشرعية يربطون الطالب بالقرآن والسنة على فهم السلف"
      />
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
