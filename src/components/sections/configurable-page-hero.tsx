"use client";

import { usePathname } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { useLocale } from "@/components/providers/locale-provider";
import { useSiteSettings } from "@/lib/use-site-settings";
import {
  findNavPageByPath,
  getNavPageDescription,
  getNavPageLabel,
  normalizeNavHref,
} from "@/lib/navigation";

export function ConfigurablePageHero({
  path,
  fallbackTitle,
  fallbackSubtitle,
  children,
}: {
  path?: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { locale } = useLocale();
  const page = findNavPageByPath(settings, path ?? pathname ?? "/");

  const title = page ? getNavPageLabel(page, locale) : fallbackTitle;
  const subtitle = page ? getNavPageDescription(page, locale) ?? fallbackSubtitle : fallbackSubtitle;

  return (
    <PageHero title={title} subtitle={subtitle}>
      {children}
    </PageHero>
  );
}

export function usePageNavMeta(path?: string) {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const { locale } = useLocale();
  const page = findNavPageByPath(settings, normalizeNavHref(path ?? pathname ?? "/"));

  return {
    page,
    title: page ? getNavPageLabel(page, locale) : undefined,
    description: page ? getNavPageDescription(page, locale) : undefined,
  };
}
