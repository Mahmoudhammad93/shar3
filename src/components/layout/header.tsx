"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, User, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/cn";
import { getMainNavLinks, getNavPageLabel, isNavPathActive } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { useSiteSettings } from "@/lib/use-site-settings";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

function UserMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const labels = {
    dashboard: locale === "en" ? "Dashboard" : "لوحة التحكم",
    logout: locale === "en" ? "Log out" : "خروج",
  };

  return (
    <div ref={menuRef} className={cn("relative", mobile && "w-full")}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center gap-1.5 rounded-xl border border-border bg-brand/5 px-2.5 py-1.5 text-sm font-medium text-brand-dark transition hover:bg-brand/10",
          mobile && "w-full justify-between"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <User className="h-4 w-4 shrink-0 text-brand" />
          <span className="truncate">{user.name}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-border bg-surface shadow-lg",
            mobile ? "relative mt-2 w-full" : "end-0 top-full"
          )}
        >
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
            className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-brand-dark transition hover:bg-brand/5"
          >
            <LayoutDashboard className="h-4 w-4 text-brand" />
            {labels.dashboard}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
              logout();
            }}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {labels.logout}
          </button>
        </div>
      )}
    </div>
  );
}

function AuthActions({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) {
    return (
      <div className={cn("h-9 w-24 animate-pulse rounded-xl bg-brand/10", mobile && "w-full")} />
    );
  }

  if (isLoggedIn && user) {
    return <UserMenu mobile={mobile} onNavigate={onNavigate} />;
  }

  return (
    <div className={cn("flex items-center gap-2", mobile && "w-full flex-col")}>
      <Button
        href="/login"
        variant="ghost"
        size="sm"
        className={cn("hidden md:inline-flex", mobile && "inline-flex w-full")}
        onClick={onNavigate}
      >
        دخول
      </Button>
      <Button
        href="/register"
        variant="gold"
        size="sm"
        className={cn(mobile && "w-full")}
        onClick={onNavigate}
      >
        سجّل الآن
      </Button>
    </div>
  );
}

function MobileNavDrawer({
  open,
  onClose,
  pathname,
  drawerOffset,
  navLinks,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  drawerOffset: string;
  navLinks: ReturnType<typeof getMainNavLinks>;
  locale: "ar" | "en";
}) {
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 xl:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: drawerOffset }}
            animate={{ x: 0 }}
            exit={{ x: drawerOffset }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 start-0 z-[101] flex w-[min(100%,320px)] flex-col overflow-y-auto border-e border-border bg-white p-6 shadow-2xl xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة"
          >
            <div className="mb-6 flex shrink-0 items-center justify-between">
              <p className="font-bold text-brand">القائمة</p>
              <button type="button" onClick={onClose} aria-label="إغلاق">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    isNavPathActive(pathname, link.href) ? "bg-brand/10 text-brand" : "text-foreground hover:bg-brand/5"
                  )}
                >
                  {getNavPageLabel(link, locale)}
                </Link>
              ))}
            </nav>
            <div className="mt-6 space-y-4 pb-6">
              <LanguageSwitcher className="w-full justify-center" />
              <AuthActions mobile onNavigate={onClose} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isRtl, locale } = useLocale();
  const { settings } = useSiteSettings();
  const navLinks = getMainNavLinks(settings);
  const drawerOffset = isRtl ? "100%" : "-100%";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-xl">
      <Container className="flex h-[72px] max-w-none items-center gap-2 px-3 sm:px-4 xl:px-5">
        <SiteLogo
          size="md"
          showText
          textClassName="hidden md:block"
          className="shrink-0 gap-2.5"
        />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors",
                isNavPathActive(pathname, link.href)
                  ? "bg-brand/10 text-brand"
                  : "text-muted hover:bg-brand/5 hover:text-brand"
              )}
            >
              {getNavPageLabel(link, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <form action="/courses" method="get" className="relative hidden lg:block">
            <Input name="search" placeholder="ابحث..." className="h-9 w-32 pe-9 text-xs xl:w-36" />
            <Search className="pointer-events-none absolute end-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </form>
          <div className="hidden md:flex">
            <AuthActions />
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-brand xl:hidden"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>

      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        drawerOffset={drawerOffset}
        navLinks={navLinks}
        locale={locale}
      />
    </header>
  );
}
