"use client";

import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <Section>
      <SectionHeader title="الأسئلة الشائعة" description="إجابات على أكثر الأسئلة شيوعاً" />
      <Container className="max-w-3xl">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.id} delay={i * 0.05}>
              <details className="group rounded-2xl border border-border bg-surface shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-brand-dark">
                  {faq.question_ar}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" />
                </summary>
                <p className="border-t border-border px-5 py-4 text-sm leading-7 text-muted">{faq.answer_ar}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
