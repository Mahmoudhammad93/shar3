"use client";

import type { Course } from "@/types";
import { CourseCard } from "@/components/cards/course-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export function CoursesSection({ courses }: { courses: Course[] }) {
  return (
    <Section className="bg-background">
      <SectionHeader
        eyebrow="محتوى تعليمي"
        title="دورات مميزة"
        description="دورات منتقاة في التفسير والفقه والحديث والعقيدة — تُدرَّس على منهج أهل السنة والجماعة"
      />
      <Container>
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <StaggerItem key={course.id}>
              <CourseCard course={course} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="mt-10 text-center">
          <Button href="/courses" variant="primary" size="lg">
            عرض جميع الدورات
          </Button>
        </div>
      </Container>
    </Section>
  );
}
