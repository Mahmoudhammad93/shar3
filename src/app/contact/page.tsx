import { SiteLayout } from "@/components/layout/site-layout";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/forms/contact-form";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "تواصل معنا",
  description:
    "تواصل مع معهد علم شرعي للاستفسار عن الدورات والبرامج الشرعية، التسجيل، والقبول. نسعد بالرد على أسئلتكم حول طلب العلم الشرعي.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/contact"
        fallbackTitle="تواصل معنا"
        fallbackSubtitle="نسعد باستقبال استفساراتكم حول الدورات والبرامج الشرعية والتسجيل في المعهد"
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <ContactInfo />
          <Card className="bg-brand text-white">
            <CardContent className="p-6">
              <h3 className="mb-3 font-bold text-gold">ساعات العمل</h3>
              <p className="text-sm leading-7 text-white/90">من السبت إلى الخميس — 9 صباحاً حتى 5 مساءً</p>
            </CardContent>
          </Card>
        </div>
        <ContactForm />
      </Container>
    </SiteLayout>
  );
}
