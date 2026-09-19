"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/lib/use-site-settings";

function ContactInfoSkeleton() {
  return (
    <ul className="space-y-4">
      {[1, 2, 3].map((item) => (
        <li key={item} className="h-5 animate-pulse rounded bg-brand/10" />
      ))}
    </ul>
  );
}

export function ContactInfo() {
  const { settings, loading } = useSiteSettings();

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 font-bold text-brand-dark">معلومات التواصل</h3>
        {loading ? (
          <ContactInfoSkeleton />
        ) : (
          <ul className="space-y-4 text-sm text-muted">
            {settings?.phone && (
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span dir="ltr">{settings.phone}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {settings.email}
              </li>
            )}
            {settings?.address_ar && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {settings.address_ar}
              </li>
            )}
            {!settings?.phone && !settings?.email && !settings?.address_ar && (
              <li className="text-muted">لا تتوفر معلومات تواصل حالياً.</li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
