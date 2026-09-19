import type { AcademicLevel, StudyPlanSemester, StudyPlanSubject, StudyPlanYear } from "@/types";
import { StudyPlanIndex } from "@/components/study-plan/study-plan-index";
import { cn } from "@/lib/cn";
import {
  getStudyPlanSemesterAnchorId,
  getStudyPlanSpecializationAnchorId,
  getStudyPlanYearAnchorId,
  type StudyPlanIndexYear,
} from "@/lib/study-plan-anchors";

const TABLE_HEAD =
  "border-e border-border/70 px-4 py-3.5 text-sm font-bold text-brand-dark last:border-e-0";
const TABLE_CELL =
  "border-e border-border/60 px-4 py-4 align-top text-sm leading-relaxed last:border-e-0";

function MultilineCell({
  text,
  tone = "muted",
}: {
  text?: string | null;
  tone?: "muted" | "book" | "lecturer";
}) {
  if (!text?.trim()) {
    return <span className="text-muted/35">—</span>;
  }

  return (
    <div
      className={cn(
        "space-y-2 break-words",
        tone === "book" && "font-medium text-brand-dark",
        tone === "lecturer" && "text-muted",
        tone === "muted" && "text-muted",
      )}
    >
      {text.split("\n").filter(Boolean).map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

function MobileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-form border border-border/80 bg-brand/[0.02] p-3">
      <p className="mb-1.5 text-xs font-semibold text-brand-dark">{label}</p>
      <div className="text-sm text-muted">{children}</div>
    </div>
  );
}

function SubjectMobileCard({ subject }: { subject: StudyPlanSubject }) {
  return (
    <article className="space-y-3 border-b border-border/80 px-4 py-4 last:border-b-0">
      <div>
        <h3 className="font-semibold text-brand-dark">{subject.name_ar}</h3>
        {subject.course && (
          <p className="mt-1 text-xs text-muted">مرتبطة بدورة: {subject.course.title_ar}</p>
        )}
      </div>
      <div className="grid gap-2.5">
        <MobileField label="اسم الكتاب">
          <MultilineCell text={subject.primary_text_ar} tone="book" />
        </MobileField>
        <MobileField label="المحاضر">
          <MultilineCell text={subject.supplementary_text_ar} />
        </MobileField>
      </div>
    </article>
  );
}

function SemesterSubjectsMobile({
  sectionKey,
  semesters,
}: {
  sectionKey: string;
  semesters: StudyPlanSemester[];
}) {
  const activeSemesters = semesters.filter((semester) => semester.subjects.length > 0);

  return (
    <div className="md:hidden">
      {activeSemesters.map((semester) => (
        <section
          key={semester.id}
          id={getStudyPlanSemesterAnchorId(sectionKey, semester.slug)}
          className="scroll-mt-24 border-b border-border/80 last:border-b-0"
        >
          <div className="border-b border-border/80 bg-gold/10 px-4 py-3 text-center text-sm font-bold text-brand-dark">
            {semester.name_ar}
          </div>
          {semester.subjects.map((subject) => (
            <SubjectMobileCard key={subject.id} subject={subject} />
          ))}
        </section>
      ))}
    </div>
  );
}

function SemesterSubjectsDesktop({
  sectionKey,
  semesters,
}: {
  sectionKey: string;
  semesters: StudyPlanSemester[];
}) {
  const activeSemesters = semesters.filter((semester) => semester.subjects.length > 0);

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[760px] table-fixed border-collapse text-start">
        <colgroup>
          <col className="w-[88px]" />
          <col className="w-[22%]" />
          <col className="w-[38%]" />
          <col className="w-[30%]" />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-border bg-brand/[0.07]">
            <th className={cn(TABLE_HEAD, "text-center")}>الفصل</th>
            <th className={TABLE_HEAD}>المقرر</th>
            <th className={TABLE_HEAD}>اسم الكتاب</th>
            <th className={TABLE_HEAD}>المحاضر</th>
          </tr>
        </thead>
        {activeSemesters.map((semester) => (
          <tbody
            key={semester.id}
            id={getStudyPlanSemesterAnchorId(sectionKey, semester.slug)}
            className="scroll-mt-24 border-b-2 border-border/80 last:border-b-0"
          >
            {semester.subjects.map((subject, index) => (
              <tr
                key={subject.id}
                className={cn(
                  "border-b border-border/70 transition-colors last:border-b-0 hover:bg-brand/[0.025]",
                  index % 2 === 1 && "bg-brand/[0.015]",
                )}
              >
                {index === 0 && (
                  <td
                    rowSpan={semester.subjects.length}
                    className="border-e border-border/70 bg-gold/10 px-3 py-4 align-middle text-center text-sm font-bold leading-snug text-brand-dark"
                  >
                    {semester.name_ar.replace("الفصل ", "")}
                  </td>
                )}
                <td className={TABLE_CELL}>
                  <span className="font-semibold text-brand-dark">{subject.name_ar}</span>
                  {subject.course && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      مرتبطة بدورة: {subject.course.title_ar}
                    </p>
                  )}
                </td>
                <td className={cn(TABLE_CELL, "bg-brand/[0.02]")}>
                  <MultilineCell text={subject.primary_text_ar} tone="book" />
                </td>
                <td className={TABLE_CELL}>
                  <MultilineCell text={subject.supplementary_text_ar} tone="lecturer" />
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

type SpecializationBlock = {
  id: number;
  name_ar: string;
  slug: string;
  sectionKey: string;
  semesters: StudyPlanSemester[];
};

type StudyPlanYearBlock = {
  id: number;
  name_ar: string;
  year_number: number;
  sectionKey: string;
  levelName?: string;
  /** General years: subjects live directly under year semesters. */
  semesters: StudyPlanSemester[];
  /** Specialized years: one year card, many specializations inside. */
  specializations: SpecializationBlock[];
};

function hasSemesterSubjects(semesters: StudyPlanSemester[]): boolean {
  return semesters.some((semester) => semester.subjects.length > 0);
}

function collectYearBlocks(levels: AcademicLevel[]): StudyPlanYearBlock[] {
  const blocks: StudyPlanYearBlock[] = [];

  for (const level of levels) {
    for (const year of level.years ?? []) {
      if (!hasSemesterSubjects(year.semesters)) {
        continue;
      }

      blocks.push({
        id: year.id,
        name_ar: year.name_ar,
        year_number: year.year_number,
        sectionKey: `${level.slug}-${year.slug}`,
        levelName: level.name_ar,
        semesters: year.semesters,
        specializations: [],
      });
    }

    if (!level.specializations?.length) {
      continue;
    }

    // Group specialization curricula under a single academic year (no repeated year cards).
    const byYear = new Map<
      number,
      {
        year: StudyPlanYear;
        specializations: Array<{ id: number; name_ar: string; slug: string; semesters: StudyPlanSemester[]; sort: number }>;
      }
    >();

    level.specializations.forEach((specialization, specIndex) => {
      for (const year of specialization.years ?? []) {
        if (!hasSemesterSubjects(year.semesters)) {
          continue;
        }

        const existing = byYear.get(year.id);
        if (existing) {
          existing.specializations.push({
            id: specialization.id,
            name_ar: specialization.name_ar,
            slug: specialization.slug,
            semesters: year.semesters,
            sort: specIndex,
          });
        } else {
          byYear.set(year.id, {
            year,
            specializations: [
              {
                id: specialization.id,
                name_ar: specialization.name_ar,
                slug: specialization.slug,
                semesters: year.semesters,
                sort: specIndex,
              },
            ],
          });
        }
      }
    });

    const specializedBlocks = [...byYear.values()]
      .sort((a, b) => a.year.year_number - b.year.year_number)
      .map(({ year, specializations }) => ({
        id: year.id,
        name_ar: year.name_ar,
        year_number: year.year_number,
        sectionKey: `${level.slug}-year-${year.year_number}`,
        levelName: level.name_ar,
        semesters: [] as StudyPlanSemester[],
        specializations: specializations
          .sort((a, b) => a.sort - b.sort)
          .map((specialization) => ({
            id: specialization.id,
            name_ar: specialization.name_ar,
            slug: specialization.slug,
            sectionKey: `${level.slug}-year-${year.year_number}-${specialization.slug}`,
            semesters: specialization.semesters,
          })),
      }));

    blocks.push(...specializedBlocks);
  }

  return blocks.sort((a, b) => a.year_number - b.year_number);
}

function countSubjects(levels: AcademicLevel[]): number {
  return collectYearBlocks(levels).reduce((sum, year) => {
    const general = year.semesters.reduce(
      (semesterSum, semester) => semesterSum + semester.subjects.length,
      0,
    );
    const specialized = year.specializations.reduce(
      (specSum, specialization) =>
        specSum +
        specialization.semesters.reduce(
          (semesterSum, semester) => semesterSum + semester.subjects.length,
          0,
        ),
      0,
    );

    return sum + general + specialized;
  }, 0);
}

/** Distinct program years (1–5), not per-specialization table sections. */
export function countStudyPlanYears(levels: AcademicLevel[]): number {
  return new Set(
    collectYearBlocks(levels)
      .filter((year) => year.year_number != null)
      .map((year) => year.year_number),
  ).size;
}

function buildIndexYears(years: StudyPlanYearBlock[]): StudyPlanIndexYear[] {
  return years.map((year) => ({
    anchorId: getStudyPlanYearAnchorId(year.sectionKey),
    name: year.name_ar,
    levelName: year.levelName,
    semesters: year.semesters
      .filter((semester) => semester.subjects.length > 0)
      .map((semester) => ({
        anchorId: getStudyPlanSemesterAnchorId(year.sectionKey, semester.slug),
        name: semester.name_ar,
      })),
    specializations: year.specializations.map((specialization) => ({
      anchorId: getStudyPlanSpecializationAnchorId(specialization.sectionKey),
      name: specialization.name_ar,
      semesters: specialization.semesters
        .filter((semester) => semester.subjects.length > 0)
        .map((semester) => ({
          anchorId: getStudyPlanSemesterAnchorId(specialization.sectionKey, semester.slug),
          name: semester.name_ar,
        })),
    })),
  }));
}

function YearStudyCard({
  yearName,
  children,
}: {
  yearName: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="relative bg-brand px-6 py-5 text-center">
        <div className="islamic-pattern absolute inset-0 opacity-20" />
        <h2 className="relative text-xl font-bold text-white md:text-2xl">{yearName}</h2>
        <div className="relative mx-auto mt-3 h-1 w-16 rounded-full bg-gold" />
      </div>
      {children}
    </section>
  );
}

export function StudyPlanTables({ levels }: { levels: AcademicLevel[] }) {
  const yearsWithContent = collectYearBlocks(levels);

  if (yearsWithContent.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-muted">
        لم تُضَف مواد للخطة الدراسية بعد. يمكن للإدارة إضافتها من لوحة التحكم.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <StudyPlanIndex years={buildIndexYears(yearsWithContent)} />

      {yearsWithContent.map((year) => (
        <div
          key={year.sectionKey}
          id={getStudyPlanYearAnchorId(year.sectionKey)}
          className="scroll-mt-24 space-y-3"
        >
          {year.levelName && <p className="text-sm font-medium text-gold">{year.levelName}</p>}

          {year.specializations.length > 0 ? (
            <YearStudyCard yearName={year.name_ar}>
              <div className="divide-y divide-border/80">
                {year.specializations.map((specialization) => (
                  <div
                    key={specialization.sectionKey}
                    id={getStudyPlanSpecializationAnchorId(specialization.sectionKey)}
                    className="scroll-mt-24"
                  >
                    <div className="border-b border-border/80 bg-brand/[0.04] px-4 py-3 text-center md:px-6 md:text-start">
                      <h3 className="text-base font-bold text-brand-dark md:text-lg">
                        {specialization.name_ar}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">تخصص</p>
                    </div>
                    <SemesterSubjectsMobile
                      sectionKey={specialization.sectionKey}
                      semesters={specialization.semesters}
                    />
                    <SemesterSubjectsDesktop
                      sectionKey={specialization.sectionKey}
                      semesters={specialization.semesters}
                    />
                  </div>
                ))}
              </div>
            </YearStudyCard>
          ) : (
            <YearStudyCard yearName={year.name_ar}>
              <SemesterSubjectsMobile sectionKey={year.sectionKey} semesters={year.semesters} />
              <SemesterSubjectsDesktop sectionKey={year.sectionKey} semesters={year.semesters} />
            </YearStudyCard>
          )}
        </div>
      ))}
    </div>
  );
}

export { countSubjects as countStudyPlanSubjects };
