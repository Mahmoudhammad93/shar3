"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/lib/use-site-settings";

function faviconType(url: string): string {
  if (url.endsWith(".svg")) return "image/svg+xml";
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function setLink(rel: string, href: string) {
  const type = faviconType(href);
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.type = type;
  link.href = href;
}

export function SiteFavicon() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!settings?.favicon) return;

    setLink("icon", settings.favicon);
    setLink("apple-touch-icon", settings.favicon);
  }, [settings?.favicon]);

  return null;
}
