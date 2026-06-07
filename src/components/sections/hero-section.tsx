"use client";

import { BookOpen, GraduationCap, Users, UserSquare2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import type { HeroSlide, SiteSettings } from "@/types";

export function HeroSection({
  settings,
  slide,
  stats,
}: {
  settings: SiteSettings;
  slide?: HeroSlide;
  stats: { students: number; courses: number; teachers: number; graduates: number };
}) {
  const statItems = [
    { label: "طلاب", value: stats.students, icon: Users },
    { label: "دورات", value: stats.courses, icon: BookOpen },
    { label: "معلمون", value: stats.teachers, icon: UserSquare2 },
    { label: "خريجون", value: stats.graduates, icon: GraduationCap },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="islamic-pattern absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_35%)]" />

      <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <FadeIn>
          <span className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm text-gold-light">
            {settings.tagline_ar}
          </span>
          <h1 className="text-4xl font-bold leading-[1.15] md:text-5xl lg:text-[3.25rem]">
            {slide?.title_ar || settings.site_name_ar}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
            {slide?.subtitle_ar || settings.about_ar}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/courses" variant="gold" size="lg">
              {slide?.button_text_ar || "ابدأ التعلم"}
            </Button>
            <Button href="/about" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              تعرف على المعهد
            </Button>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 gap-4">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="text-3xl font-bold text-gold">{stat.value}+</p>
                  <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
