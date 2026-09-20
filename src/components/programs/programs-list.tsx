"use client";

import { useEffect, useState } from "react";
import type { Program } from "@/types";
import { ProgramCard } from "@/components/cards/program-card";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";

export function ProgramsList({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);

  useEffect(() => {
    api
      .getProgramsLive()
      .then((response) => {
        if (response.data.length > 0) {
          setPrograms(response.data);
        }
      })
      .catch(() => {
        /* keep build-time fallback */
      });
  }, []);

  if (programs.length === 0) {
    return (
      <Container className="py-16">
        <p className="text-center text-muted">لا توجد برامج متاحة حالياً.</p>
      </Container>
    );
  }

  return (
    <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </Container>
  );
}
