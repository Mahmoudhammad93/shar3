"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/providers/auth-provider";
import { DashboardThemeProvider, useDashboardTheme } from "@/components/providers/dashboard-theme-provider";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme } = useDashboardTheme();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
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
      <DashboardSidebar />
      <main className="min-h-screen ps-[272px]">
        <div
          className={cn(
            "mx-auto w-full",
            theme.layout === "container" ? "max-w-7xl" : "max-w-none",
            theme.compactMode ? "p-4 md:p-5" : "p-5 md:p-8"
          )}
        >
          {children}
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
