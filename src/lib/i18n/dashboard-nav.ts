import type { Locale } from "@/lib/locale";

export type DashboardNavGroupKey = "learning" | "achievement" | "community" | "account" | "help";
export type DashboardNavItemKey =
  | "courses"
  | "schedule"
  | "liveLessons"
  | "assignments"
  | "hifz"
  | "honorBoard"
  | "certificates"
  | "library"
  | "forum"
  | "announcements"
  | "profile"
  | "wallet"
  | "settings"
  | "adminPanel"
  | "support"
  | "logout";

const translations: Record<
  Locale,
  {
    groups: Record<DashboardNavGroupKey, string>;
    items: Record<DashboardNavItemKey, string>;
  }
> = {
  ar: {
    groups: {
      learning: "التعلم",
      achievement: "الإنجاز",
      community: "المجتمع",
      account: "الحساب",
      help: "المساعدة",
    },
    items: {
      courses: "موادي الدراسية",
      schedule: "الجدول الأسبوعي",
      liveLessons: "الدروس المباشرة",
      assignments: "الواجبات",
      hifz: "متابعة الحفظ",
      honorBoard: "لوحة الشرف",
      certificates: "الشهادات",
      library: "خزانة المتون",
      forum: "المنتدى الدراسي",
      announcements: "الإشعارات",
      profile: "الملف الشخصي",
      wallet: "المحفظة",
      settings: "الإعدادات",
      adminPanel: "لوحة الإدارة",
      support: "الدعم الفني",
      logout: "تسجيل الخروج",
    },
  },
  en: {
    groups: {
      learning: "Learning",
      achievement: "Achievement",
      community: "Community",
      account: "Account",
      help: "Help",
    },
    items: {
      courses: "My Courses",
      schedule: "Weekly Schedule",
      liveLessons: "Live Lessons",
      assignments: "Assignments",
      hifz: "Hifz Progress",
      honorBoard: "Honor Board",
      certificates: "Certificates",
      library: "Text Library",
      forum: "Study Forum",
      announcements: "Announcements",
      profile: "Profile",
      wallet: "Wallet",
      settings: "Settings",
      adminPanel: "Admin Panel",
      support: "Support",
      logout: "Log out",
    },
  },
};

export function getDashboardNavLabel(
  locale: Locale,
  key: DashboardNavItemKey | DashboardNavGroupKey
): string {
  const t = translations[locale];
  if (key in t.groups) {
    return t.groups[key as DashboardNavGroupKey];
  }
  return t.items[key as DashboardNavItemKey];
}
