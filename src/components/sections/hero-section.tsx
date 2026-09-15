"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/motion/fade-in";
import { useSiteSettings } from "@/lib/use-site-settings";
import type { HeroSlide } from "@/types";

function excerpt(text?: string | null, max = 200): string {
  if (!text) return "";
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

export function HeroSection({ slide }: { slide?: HeroSlide }) {
  const { settings } = useSiteSettings();
  const instituteName = settings?.site_name_ar || "معهد إعداد دعاة التوحيد والسنة";
  const tagline = settings?.tagline_ar || "إعداد علمي .. تأهيل دعوي";
  const description =
    excerpt(settings?.about_ar) ||
    slide?.subtitle_ar ||
    "صرح علمي ودعوي يُعنى بتأصيل العقيدة الصحيحة، والدعوة إلى الكتاب والسنة بفهم سلف الأمة.";

  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="islamic-pattern absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(197,160,77,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_35%)]" />

      <Container className="relative py-16 lg:py-24">
        <FadeIn className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm text-gold-light">
            {tagline}
          </span>

          <h1 className="text-4xl font-bold leading-[1.15] md:text-5xl lg:text-[3.25rem]">
            {instituteName}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={slide?.button_url || "/register"} variant="gold" size="lg">
              {slide?.button_text_ar || "سجّل الآن"}
            </Button>
            <Button
              href="/about"
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              تعرف على المعهد
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
