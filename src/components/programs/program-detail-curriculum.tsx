"use client";

import { useEffect, useState } from "react";
import type { Program } from "@/types";
import { api } from "@/lib/api";
import {
  ProgramCurriculumSections,
  ProgramFlatSubjects,
  ProgramSpecializationCurriculumSections,
} from "@/components/programs/program-curriculum-sections";

function renderCurriculum(program: Program) {
  const hasSpecializations = (program.specializations?.length ?? 0) > 0;
  const hasYears = (program.years?.length ?? 0) > 0;
  const hasFlatSubjects = (program.subjects?.length ?? 0) > 0;

  if (hasSpecializations) {
    return <ProgramSpecializationCurriculumSections specializations={program.specializations ?? []} />;
  }

  if (hasYears) {
    return <ProgramCurriculumSections years={program.years ?? []} />;
  }

  if (hasFlatSubjects) {
    return <ProgramFlatSubjects subjects={program.subjects ?? []} />;
  }

  return <p className="text-muted">لا توجد مواد مسجّلة لهذا المستوى حالياً.</p>;
}

export function ProgramDetailCurriculum({
  slug,
  initialProgram,
}: {
  slug: string;
  initialProgram: Program;
}) {
  const [program, setProgram] = useState(initialProgram);

  useEffect(() => {
    api
      .getProgramLive(slug)
      .then((response) => {
        setProgram(response.data);
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, [slug]);

  return renderCurriculum(program);
}
