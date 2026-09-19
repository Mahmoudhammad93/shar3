import { MAIN_NAV as DEFAULT_MAIN_NAV, FOOTER_LINKS as DEFAULT_FOOTER_LINKS } from "@/lib/constants/navigation";
import type { NavPageItem, SiteSettings } from "@/types";

export function normalizeNavHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function sortNavPages(pages: NavPageItem[]): NavPageItem[] {
  return [...pages]
    .map((page, index) => ({ page, index }))
    .sort((a, b) => {
      const aOrder = a.page.sort_order ?? a.index;
      const bOrder = b.page.sort_order ?? b.index;
      return aOrder - bOrder;
    })
    .map(({ page }) => page);
}

export function resolveNavPages(settings?: SiteSettings | null): NavPageItem[] {
  if (settings?.website_nav_pages?.length) {
    return sortNavPages(settings.website_nav_pages);
  }

  return DEFAULT_MAIN_NAV.map((link, index) => ({
    href: link.href,
    label_ar: link.label,
    description_ar: null,
    show_in_footer: link.href !== "/",
    is_visible: true,
    sort_order: index,
  }));
}

export function isNavPageVisible(page: NavPageItem): boolean {
  return page.is_visible !== false;
}

export function getMainNavLinks(settings?: SiteSettings | null): NavPageItem[] {
  return resolveNavPages(settings).filter(isNavPageVisible);
}

export function getFooterNavLinks(settings?: SiteSettings | null): NavPageItem[] {
  return resolveNavPages(settings).filter(
    (page) => isNavPageVisible(page) && page.show_in_footer !== false && page.href !== "/",
  );
}

export function isNavPageAccessible(settings: SiteSettings | null | undefined, path: string): boolean {
  const page = findNavPageByPath(settings, path);

  if (!page) {
    return true;
  }

  return isNavPageVisible(page);
}

export function getNavPageLabel(page: NavPageItem, locale: "ar" | "en"): string {
  if (locale === "en" && page.label_en?.trim()) {
    return page.label_en;
  }

  return page.label_ar;
}

export function getNavPageDescription(page: NavPageItem, locale: "ar" | "en"): string | undefined {
  if (locale === "en" && page.description_en?.trim()) {
    return page.description_en;
  }

  return page.description_ar ?? undefined;
}

export function findNavPageByPath(
  settings: SiteSettings | null | undefined,
  path: string,
): NavPageItem | undefined {
  const normalizedPath = normalizeNavHref(path);

  return resolveNavPages(settings).find((page) => normalizeNavHref(page.href) === normalizedPath);
}

export function isNavPathActive(pathname: string, href: string): boolean {
  const current = normalizeNavHref(pathname);
  const target = normalizeNavHref(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}

/** @deprecated Use resolveNavPages(settings) */
export { DEFAULT_MAIN_NAV, DEFAULT_FOOTER_LINKS };
