import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand text-white">
      <div className="flex items-center justify-center gap-1.5 px-4 py-5 text-center text-sm text-white/90">
        <span>
          © {year}{" "}
          <a
            href="https://chiefcoder.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold transition hover:text-gold-light hover:underline"
          >
            Mahmoud Hammad
          </a>
        </span>
        <span className="text-white/40">·</span>
        <span className="inline-flex items-center gap-1">
          Made by love with
          <Heart className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
        </span>
      </div>
    </footer>
  );
}
