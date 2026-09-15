"use client";

import Select, { type GroupBase, type StylesConfig } from "react-select";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  options: SelectOption[];
  value?: string | null;
  onChange: (value: string | undefined) => void;
  label?: string;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
};

const selectStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.75rem",
    borderRadius: "var(--form-radius)",
    borderColor: state.isFocused ? "var(--brand-primary-light)" : "var(--brand-border)",
    boxShadow: state.isFocused ? "0 0 0 2px color-mix(in srgb, var(--brand-primary) 10%, transparent)" : "none",
    backgroundColor: "var(--brand-surface)",
    "&:hover": {
      borderColor: state.isFocused ? "var(--brand-primary-light)" : "var(--brand-border)",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--brand-muted)",
    fontSize: "0.875rem",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: "0.875rem",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "var(--form-radius)",
    overflow: "hidden",
    border: "1px solid var(--brand-border)",
    boxShadow: "0 12px 40px -8px color-mix(in srgb, var(--brand-primary) 15%, transparent)",
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "240px",
    padding: "0.25rem",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem",
    borderRadius: "calc(var(--form-radius) - 2px)",
    backgroundColor: state.isSelected
      ? "var(--brand-primary)"
      : state.isFocused
        ? "color-mix(in srgb, var(--brand-primary) 8%, transparent)"
        : "transparent",
    color: state.isSelected ? "#fff" : "var(--foreground)",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--brand-muted)",
    paddingInlineEnd: "0.75rem",
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--brand-muted)",
  }),
};

export function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder,
  isClearable = true,
  isDisabled = false,
  className,
  name,
  required = false,
}: SearchableSelectProps) {
  const selected = options.find((option) => option.value === value) ?? null;

  const select = (
    <Select
      instanceId={name}
      name={name}
      options={options}
      value={selected}
      onChange={(option) => onChange(option?.value)}
      placeholder={placeholder}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isSearchable
      required={required}
      noOptionsMessage={() => "لا توجد نتائج"}
      loadingMessage={() => "جاري التحميل..."}
      styles={selectStyles}
      classNamePrefix="share3a-select"
    />
  );

  if (!label) {
    return <div className={cn("w-full", className)}>{select}</div>;
  }

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <span className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {select}
    </div>
  );
}
