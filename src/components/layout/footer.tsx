"use client";

import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { useLocale } from "@/components/providers/locale-provider";
import { getFooterNavLinks, getNavPageLabel } from "@/lib/navigation";
import { useSiteSettings } from "@/lib/use-site-settings";
import type { SiteSettings } from "@/types";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.788.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function whatsappHref(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function SocialLinks({ settings }: { settings: SiteSettings }) {
  const links = [
    { href: settings.facebook, label: "Facebook", icon: FacebookIcon },
    { href: settings.twitter, label: "X", icon: XIcon },
    { href: settings.instagram, label: "Instagram", icon: InstagramIcon },
    { href: settings.youtube, label: "YouTube", icon: YoutubeIcon },
    { href: settings.telegram, label: "Telegram", icon: TelegramIcon },
    {
      href: whatsappHref(settings.whatsapp),
      label: "WhatsApp",
      icon: WhatsAppIcon,
    },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  const { settings } = useSiteSettings();
  const { locale } = useLocale();
  const footerLinks = getFooterNavLinks(settings);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 text-center md:text-start">
            <SiteLogo
              size="md"
              variant="dark"
              showText
              className="justify-center md:justify-start"
            />
            {settings?.about_ar && (
              <p className="text-sm leading-7 text-white/75">{settings.about_ar}</p>
            )}
            {settings && <SocialLinks settings={settings} />}
          </div>

          <div className="space-y-3 text-center md:text-start">
            <h3 className="text-sm font-bold text-gold">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {settings?.phone && (
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`tel:${settings.phone}`} dir="ltr" className="transition hover:text-gold">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${settings.email}`} className="transition hover:text-gold">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.whatsapp && whatsappHref(settings.whatsapp) && (
                <li className="flex items-center justify-center gap-2 md:justify-start">
                  <WhatsAppIcon className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={whatsappHref(settings.whatsapp)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="transition hover:text-gold"
                  >
                    {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings?.address_ar && (
                <li className="flex items-start justify-center gap-2 md:justify-start">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{settings.address_ar}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3 text-center lg:text-start">
            <h3 className="text-sm font-bold text-gold">روابط سريعة</h3>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/80 transition hover:text-gold"
                >
                  {getNavPageLabel(link, locale)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          {settings?.footer_text_ar && (
            <p className="text-sm leading-7 text-white/70">{settings.footer_text_ar}</p>
          )}
          <p
            dir="ltr"
            className={`flex flex-wrap items-center justify-center gap-1 text-sm text-white/90 ${settings?.footer_text_ar ? "mt-3" : ""}`}
          >
            <span>Made by love with</span>
            <Heart className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" aria-hidden />
            <a
              href="https://chiefcoder.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold transition hover:text-gold-light hover:underline"
            >
              Mahmoud Hammad
            </a>
            <span>
              {year} ©
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
