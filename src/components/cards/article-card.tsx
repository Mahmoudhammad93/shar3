import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Announcement } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function ArticleCard({ article, className }: { article: Announcement; className?: string }) {
  return (
    <Card className={cn("group overflow-hidden card-hover", className)}>
      <div className="aspect-[16/9] bg-gradient-to-br from-brand/10 to-brand/5">
        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image} alt={article.title_ar} className="h-full w-full object-cover" />
        )}
      </div>
      <CardContent className="p-5">
        {article.published_at && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <Calendar className="h-3.5 w-3.5" />
            {article.published_at}
          </p>
        )}
        <h3 className="mb-2 text-lg font-bold text-brand-dark">{article.title_ar}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted">{article.excerpt_ar}</p>
        <Link
          href={`/news/${article.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"
        >
          اقرأ المزيد
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
