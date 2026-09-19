"use client";

import { useCallback, useState } from "react";
import { StudentLearningPage } from "@/components/dashboard/student-learning-page";
import { studentApi } from "@/lib/auth";

export function StudentSubjectPage({ slug }: { slug: string }) {
  const [subjectTitle, setSubjectTitle] = useState<string>();

  const load = useCallback(async () => {
    const res = await studentApi.subject(slug);
    setSubjectTitle(res.subject.name_ar);
    return {
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
      load={load}
      reload={reload}
    />
  );
}
