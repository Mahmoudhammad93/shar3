"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { CourseThumbnail } from "@/components/ui/course-thumbnail";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/providers/locale-provider";

export interface SubjectCardProps {
  id: number;
  title: string;
  slug?: string;
  image?: string;
  category?: string;
  teacher?: string;
  description?: string;
  progress: number;
  lessonsCount: number;
  completedLessons?: number;
  href: string;
  status?: string;
}

export function SubjectCard({
  title,
  slug,
  image,
  category,
  teacher,
  description,
  progress,
  lessonsCount,
  completedLessons,
  href,
  status = "approved",
}: SubjectCardProps) {
  const { locale } = useLocale();
  const completed =
    completedLessons ?? Math.round((progress / 100) * lessonsCount);

  const isPending = status === "pending";
  const isActive = status === "approved" || status === "completed";

  const progressLabel =
    locale === "en"
      ? `${completed} of ${lessonsCount} lessons`
      : `${completed} من ${lessonsCount} درس`;

  const continueLabel = locale === "en" ? "Continue studying" : "متابعة الدراسة";
  const pendingLabel = locale === "en" ? "Pending approval" : "قيد المراجعة";

  const cardClass = cn(
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition",
    isActive && "hover:-translate-y-0.5 hover:shadow-md",
    isPending && "opacity-90"
  );

  const content = (
    <>
      <CourseThumbnail
        title={title}
        slug={slug}
        image={image}
        aspectClass="aspect-[16/9]"
        badge={
          category ? (
            <span className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {category}
            </span>
          ) : undefined
        }
      />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-brand-dark">{title}</h3>
        {isPending && (
          <span className="mt-2 inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            {pendingLabel}
          </span>
        )}
        {teacher && <p className="mt-1 text-sm text-muted">{teacher}</p>}
        {description && (
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">{description}</p>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted">{progressLabel}</span>
            <span className="font-semibold text-brand">{progress}%</span>
          </div>
          <ProgressBar value={isActive ? progress : 0} className="h-1.5" />
          {isActive ? (
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand transition group-hover:gap-2">
              {continueLabel}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          ) : (
            <p className="mt-4 text-sm text-muted">{pendingLabel}</p>
          )}
        </div>
      </div>
    </>
  );

  if (isActive) {
    return (
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
