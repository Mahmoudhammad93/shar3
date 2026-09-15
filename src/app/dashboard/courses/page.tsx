"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen } from "lucide-react";
import { AcademicContextBanner } from "@/components/dashboard/academic-context-banner";
import { CurriculumSubjectCard } from "@/components/dashboard/curriculum-subject-card";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardWelcomeBanner } from "@/components/dashboard/dashboard-welcome-banner";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { useAuth } from "@/components/providers/auth-provider";
import { studentApi, type CurriculumSubject, type StudentCourse } from "@/lib/auth";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [generalCourses, setGeneralCourses] = useState<StudentCourse[]>([]);
  const [academicContext, setAcademicContext] = useState({
    level: null as string | null,
    year: null as string | null,
    semester: null as string | null,
  });
  const [stats, setStats] = useState({
    activeCourses: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    Promise.all([studentApi.curriculum(), studentApi.courses(), studentApi.dashboard()])
      .then(([curriculumRes, coursesRes, dashboardRes]) => {
        setSubjects(curriculumRes.subjects);
        setAcademicContext({
          level: curriculumRes.academic_level?.name_ar ?? user?.student?.academic_level?.name_ar ?? null,
          year: curriculumRes.academic_year?.name_ar ?? user?.student?.academic_year?.name_ar ?? null,
          semester: curriculumRes.current_semester?.name_ar ?? user?.student?.current_semester?.name_ar ?? null,
        });
        setGeneralCourses(coursesRes.data);
        setStats({
          activeCourses: curriculumRes.subjects.length,
          completed: dashboardRes.stats.completed_lessons,
          total: dashboardRes.stats.total_lessons,
        });
      })
      .catch(console.error);
  }, [user]);

  return (
    <DashboardLayout>
      <DashboardWelcomeBanner
        name={user?.name || "طالب"}
        activeCourses={stats.activeCourses}
        completedLessons={stats.completed}
        totalLessons={stats.total}
      />

      <AcademicContextBanner
        level={academicContext.level}
        year={academicContext.year}
        semester={academicContext.semester}
      />

      <div className="mb-6 flex items-center gap-2">
        <Award className="h-5 w-5 text-gold" />
        <div>
          <h2 className="text-lg font-bold text-brand-dark">مواد الفصل الحالي</h2>
          <p className="text-sm text-muted">المقرر الدراسي المعتمد لمستواك الأكاديمي</p>
        </div>
      </div>

      {subjects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {subjects.map((subject) => (
            <CurriculumSubjectCard key={subject.subject_id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-muted">
          <p>لم تُفعَّل موادك الأكاديمية بعد. يرجى التواصل مع الإدارة.</p>
        </div>
      )}

      {generalCourses.length > 0 && (
        <section className="mt-10">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" />
            <div>
              <h2 className="text-lg font-bold text-brand-dark">دورات عامة مسجّلة</h2>
              <p className="text-sm text-muted">دورات إضافية منفصلة عن المقرر الأكاديمي</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {generalCourses.map((item) => (
              <SubjectCard
                key={item.enrollment_id}
                id={item.course.id}
                title={item.course.title_ar}
                slug={item.course.slug}
                image={item.course.image}
                category={item.course.category}
                teacher={item.course.teacher}
                description={item.course.description_ar}
                progress={item.progress}
                lessonsCount={item.course.lessons_count}
                completedLessons={item.course.completed_lessons}
                href={`/dashboard/courses/${item.course.id}`}
                status={item.status}
              />
            ))}
          </div>
        </section>
      )}

      {subjects.length === 0 && generalCourses.length === 0 && (
        <div className="mt-6 text-center text-sm text-muted">
          <Link href="/courses" className="text-brand hover:underline">
            تصفح الدورات العامة المتاحة ←
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
