"use client";

import { useCallback, useState } from "react";
import { StudentLearningPage } from "@/components/dashboard/student-learning-page";
import { studentApi } from "@/lib/auth";

/**
 * Academic Subject learning route: /dashboard/subjects/[slug]
 *
 * Consumes Subject API lessons authoritatively (direct Subject lessons OR
 * legacy Subject→Course fallback OR empty). Does not require course to exist.
 */
export function StudentSubjectPage({ slug }: { slug: string }) {
  const [subjectTitle, setSubjectTitle] = useState<string>();

  const load = useCallback(async () => {
    const res = await studentApi.subject(slug);
    setSubjectTitle(res.subject.name_ar);
    return {
      subject: res.subject,
      course: res.course,
      progress: res.progress,
      lessons: res.lessons,
    };
  }, [slug]);

  const reload = load;

  return (
    <StudentLearningPage
      title={subjectTitle}
      subtitle="المقرر الأكاديمي"
      emptyMessage="لم تتم إضافة دروس لهذا المقرر بعد."
      lessonListTitle="دروس المقرر"
      progressLabel="التقدم في المقرر"
      load={load}
      reload={reload}
    />
  );
}
