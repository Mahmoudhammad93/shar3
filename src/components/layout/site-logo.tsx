import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/types";

const sizes = {
  sm: { box: "h-9 w-9 rounded-lg", icon: "h-4 w-4" },
  md: { box: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
  lg: { box: "h-20 w-20 rounded-2xl", icon: "h-10 w-10" },
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
  const s = sizes[size];
  const variantClass =
    variant === "dark"
      ? "bg-white/10 text-gold"
      : variant === "light"
        ? "bg-brand/10 text-brand"
        : "bg-brand text-gold shadow-md shadow-brand/20";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        s.box,
        variantClass,
        className
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <GraduationCap className={s.icon} strokeWidth={1.75} aria-hidden />
      )}
    </div>
  );
}

export function SiteLogo({
  settings,
  href = "/",
  size = "md",
  variant = "brand",
  showText = true,
  textClassName,
  className,
}: {
  settings?: SiteSettings;
  href?: string;
  size?: keyof typeof sizes;
  variant?: "brand" | "dark" | "light";
  showText?: boolean;
  textClassName?: string;
  className?: string;
}) {
  const content = (
    <>
      <SiteLogoMark logoUrl={settings?.logo} size={size} variant={variant} />
      {showText && (
        <div className={cn("min-w-0", textClassName)}>
          <p
            className={cn(
              "truncate font-bold leading-tight",
              size === "lg" || variant === "dark" ? "text-xl" : "text-base",
              variant === "dark" ? "text-white" : "text-brand"
            )}
          >
            {settings?.site_name_ar || "معهد علم شرعي"}
          </p>
          {size !== "sm" && (
            <p
              className={cn(
                "truncate text-xs",
                variant === "dark" ? "text-white/70" : "text-muted"
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
