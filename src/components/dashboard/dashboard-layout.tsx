"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/providers/auth-provider";
import { canAccessAcademicDashboard, getStudentDashboardPath } from "@/lib/student-auth";
import { DashboardThemeProvider, useDashboardTheme } from "@/components/providers/dashboard-theme-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileHeader } from "@/components/dashboard/dashboard-mobile-header";
import { Footer } from "@/components/layout/footer";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { theme } = useDashboardTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (!loading && user && !canAccessAcademicDashboard(user)) {
      router.replace(getStudentDashboardPath(user));
    }
  }, [loading, user, router]);

  if (loading || !user || !canAccessAcademicDashboard(user)) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--dashboard-background, #f4f7f6)" }}
      >
        <p className="text-brand">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--dashboard-background, #f4f7f6)" }}>
      <DashboardSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex min-h-screen flex-col lg:ps-[300px]">
        <DashboardMobileHeader onOpenMenu={() => setSidebarOpen(true)} />
        <div
          className={cn(
            "mx-auto w-full flex-1",
            theme.layout === "container" ? "max-w-7xl" : "max-w-none",
            theme.compactMode ? "p-4 md:p-5" : "p-4 sm:p-5 md:p-8"
          )}
        >
          {children}
        </div>
        <div className="hidden lg:block">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardThemeProvider>
  );
}
