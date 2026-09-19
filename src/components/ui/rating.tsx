import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function StarRating({ rating = 5, className }: { rating?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 text-gold", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-3.5 w-3.5", i < rating ? "fill-gold text-gold" : "text-gold/25")}
        />
      ))}
    </div>
  );
}
