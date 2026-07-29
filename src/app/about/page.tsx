import { SiteLayout } from "@/components/layout/site-layout";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { ABOUT_DEFAULT, buildMetadata, MISSION_DEFAULT, VISION_DEFAULT } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "عن المعهد",
  description:
    "تعرّف على معهد علم شرعي: مؤسسة تعليمية إسلامية تُعنى بتيسير طلب العلم الشرعي على منهج أهل السنة والجماعة في التفسير والفقه والحديث والعقيدة.",
  path: "/about/",
});

export default async function AboutPage() {
  const { data: settings } = await api.getSettings();

  return (
    <SiteLayout>
      <PageHero
        title="عن المعهد"
        subtitle={settings.tagline_ar || "تعليم العلوم الشرعية على منهج أهل السنة والجماعة"}
      />
      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-4 text-2xl font-bold text-brand-dark">من نحن</h2>
              <p className="leading-8 text-muted">{settings.about_ar || ABOUT_DEFAULT}</p>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-brand text-white">
              <CardContent className="p-8">
                <h3 className="mb-3 text-xl font-bold text-gold">رؤيتنا</h3>
                <p className="leading-7 text-white/90">{settings.vision_ar || VISION_DEFAULT}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <h3 className="mb-3 text-xl font-bold text-brand-dark">رسالتنا</h3>
                <p className="leading-7 text-muted">{settings.mission_ar || MISSION_DEFAULT}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </SiteLayout>
  );
}
