import { ProgramSubjectCard } from "@/components/cards/program-subject-card";
import type { ProgramCurriculumYear, ProgramSpecializationSubjects, ProgramSubject } from "@/types";

function SemesterSubjects({
  semesterName,
  subjects,
}: {
  semesterName: string;
  subjects: ProgramSubject[];
}) {
  if (subjects.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <h4 className="mb-4 border-b border-border/80 pb-3 text-base font-bold text-brand-dark">{semesterName}</h4>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <ProgramSubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </section>
  );
}

function YearSection({ year, subtitle }: { year: ProgramCurriculumYear; subtitle?: string }) {
  const semesters = year.semesters.filter((semester) => semester.subjects.length > 0);

  if (semesters.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gold" />
        <div>
          <h3 className="text-xl font-bold text-brand-dark">{year.name_ar}</h3>
          {subtitle && <p className="mt-1 text-sm font-medium text-gold">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-5 ps-1">
        {semesters.map((semester) => (
          <SemesterSubjects key={semester.id} semesterName={semester.name_ar} subjects={semester.subjects} />
        ))}
      </div>
    </section>
  );
}

type CurriculumYearEntry = ProgramCurriculumYear & { key: string; subtitle?: string };

export function ProgramCurriculumSections({ years }: { years: ProgramCurriculumYear[] }) {
  const activeYears: CurriculumYearEntry[] = years
    .filter((year) => year.semesters.some((semester) => semester.subjects.length > 0))
    .map((year) => ({ ...year, key: String(year.id) }));

  if (activeYears.length === 0) {
    return <p className="text-muted">لا توجد مواد مسجّلة لهذا المستوى حالياً.</p>;
  }

  return (
    <div className="space-y-10">
      {activeYears.map((year) => (
        <YearSection key={year.key} year={year} subtitle={year.subtitle} />
      ))}
    </div>
  );
}

export function ProgramFlatSubjects({ subjects }: { subjects: ProgramSubject[] }) {
  if (subjects.length === 0) {
    return <p className="text-muted">لا توجد مواد مسجّلة لهذا المستوى حالياً.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <ProgramSubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

export function ProgramSpecializationCurriculumSections({
  specializations,
}: {
  specializations: ProgramSpecializationSubjects[];
}) {
  const activeYears: CurriculumYearEntry[] = specializations
    .flatMap((specialization, specIndex) =>
      (specialization.years ?? []).map((year) => ({
        ...year,
        key: `${specialization.id}-${year.id}`,
        subtitle: specialization.name_ar,
        specIndex,
      })),
    )
    .filter((year) => year.semesters.some((semester) => semester.subjects.length > 0))
    .sort((a, b) => {
      if (a.year_number !== b.year_number) {
        return a.year_number - b.year_number;
      }

      return a.specIndex - b.specIndex;
    });

  if (activeYears.length === 0) {
    return <p className="text-muted">لا توجد مواد مسجّلة لهذا المستوى حالياً.</p>;
  }

  return (
    <div className="space-y-10">
      {activeYears.map((year) => (
        <YearSection key={year.key} year={year} subtitle={year.subtitle} />
      ))}
    </div>
  );
}
