"use client";

import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/motion/fade-in";

export function SearchSection() {
  return (
    <section className="border-b border-border bg-surface py-6 shadow-sm">
      <Container className="flex justify-center">
        <FadeIn className="w-full max-w-xl">
          <form action="/courses" method="get" className="relative">
            <Input name="search" placeholder="ابحث عن دورة أو برنامج..." className="h-12 pe-12" />
            <button
              type="submit"
              className="absolute end-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-brand text-white"
              aria-label="بحث"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </FadeIn>
      </Container>
    </section>
  );
}
