"use client";

import { useEffect } from "react";
import { notFound, usePathname } from "next/navigation";
import { isNavPageAccessible, normalizeNavHref } from "@/lib/navigation";
import { useSiteSettings } from "@/lib/use-site-settings";

const MANAGED_PATHS = new Set([
  "/",
  "/about",
  "/study-plan",
  "/courses",
  "/programs",
  "/regulations",
  "/teachers",
  "/news",
  "/contact",
]);

export function NavPageVisibilityGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, loading } = useSiteSettings();
  const normalizedPath = normalizeNavHref(pathname ?? "/");
  const isManagedPage = MANAGED_PATHS.has(normalizedPath);

  useEffect(() => {
    if (loading || !isManagedPage) {
      return;
    }

    if (!isNavPageAccessible(settings, normalizedPath)) {
      notFound();
    }
  }, [loading, settings, normalizedPath, isManagedPage]);

  if (!loading && isManagedPage && !isNavPageAccessible(settings, normalizedPath)) {
    notFound();
  }

  return children;
}
