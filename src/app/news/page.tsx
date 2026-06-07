import { SiteLayout } from "@/components/layout/site-layout";
import { ArticleCard } from "@/components/cards/article-card";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";

export default async function NewsPage() {
  const { data: announcements } = await api.getAnnouncements();

  return (
    <SiteLayout>
      <PageHero title="الأخبار والإعلانات" subtitle="آخر مستجدات المعهد" />
      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.map((item) => (
          <ArticleCard key={item.id} article={item} />
        ))}
      </Container>
    </SiteLayout>
  );
}
