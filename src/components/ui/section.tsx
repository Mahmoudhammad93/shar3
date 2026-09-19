import { cn } from "@/lib/cn";
import { Container } from "./container";
import { Eyebrow, SectionDescription, SectionHeading } from "./typography";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-16 md:py-20", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <Container
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <SectionHeading>{title}</SectionHeading>
      {description && <SectionDescription>{description}</SectionDescription>}
    </Container>
  );
}
