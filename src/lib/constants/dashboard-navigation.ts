import {
  Award,
  Bell,
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileBadge,
  Headphones,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  Video,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { DashboardNavGroupKey, DashboardNavItemKey } from "@/lib/i18n/dashboard-nav";

export interface DashboardNavItem {
  href: string;
  labelKey: DashboardNavItemKey;
  icon: LucideIcon;
  matchChild?: boolean;
  roles?: string[];
  external?: boolean;
  /** Site setting toggle key — item hidden when false */
  settingKey?:
    | "enable_live_lessons"
    | "enable_hifz"
    | "enable_honor_board"
    | "enable_forum"
    | "enable_wallet";
}

export interface DashboardNavGroup {
  titleKey: DashboardNavGroupKey;
  items: DashboardNavItem[];
}

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    titleKey: "learning",
    items: [
      { href: "/dashboard/courses", labelKey: "courses", icon: BookOpen },
      { href: "/dashboard/schedule", labelKey: "schedule", icon: CalendarDays },
      {
        href: "/dashboard/live-lessons",
        labelKey: "liveLessons",
        icon: Video,
        settingKey: "enable_live_lessons",
      },
      { href: "/dashboard/assignments", labelKey: "assignments", icon: ClipboardList },
      {
        href: "/dashboard/hifz",
        labelKey: "hifz",
        icon: BookMarked,
        settingKey: "enable_hifz",
      },
    ],
  },
  {
    titleKey: "achievement",
    items: [
      {
        href: "/dashboard/honor-board",
        labelKey: "honorBoard",
        icon: Award,
        settingKey: "enable_honor_board",
      },
      { href: "/dashboard/grades", labelKey: "certificates", icon: FileBadge },
      { href: "/dashboard/library", labelKey: "library", icon: Library },
    ],
  },
  {
    titleKey: "community",
    items: [
      {
        href: "/dashboard/forum",
        labelKey: "forum",
        icon: MessageSquare,
        settingKey: "enable_forum",
      },
      { href: "/dashboard/announcements", labelKey: "announcements", icon: Bell },
    ],
  },
  {
    titleKey: "account",
    items: [
      { href: "/dashboard/profile", labelKey: "profile", icon: User },
      {
        href: "/dashboard/wallet",
        labelKey: "wallet",
        icon: Wallet,
        settingKey: "enable_wallet",
      },
      { href: "/dashboard/settings", labelKey: "settings", icon: Settings },
      {
        href:
          (typeof process !== "undefined"
            ? process.env.NEXT_PUBLIC_ADMIN_URL
            : undefined) ||
          "http://localhost:8000/admin",
        labelKey: "adminPanel",
        icon: ShieldCheck,
        roles: ["admin", "staff"],
        external: true,
      },
    ],
  },
];

export const DASHBOARD_SUPPORT_ITEM: DashboardNavItem = {
  href: "/dashboard/support",
  labelKey: "support",
  icon: Headphones,
};

export function isDashboardNavActive(pathname: string, item: DashboardNavItem): boolean {
  if (item.matchChild === false) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getActiveDashboardNavItem(pathname: string): DashboardNavItem | undefined {
  for (const group of DASHBOARD_NAV_GROUPS) {
    for (const item of group.items) {
      if (isDashboardNavActive(pathname, item)) return item;
    }
  }
  if (isDashboardNavActive(pathname, DASHBOARD_SUPPORT_ITEM)) return DASHBOARD_SUPPORT_ITEM;
  if (pathname === "/dashboard") {
    return DASHBOARD_NAV_GROUPS[0].items[0];
  }
  return undefined;
}

/** @deprecated kept for layout dashboard title fallback */
export const DASHBOARD_ADMIN_ICON = LayoutDashboard;
