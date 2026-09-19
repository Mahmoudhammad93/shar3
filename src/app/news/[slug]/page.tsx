import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";
import { Container } from "@/components/ui/container";
import { api } from "@/lib/api";
import { getAnnouncementSlugs } from "@/lib/static-params";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getAnnouncementSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: announcement } = await api.getAnnouncement(slug);
    const plainContent = announcement.content_ar?.replace(/<[^>]+>/g, " ").slice(0, 160);

    return buildMetadata({
      title: announcement.title_ar,
      description: plainContent || `إعلان من معهد علم شرعي: ${announcement.title_ar}`,
      path: `/news/${slug}/`,
      type: "article",
    });
  } catch {
    return buildMetadata({ title: "خبر", path: `/news/${slug}/` });
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data: announcement } = await api.getAnnouncement(slug);

    return (
      <SiteLayout>
        <Container className="py-16">
          <article className="mx-auto max-w-3xl">
            {announcement.published_at && (
              <p className="mb-3 flex items-center gap-2 text-sm text-muted">
                <Calendar className="h-4 w-4" />
                {announcement.published_at}
              </p>
            )}
            <h1 className="text-4xl font-bold text-brand-dark">{announcement.title_ar}</h1>
            <div className="prose prose-lg mt-8 max-w-none leading-8 text-muted">
              {announcement.content_ar}
            </div>
            <Link href="/news" className="mt-10 inline-flex items-center gap-2 text-brand">
              <ArrowRight className="h-4 w-4" />
              العودة للأخبار
            </Link>
          </article>
        </Container>
      </SiteLayout>
    );
  } catch {
    notFound();
  }
}
