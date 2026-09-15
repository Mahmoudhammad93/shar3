"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/cards/course-card";
import { SearchBar } from "@/components/ui";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import type { Course } from "@/types";

export function CoursesPageContent({ courses: initialCourses }: { courses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    api
      .getCoursesLive()
      .then((response) => {
        if (response.data.length > 0) {
          setCourses(response.data);
        }
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, []);

  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    const query = search.toLowerCase();
    return courses.filter(
      (course) =>
        course.title_ar.toLowerCase().includes(query) ||
        course.description_ar?.toLowerCase().includes(query) ||
        course.category?.name_ar.toLowerCase().includes(query),
    );
  }, [courses, search]);

  return (
    <>
      <Container className="py-8">
        <SearchBar placeholder="ابحث في الدورات..." />
      </Container>
      <Container className="pb-16">
        {search && <p className="mb-6 text-sm text-muted">نتائج البحث عن: &ldquo;{search}&rdquo;</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <p className="py-16 text-center text-muted">لا توجد دورات مطابقة</p>
        )}
      </Container>
    </>
  );
}
