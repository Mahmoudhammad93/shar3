import { cn } from "@/lib/cn";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 lg:px-8", className)} {...props} />;
}
