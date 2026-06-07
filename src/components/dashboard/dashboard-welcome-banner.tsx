"use client";

import { BookOpen, Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/providers/locale-provider";
import { useDashboardTheme } from "@/components/providers/dashboard-theme-provider";

export function DashboardWelcomeBanner({
  name,
  activeCourses = 0,
  completedLessons = 0,
  totalLessons = 0,
}: {
  name: string;
  activeCourses?: number;
  completedLessons?: number;
  totalLessons?: number;
}) {
  const { locale } = useLocale();
  const { settings, theme } = useDashboardTheme();

  const achievementRate =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const welcomeMessage =
    locale === "en"
      ? settings?.dashboard_welcome_en ||
        "Welcome to your student dashboard — we wish you success in your learning journey."
      : settings?.dashboard_welcome_ar ||
        "«من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة»";

  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl px-6 py-8 text-white md:px-10 md:py-10",
        theme.style === "minimal" && "shadow-none",
        theme.style === "modern" && "shadow-lg"
      )}
      style={{ backgroundColor: "var(--dashboard-sidebar, #0a3d34)" }}
    >
      {theme.showPattern && <div className="islamic-pattern absolute inset-0 opacity-[0.15]" />}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--brand-gold) 12%, transparent), transparent 50%)",
        }}
      />

      <div className="relative text-center">
        <p className="text-sm text-gold/90">
          {locale === "en" ? "In the name of Allah, the Most Gracious, the Most Merciful" : "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
        </p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          {locale === "en" ? `Welcome, ${name}` : `مرحباً بك، ${name}`}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
          {welcomeMessage}
        </p>
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: locale === "en" ? "Active courses" : "المواد الحالية",
            value: String(activeCourses),
            icon: BookOpen,
          },
          {
            label: locale === "en" ? "Completed lessons" : "الدروس المكتملة",
            value: `${completedLessons} / ${totalLessons}`,
            icon: BookOpen,
          },
          {
            label: locale === "en" ? "Progress rate" : "نسبة الإنجاز",
            value: `${achievementRate}%`,
            icon: Flame,
            highlight: true,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                "rounded-xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm",
                stat.highlight && "border-gold/20 bg-gold/10"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-white/60">{stat.label}</p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-bold",
                      stat.highlight ? "text-gold" : "text-white"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    stat.highlight ? "text-gold" : "text-white/40"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
