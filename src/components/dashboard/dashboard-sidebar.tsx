"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  DASHBOARD_NAV_GROUPS,
  DASHBOARD_SUPPORT_ITEM,
  isDashboardNavActive,
  type DashboardNavItem,
} from "@/lib/constants/dashboard-navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { useDashboardTheme } from "@/components/providers/dashboard-theme-provider";
import { getDashboardNavLabel } from "@/lib/i18n/dashboard-nav";
import type { SiteSettings } from "@/types";
import "./dashboard-sidebar.css";

const DEFAULT_INSTITUTE = { ar: "معهد العلوم الشرعية", en: "Share3a Institute" };
const DEFAULT_YEAR = { ar: "العام الدراسي ١٤٤٦ هـ", en: "Academic Year 1446 AH" };

function NavLink({
  item,
  active,
  label,
  sidebarStyle,
}: {
  item: DashboardNavItem;
  active: boolean;
  label: string;
  sidebarStyle: "dark" | "light";
}) {
  const Icon = item.icon;
  const isLight = sidebarStyle === "light";

  const className = cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
    active
      ? "bg-gold shadow-sm"
      : isLight
        ? "text-brand-dark/75 hover:bg-brand/5 hover:text-brand-dark"
        : "text-white/80 hover:bg-white/10 hover:text-white",
    active && (isLight ? "text-brand-dark" : "text-[color:var(--dashboard-sidebar,#0a3d34)]")
  );

  const content = (
    <>
      <Icon
        className={cn(
          "h-[17px] w-[17px] shrink-0",
          active
            ? isLight
              ? "text-brand-dark"
              : "text-[color:var(--dashboard-sidebar,#0a3d34)]"
            : isLight
              ? "text-brand/50"
              : "text-white/55"
        )}
      />
      <span className="leading-snug">{label}</span>
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

function isItemVisible(item: DashboardNavItem, settings: SiteSettings | null): boolean {
  if (!item.settingKey || !settings) return true;
  const value = settings[item.settingKey];
  return value !== false;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const { settings, theme } = useDashboardTheme();

  const instituteName =
    locale === "en"
      ? settings?.dashboard_institute_name_en ||
        settings?.site_name_en ||
        DEFAULT_INSTITUTE.en
      : settings?.dashboard_institute_name_ar ||
        settings?.site_name_ar ||
        DEFAULT_INSTITUTE.ar;

  const academicYear =
    locale === "en"
      ? settings?.academic_year_en || DEFAULT_YEAR.en
      : settings?.academic_year_ar || DEFAULT_YEAR.ar;

  const isLightSidebar = theme.sidebarStyle === "light";

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-40 flex w-[272px] min-h-0 flex-col overflow-hidden shadow-xl",
        isLightSidebar ? "border-e border-border bg-surface text-brand-dark" : "text-white"
      )}
      style={!isLightSidebar ? { backgroundColor: "var(--dashboard-sidebar, #0a3d34)" } : undefined}
    >
      {theme.showPattern && !isLightSidebar && (
        <div className="islamic-pattern absolute inset-0 opacity-[0.08]" />
      )}

      <div
        className={cn(
          "relative border-b px-5 py-5",
          isLightSidebar ? "border-border" : "border-white/10"
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          {theme.logoUrl ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={theme.logoUrl} alt={instituteName} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                isLightSidebar ? "bg-brand/10 text-brand" : "bg-gold/15 text-gold"
              )}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold leading-tight">{instituteName}</p>
            <p className={cn("mt-0.5 text-[11px]", isLightSidebar ? "text-muted" : "text-white/50")}>
              {academicYear}
            </p>
          </div>
        </Link>
      </div>

      <nav
        className="dashboard-sidebar-scroll relative min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.accent} transparent`,
        }}
      >
        {DASHBOARD_NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.roles && (!user || !item.roles.includes(user.role))) return false;
            return isItemVisible(item, settings);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.titleKey}>
              <p
                className={cn(
                  "mb-2 px-3 text-[11px] font-semibold tracking-wide",
                  isLightSidebar ? "text-muted" : "text-white/40"
                )}
              >
                {getDashboardNavLabel(locale, group.titleKey)}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    label={getDashboardNavLabel(locale, item.labelKey)}
                    active={!item.external && isDashboardNavActive(pathname, item)}
                    sidebarStyle={theme.sidebarStyle}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div>
          <p
            className={cn(
              "mb-2 px-3 text-[11px] font-semibold tracking-wide",
              isLightSidebar ? "text-muted" : "text-white/40"
            )}
          >
            {getDashboardNavLabel(locale, "help")}
          </p>
          <NavLink
            item={DASHBOARD_SUPPORT_ITEM}
            label={getDashboardNavLabel(locale, DASHBOARD_SUPPORT_ITEM.labelKey)}
            active={isDashboardNavActive(pathname, DASHBOARD_SUPPORT_ITEM)}
            sidebarStyle={theme.sidebarStyle}
          />
        </div>
      </nav>

      <div
        className={cn(
          "relative border-t p-4",
          isLightSidebar ? "border-border" : "border-white/10"
        )}
      >
        <button
          type="button"
          onClick={() => logout().then(() => router.push("/login"))}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
            isLightSidebar
              ? "text-muted hover:bg-brand/5 hover:text-brand-dark"
              : "text-white/75 hover:bg-white/10 hover:text-white"
          )}
        >
          <LogOut className="h-[17px] w-[17px]" />
          {getDashboardNavLabel(locale, "logout")}
        </button>
      </div>
    </aside>
  );
}
