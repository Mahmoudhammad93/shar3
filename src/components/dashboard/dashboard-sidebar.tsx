"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
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
import { SiteLogoMark } from "@/components/layout/site-logo";
import { getDashboardNavLabel } from "@/lib/i18n/dashboard-nav";
import type { SiteSettings } from "@/types";
import "./dashboard-sidebar.css";

export const DASHBOARD_SIDEBAR_WIDTH_PX = 300;

const DEFAULT_INSTITUTE = { ar: "معهد علم شرعي", en: "Share3a Institute" };
const DEFAULT_TAGLINE = { ar: "منارة للعلوم الشرعية", en: "A beacon of Islamic knowledge" };

function NavLink({
  item,
  active,
  label,
  sidebarStyle,
  onNavigate,
}: {
  item: DashboardNavItem;
  active: boolean;
  label: string;
  sidebarStyle: "dark" | "light";
  onNavigate?: () => void;
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
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

function isItemVisible(item: DashboardNavItem, settings: SiteSettings | null): boolean {
  if (!item.settingKey || !settings) return true;
  const value = settings[item.settingKey];
  return value !== false;
}

function DashboardSidebarBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

export function DashboardSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const { settings, theme } = useDashboardTheme();

  const instituteName =
    locale === "en"
      ? settings?.site_name_en ||
        settings?.dashboard_institute_name_en ||
        DEFAULT_INSTITUTE.en
      : settings?.site_name_ar ||
        settings?.dashboard_institute_name_ar ||
        DEFAULT_INSTITUTE.ar;

  const instituteSubtitle =
    locale === "en"
      ? settings?.tagline_en ||
        settings?.academic_year_en ||
        DEFAULT_TAGLINE.en
      : settings?.tagline_ar ||
        settings?.academic_year_ar ||
        DEFAULT_TAGLINE.ar;

  const isLightSidebar = theme.sidebarStyle === "light";
  const closeSidebar = () => onClose?.();

  return (
    <>
      <DashboardSidebarBackdrop open={mobileOpen} onClose={closeSidebar} />
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-[91] flex min-h-0 flex-col shadow-xl transition-transform duration-300 ease-in-out lg:z-40",
          !mobileOpen && "max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full",
          isLightSidebar ? "border-e border-border text-brand-dark" : "text-white"
        )}
        style={{
          width: DASHBOARD_SIDEBAR_WIDTH_PX,
          backgroundColor: "var(--dashboard-sidebar, #0a3d34)",
        }}
      >
      {theme.showPattern && !isLightSidebar && (
        <div className="islamic-pattern absolute inset-0 opacity-[0.08]" />
      )}

      <div
        className={cn(
          "relative shrink-0 border-b px-4 py-5",
          isLightSidebar ? "border-border" : "border-white/10"
        )}
      >
        <Link href="/" className="flex flex-col items-center gap-3 text-center">
          <SiteLogoMark
            logoUrl={settings?.logo ?? theme.logoUrl}
            size="md"
            variant="dark"
            className="rounded-full shadow-md"
          />
          <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <p className="whitespace-nowrap text-[12px] font-bold leading-tight">{instituteName}</p>
            <p
              className={cn(
                "mt-1 whitespace-nowrap text-[11px] leading-tight",
                isLightSidebar ? "text-muted" : "text-white/50"
              )}
            >
              {instituteSubtitle}
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
                    onNavigate={closeSidebar}
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
            onNavigate={closeSidebar}
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
    </>
  );
}
