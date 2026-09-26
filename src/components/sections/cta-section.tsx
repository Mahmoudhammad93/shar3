"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/motion/fade-in";
import { useAuth } from "@/components/providers/auth-provider";

export function CtaSection() {
  const { isLoggedIn, loading } = useAuth();

  return (
    <section className="pb-20 pt-4">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center text-white md:px-12 md:py-16">
            <div className="islamic-pattern absolute inset-0 opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl">
                {isLoggedIn ? "تابع رحلتك في طلب العلم" : "ابدأ رحلتك في طلب العلم اليوم"}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                {isLoggedIn
                  ? "انتقل إلى لوحة التحكم لمتابعة دوراتك وواجباتك"
                  : "انضم إلى آلاف الطلاب في معهد إعداد دعاة التوحيد والسنة واستفد من برامجنا الشرعية المتكاملة"}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {!loading && isLoggedIn ? (
                  <Button href="/dashboard" variant="gold" size="lg">
                    لوحة التحكم
                  </Button>
                ) : (
                  <Button href="/register" variant="gold" size="lg">
                    إنشاء حساب
                  </Button>
                )}
                <Button href="/courses" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  تصفح الدورات
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
