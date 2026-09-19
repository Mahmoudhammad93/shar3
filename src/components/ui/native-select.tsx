import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type NativeSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const selectClass =
  "flex h-11 w-full appearance-none rounded-form border border-border bg-surface px-4 pe-10 text-sm text-foreground outline-none transition focus:border-brand-light focus:ring-2 focus:ring-brand/10";

export function NativeSelect({
  name,
  options,
  defaultValue = "",
  className,
  required = false,
}: {
  name: string;
  options: NativeSelectOption[];
  defaultValue?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <select name={name} className={selectClass} defaultValue={defaultValue} required={required}>
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
      />
    </div>
  );
}
