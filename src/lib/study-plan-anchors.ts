export function getStudyPlanYearAnchorId(sectionKey: string): string {
  return `study-plan-year-${sectionKey}`;
}

export function getStudyPlanSpecializationAnchorId(sectionKey: string): string {
  return `study-plan-spec-${sectionKey}`;
}

export function getStudyPlanSemesterAnchorId(sectionKey: string, semesterSlug: string): string {
  return `study-plan-semester-${sectionKey}-${semesterSlug}`;
}

export function scrollToStudyPlanSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  const headerOffset = 96;
  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
}

export type StudyPlanIndexSemester = {
  anchorId: string;
  name: string;
};

export type StudyPlanIndexSpecialization = {
  anchorId: string;
  name: string;
  semesters: StudyPlanIndexSemester[];
};

export type StudyPlanIndexYear = {
  anchorId: string;
  name: string;
  levelName?: string;
  /** General curriculum: semesters directly under the year. */
  semesters: StudyPlanIndexSemester[];
  /** Specialized curriculum: specializations (with their semesters) under one year. */
  specializations: StudyPlanIndexSpecialization[];
};
