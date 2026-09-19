import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CourseThumbnail } from "@/components/ui/course-thumbnail";
import { StarRating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

export function CourseCard({ course, className }: { course: Course; className?: string }) {
  return (
    <Card className={cn("group overflow-hidden card-hover", className)}>
      <CourseThumbnail
        title={course.title_ar}
        slug={course.slug}
        image={course.image}
        badge={
          course.is_free ? (
            <Badge variant="solidGold" className="px-3 py-1 text-xs uppercase tracking-wide">
              مجاني
            </Badge>
          ) : undefined
        }
      />
      <CardContent className="p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          {course.category && <Badge variant="green">{course.category.name_ar}</Badge>}
          {course.level && <Badge variant="outline">{course.level}</Badge>}
        </div>
        <h3 className="mb-2 text-lg font-bold text-brand-dark">{course.title_ar}</h3>
        {course.teacher && (
          <p className="mb-2 flex items-center gap-1.5 text-sm text-muted">
            <User className="h-3.5 w-3.5" />
            {course.teacher.name_ar}
          </p>
        )}
        <StarRating />
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" />
            {course.duration_hours ? `${course.duration_hours} ساعة` : "—"}
          </span>
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1 text-sm font-semibold text-brand transition group-hover:text-brand-dark"
          >
            التفاصيل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
