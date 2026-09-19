import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-muted/10 text-muted",
      gold: "bg-gold/15 text-brand-dark",
      solidGold: "bg-gold font-bold text-[#0a3d34] shadow-lg shadow-black/25 ring-2 ring-white/40",
      green: "bg-brand/10 text-brand",
      outline: "border border-brand/20 text-brand",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
