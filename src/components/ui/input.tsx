import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand-light focus:ring-2 focus:ring-brand/10",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand-light focus:ring-2 focus:ring-brand/10",
        className
      )}
      {...props}
    />
  );
}
