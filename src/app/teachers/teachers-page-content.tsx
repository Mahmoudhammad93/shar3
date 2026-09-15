"use client";

import { useEffect, useState } from "react";
import { TeacherCard } from "@/components/cards/teacher-card";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import type { Teacher } from "@/types";

export function TeachersPageContent({ teachers: initialTeachers }: { teachers: Teacher[] }) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [loading, setLoading] = useState(initialTeachers.length === 0);

  useEffect(() => {
    api
      .getTeachersLive()
      .then((response) => {
        if (response.data.length > 0) {
          setTeachers(response.data);
        }
      })
      .catch(() => {
        /* keep build-time fallback */
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-center text-muted">جاري تحميل المعلمين...</p>
      </Container>
    );
  }

  if (teachers.length === 0) {
    return (
      <Container className="py-16">
        <p className="text-center text-muted">لا يوجد معلمون مسجّلون حالياً.</p>
      </Container>
    );
  }

  return (
    <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} />
      ))}
    </Container>
  );
}
