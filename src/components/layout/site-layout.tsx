import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { api } from "@/lib/api";

export async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings;
  try {
    const { data } = await api.getSettings();
    settings = data;
  } catch {
    settings = undefined;
  }

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
