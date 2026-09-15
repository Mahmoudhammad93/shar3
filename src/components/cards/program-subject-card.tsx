import { BookOpen } from "lucide-react";
import type { ProgramSubject } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

function MultilineText({ text }: { text?: string | null }) {
  if (!text?.trim()) {
    return null;
  }

  return (
    <div className="space-y-1 text-sm leading-6 text-muted">
      {text.split("\n").filter(Boolean).map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export function ProgramSubjectCard({ subject }: { subject: ProgramSubject }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <BookOpen className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-brand-dark">{subject.name_ar}</h3>
        {subject.primary_text_ar && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-brand-dark">اسم الكتاب</p>
            <MultilineText text={subject.primary_text_ar} />
          </div>
        )}
        {subject.supplementary_text_ar && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-brand-dark">المحاضر</p>
            <MultilineText text={subject.supplementary_text_ar} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
