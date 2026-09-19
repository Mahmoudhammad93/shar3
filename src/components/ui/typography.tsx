import { cn } from "@/lib/cn";

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("mb-2 text-sm font-semibold tracking-wide text-gold", className)} {...props} />
  );
}

export function SectionHeading({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-3xl font-bold text-brand-dark md:text-4xl", className)}
      {...props}
    />
  );
}

export function SectionDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("mt-3 text-base leading-7 text-muted", className)} {...props} />
  );
}

export function PageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className={cn("text-4xl font-bold text-white md:text-5xl", className)} {...props} />
  );
}
