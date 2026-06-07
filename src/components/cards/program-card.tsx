import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import type { Program } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function ProgramCard({ program, className }: { program: Program; className?: string }) {
  return (
    <Link href={`/programs/${program.slug}`}>
      <Card className={cn("group h-full card-hover", className)}>
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark">{program.name_ar}</h3>
          <p className="mt-2 text-sm font-medium text-gold">
            {program.duration} • {program.level}
          </p>
          {program.description_ar && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{program.description_ar}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
            عرض البرنامج
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
