"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";

const SLUG_GRADIENTS: Record<string, string> = {
  "tafsir-al-baqarah": "from-emerald-800 to-emerald-950",
  "fiqh-ibadat": "from-teal-700 to-teal-900",
  "ulum-al-hadith": "from-amber-800 to-amber-950",
  "islamic-aqeedah": "from-slate-700 to-slate-900",
};

function gradientForSlug(slug?: string): string {
  if (slug && SLUG_GRADIENTS[slug]) return SLUG_GRADIENTS[slug];
  return "from-brand/80 to-brand-dark";
}

export function CourseThumbnail({
  title,
  slug,
  image,
  className,
  aspectClass = "aspect-[16/10]",
  badge,
}: {
  title: string;
  slug?: string;
  image?: string | null;
  className?: string;
  aspectClass?: string;
  badge?: React.ReactNode;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        gradientForSlug(slug),
        aspectClass,
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image!}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <BookOpen className="h-12 w-12 text-white/35" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-black/10" />
      {badge && (
        <div className="absolute start-3 top-3 z-20">{badge}</div>
      )}
    </div>
  );
}
