import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { Card } from "./card";

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function VideoPlayer({ url, title }: { url?: string; title: string }) {
  if (url) {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
      const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

      return (
        <div className="space-y-2">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <Link
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            مشاهدة على يوتيوب
          </Link>
        </div>
      );
    }

    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
        <video src={url} controls className="h-full w-full" title={title} />
      </div>
    );
  }

  return (
    <Card className="flex aspect-video items-center justify-center bg-brand/5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg">
          <Play className="h-7 w-7" />
        </div>
        <p className="text-sm text-muted">فيديو تعريفي للدورة</p>
      </div>
    </Card>
  );
}
