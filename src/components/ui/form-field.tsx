import { cn } from "@/lib/cn";

export function FormField({
  label,
  children,
  className,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
    </div>
  );
}

export function FormSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-form border border-border bg-brand/[0.03] p-4 sm:p-5",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-brand">{title}</h2>
      {children}
    </section>
  );
}
