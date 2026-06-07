import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

export default async function ContactPage() {
  const { data: settings } = await api.getSettings();

  return (
    <SiteLayout>
      <PageHero title="تواصل معنا" subtitle="نسعد باستقبال استفساراتكم وملاحظاتكم" />
      <Container className="grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-bold text-brand-dark">معلومات التواصل</h3>
              <ul className="space-y-4 text-sm text-muted">
                {settings.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-gold" />
                    <span dir="ltr">{settings.phone}</span>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-gold" />
                    {settings.email}
                  </li>
                )}
                {settings.address_ar && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {settings.address_ar}
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
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
