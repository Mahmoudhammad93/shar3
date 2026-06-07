"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardWelcomeBanner } from "@/components/dashboard/dashboard-welcome-banner";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { useAuth } from "@/components/providers/auth-provider";
import { studentApi, type StudentCourse } from "@/lib/auth";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [stats, setStats] = useState({
    activeCourses: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    Promise.all([studentApi.courses(), studentApi.dashboard()])
      .then(([coursesRes, dashboardRes]) => {
        setCourses(coursesRes.data);
        setStats({
          activeCourses: dashboardRes.stats.active_courses,
          completed: dashboardRes.stats.completed_lessons,
          total: dashboardRes.stats.total_lessons,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout>
      <DashboardWelcomeBanner
        name={user?.name || "طالب"}
        activeCourses={stats.activeCourses}
        completedLessons={stats.completed}
        totalLessons={stats.total}
      />

      <div className="mb-6 flex items-center gap-2">
        <Award className="h-5 w-5 text-gold" />
        <div>
          <h2 className="text-lg font-bold text-brand-dark">مواد العام الدراسي الحالي</h2>
          <p className="text-sm text-muted">تابع تقدمك في جميع المواد المسجّلة</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {courses.map((item) => (
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

      {courses.length === 0 && (
        <div className="card p-12 text-center text-muted">
          <p>لم تسجّل في أي مادة بعد</p>
          <Link href="/courses" className="mt-4 inline-block text-brand hover:underline">
            تصفح الدورات المتاحة ←
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
