"use client";

import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarRating } from "@/components/ui/rating";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section className="bg-brand-dark text-white">
      <SectionHeader
        eyebrow="آراء الطلاب"
        title="ماذا يقول طلابنا"
        description="تجارب حقيقية من رحلة طلب العلم الشرعي في معهد إعداد دعاة التوحيد والسنة"
      />
      <Container>
        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-gold" />
                  <p className="leading-8 text-white/90">&ldquo;{item.content_ar}&rdquo;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <footer className="text-sm text-gold">
                      {item.name_ar}
                      {item.role_ar && ` — ${item.role_ar}`}
                    </footer>
                    <StarRating rating={item.rating} />
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
