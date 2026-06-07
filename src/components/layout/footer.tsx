import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/types";
import { FOOTER_LINKS } from "@/lib/constants/navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import { Container } from "@/components/ui/container";

export function Footer({ settings }: { settings?: SiteSettings }) {
  return (
    <footer className="mt-auto bg-brand-dark text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <SiteLogo settings={settings} variant="dark" />
          </div>
          <p className="max-w-md text-sm leading-7 text-white/70">
            {settings?.about_ar ||
              "مؤسسة تعليمية متخصصة في العلوم الشرعية على منهج أهل السنة والجماعة."}
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gold">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-gold">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span dir="ltr">{settings.phone}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span>{settings.email}</span>
              </li>
            )}
            {settings?.address_ar && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{settings.address_ar}</span>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        {settings?.footer_text_ar || "© معهد علم شرعي — جميع الحقوق محفوظة"}
      </div>
    </footer>
  );
}
