"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/lib/use-site-settings";
import { ABOUT_DEFAULT, MISSION_DEFAULT, VISION_DEFAULT } from "@/lib/seo";
import type { SiteSettings } from "@/types";

export function AboutContent({ initial }: { initial?: SiteSettings }) {
  const { settings, loading } = useSiteSettings(initial);

  if (loading && !settings) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-40 animate-pulse rounded-2xl bg-brand/10" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-2xl bg-brand/10" />
            <div className="h-48 animate-pulse rounded-2xl bg-brand/10" />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="mb-4 text-2xl font-bold text-brand-dark">من نحن</h2>
            <p className="leading-8 text-muted">{settings?.about_ar || ABOUT_DEFAULT}</p>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-brand text-white">
            <CardContent className="p-8">
              <h3 className="mb-3 text-xl font-bold text-gold">رؤيتنا</h3>
              <p className="leading-7 text-white/90">{settings?.vision_ar || VISION_DEFAULT}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <h3 className="mb-3 text-xl font-bold text-brand-dark">رسالتنا</h3>
              <p className="leading-7 text-muted">{settings?.mission_ar || MISSION_DEFAULT}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
