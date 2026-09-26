import { SiteLayout } from "@/components/layout/site-layout";
import { ArticleCard } from "@/components/cards/article-card";
import { ConfigurablePageHero } from "@/components/sections/configurable-page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "الأخبار والإعلانات",
  description:
    "آخر أخبار وإعلانات معهد إعداد دعاة التوحيد والسنة: فتح التسجيل، المواعيد الدراسية، والفعاليات العلمية في العلوم الشرعية.",
  path: "/news/",
});

export default async function NewsPage() {
  const { data: announcements } = await api.getAnnouncements();

  return (
    <SiteLayout>
      <ConfigurablePageHero
        path="/news"
        fallbackTitle="الأخبار والإعلانات"
        fallbackSubtitle="آخر مستجدات المعهد وأخبار البرامج والدورات الشرعية"
      />
      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.length === 0 ? (
          <p className="col-span-full py-16 text-center text-muted">لا توجد أخبار أو إعلانات حالياً.</p>
        ) : (
          announcements.map((item) => (
            <ArticleCard key={item.id} article={item} />
          ))
        )}
      </Container>
    </SiteLayout>
  );
}
