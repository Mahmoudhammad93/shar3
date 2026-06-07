import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import type { Teacher } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function TeacherCard({ teacher, className }: { teacher: Teacher; className?: string }) {
  return (
    <Link href={`/teachers/${teacher.slug}`}>
      <Card className={cn("group h-full text-center card-hover", className)}>
        <CardContent className="p-6">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand/10 ring-4 ring-brand/5">
            {teacher.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={teacher.photo} alt={teacher.name_ar} className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-brand/40" />
            )}
          </div>
          <h3 className="text-lg font-bold text-brand-dark">{teacher.name_ar}</h3>
          {teacher.title_ar && <p className="mt-1 text-sm text-gold">{teacher.title_ar}</p>}
          {teacher.specializations && (
            <p className="mt-3 text-sm text-muted">{teacher.specializations}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand opacity-0 transition group-hover:opacity-100">
            الملف الشخصي
            <ArrowLeft className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
