import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import type { Teacher } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function TeacherCard({ teacher, className }: { teacher: Teacher; className?: string }) {
  return (
    <Link href={`/teachers/${teacher.slug}`}>
      <Card className={cn("group text-center card-hover", className)}>
        <CardContent className="p-4 pb-3.5">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand/10 ring-2 ring-brand/5">
            {teacher.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={teacher.photo} alt={teacher.name_ar} className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-brand/40" />
            )}
          </div>
          <h3 className="text-base font-bold text-brand-dark">{teacher.name_ar}</h3>
          {teacher.title_ar && <p className="mt-1 line-clamp-2 text-sm text-gold">{teacher.title_ar}</p>}
          {teacher.specializations && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{teacher.specializations}</p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand transition group-hover:text-brand-dark">
            الملف الشخصي
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
