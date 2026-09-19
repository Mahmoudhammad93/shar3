"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSiteSettings } from "@/lib/use-site-settings";
import type { SiteSettings } from "@/types";

const sizes = {
  sm: { box: "h-10 w-auto max-w-[120px]", icon: "h-5 w-5", square: "h-10 w-10 rounded-xl" },
  md: { box: "h-12 w-auto max-w-[160px]", icon: "h-6 w-6", square: "h-12 w-12 rounded-xl" },
  lg: { box: "h-20 w-auto max-w-[220px]", icon: "h-8 w-8", square: "h-20 w-20 rounded-2xl" },
  hero: { box: "h-auto w-full max-w-[320px]", icon: "h-10 w-10", square: "h-24 w-24 rounded-2xl" },
} as const;

export function SiteLogoMark({
  logoUrl,
  size = "md",
  variant = "brand",
  className,
}: {
  logoUrl?: string | null;
  size?: keyof typeof sizes;
  variant?: "brand" | "dark" | "light";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const s = sizes[size];

  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  const variantClass =
    variant === "dark"
      ? "bg-white/10 text-gold"
      : variant === "light"
        ? "bg-brand/10 text-brand"
        : "bg-brand text-gold shadow-md shadow-brand/20";

  const showImage = logoUrl && !failed;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        showImage ? cn("bg-transparent shadow-none", s.box) : cn(s.square, variantClass),
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-contain object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        <GraduationCap className={s.icon} strokeWidth={1.75} aria-hidden />
      )}
    </div>
  );
}

export function SiteLogo({
  settings: initial,
  href = "/",
  size = "md",
  variant = "brand",
  showMark = true,
  showText = true,
  textClassName,
  className,
}: {
  /** Optional fallback while live settings load */
  settings?: SiteSettings;
  href?: string;
  size?: keyof typeof sizes;
  variant?: "brand" | "dark" | "light";
  showMark?: boolean;
  showText?: boolean;
  textClassName?: string;
  className?: string;
}) {
  const { settings } = useSiteSettings(initial);
  const logoUrl = settings?.logo || "/logo.png";
  const hasLogoImage = Boolean(logoUrl);
  const shouldShowMark = showMark;
  const shouldShowText = showText && (!shouldShowMark || !hasLogoImage);

  const content = (
    <>
      {shouldShowMark && <SiteLogoMark logoUrl={logoUrl} size={size} variant={variant} />}
      {shouldShowText && (
        <div className={cn("shrink-0", textClassName)}>
          <p
            className={cn(
              "whitespace-nowrap font-bold leading-tight",
              size === "lg" || variant === "dark" ? "text-xl" : "text-base",
              variant === "dark" ? "text-white" : "text-brand",
            )}
          >
            {settings?.site_name_ar || "معهد علم شرعي"}
          </p>
          {size !== "sm" && (
            <p
              className={cn(
                "whitespace-nowrap text-xs leading-tight",
                variant === "dark" ? "text-white/70" : "text-muted",
              )}
            >
              {settings?.tagline_ar || "منارة للعلوم الشرعية"}
            </p>
          )}
        </div>
      )}
    </>
  );

  const classes = cn("flex shrink-0 items-center gap-3", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
