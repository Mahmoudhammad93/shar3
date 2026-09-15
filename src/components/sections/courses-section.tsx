"use client";

import { useEffect, useState } from "react";
import type { Course } from "@/types";
import { CourseCard } from "@/components/cards/course-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { api } from "@/lib/api";

export function CoursesSection({
  courses: initialCourses,
  visible: initialVisible = false,
}: {
  courses: Course[];
  visible?: boolean;
}) {
  const [visible, setVisible] = useState(initialVisible);
  const [courses, setCourses] = useState(initialCourses);

  useEffect(() => {
    api
      .getFeaturedCoursesLive()
      .then(({ visible: isVisible, courses: featured }) => {
        setVisible(isVisible);
        setCourses(featured);
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, []);

  if (!visible || courses.length === 0) {
    return null;
  }

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
