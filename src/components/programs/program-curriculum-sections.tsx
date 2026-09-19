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

function YearSection({
  yearName,
  subtitle,
  children,
}: {
  yearName: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-gold" />
        <div>
          <h3 className="text-xl font-bold text-brand-dark">{yearName}</h3>
          {subtitle && <p className="mt-1 text-sm font-medium text-gold">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-5 ps-1">{children}</div>
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
        <YearSection key={year.key} yearName={year.name_ar} subtitle={year.subtitle}>
          {year.semesters
            .filter((semester) => semester.subjects.length > 0)
            .map((semester) => (
              <SemesterSubjects
                key={semester.id}
                semesterName={semester.name_ar}
                subjects={semester.subjects}
              />
            ))}
        </YearSection>
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

type GroupedSpecializationYear = {
  key: string;
  yearName: string;
  specializations: Array<{
    id: number;
    name_ar: string;
    semesters: ProgramCurriculumYear["semesters"];
  }>;
};

export function ProgramSpecializationCurriculumSections({
  specializations,
}: {
  specializations: ProgramSpecializationSubjects[];
}) {
  const yearMeta = new Map<
    number,
    {
      year: ProgramCurriculumYear;
      items: Array<{
        specIndex: number;
        specialization: ProgramSpecializationSubjects;
        semesters: ProgramCurriculumYear["semesters"];
      }>;
    }
  >();

  specializations.forEach((specialization, specIndex) => {
    for (const year of specialization.years ?? []) {
      const activeSemesters = year.semesters.filter((semester) => semester.subjects.length > 0);
      if (activeSemesters.length === 0) {
        continue;
      }

      const bucket = yearMeta.get(year.id);
      if (bucket) {
        bucket.items.push({ specIndex, specialization, semesters: activeSemesters });
      } else {
        yearMeta.set(year.id, {
          year,
          items: [{ specIndex, specialization, semesters: activeSemesters }],
        });
      }
    }
  });

  const grouped: GroupedSpecializationYear[] = [...yearMeta.values()]
    .sort((a, b) => a.year.year_number - b.year.year_number)
    .map(({ year, items }) => ({
      key: `year-${year.id}`,
      yearName: year.name_ar,
      specializations: items
        .sort((a, b) => a.specIndex - b.specIndex)
        .map(({ specialization, semesters }) => ({
          id: specialization.id,
          name_ar: specialization.name_ar,
          semesters,
        })),
    }));

  if (grouped.length === 0) {
    return <p className="text-muted">لا توجد مواد مسجّلة لهذا المستوى حالياً.</p>;
  }

  return (
    <div className="space-y-10">
      {grouped.map((year) => (
        <YearSection key={year.key} yearName={year.yearName}>
          {year.specializations.map((specialization) => (
            <div key={`${year.key}-${specialization.id}`} className="space-y-4">
              <h4 className="text-base font-bold text-gold">{specialization.name_ar}</h4>
              {specialization.semesters.map((semester) => (
                <SemesterSubjects
                  key={semester.id}
                  semesterName={semester.name_ar}
                  subjects={semester.subjects}
                />
              ))}
            </div>
          ))}
        </YearSection>
      ))}
    </div>
  );
}
