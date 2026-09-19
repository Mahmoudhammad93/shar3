import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NavPageVisibilityGuard } from "@/components/layout/nav-page-visibility-guard";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <NavPageVisibilityGuard>
        <main className="flex-1">{children}</main>
      </NavPageVisibilityGuard>
      <Footer />
    </>
  );
}
