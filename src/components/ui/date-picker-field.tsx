"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ar } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";
import "react-day-picker/style.css";

type DatePickerFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  name?: string;
  className?: string;
  required?: boolean;
};

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;

  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
}

export function DatePickerField({
  value,
  onChange,
  label,
  placeholder = "تاريخ الميلاد",
  min = "1940-01-01",
  max,
  name,
  className,
  required = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = toDate(value);
  const minDate = toDate(min) ?? new Date(1940, 0, 1);
  const maxDate = toDate(max ?? new Date().toISOString().slice(0, 10)) ?? new Date();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative w-full space-y-1.5", className)}>
      {label && (
        <span className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
      )}
      {name && <input type="hidden" name={name} value={value ?? ""} />}

      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-form border border-border bg-surface px-4 text-sm outline-none transition",
          "focus:border-brand-light focus:ring-2 focus:ring-brand/10",
          selected ? "text-foreground" : "text-muted",
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <CalendarDays className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
          <span className="truncate">
            {selected ? format(selected, "d MMMM yyyy", { locale: ar }) : placeholder}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1">
          {selected && (
            <span
              role="button"
              tabIndex={0}
              aria-label="مسح تاريخ الميلاد"
              className="rounded-form p-1 text-muted transition hover:bg-brand/5 hover:text-brand"
              onClick={(event) => {
                event.stopPropagation();
                onChange("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange("");
                }
              }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          role="dialog"
          aria-label="اختيار تاريخ الميلاد"
          className="share3a-date-picker-popover absolute z-50 mt-2 w-full min-w-[320px] rounded-form border border-border bg-surface p-3 shadow-xl sm:w-auto"
        >
          <DayPicker
            mode="single"
            dir="rtl"
            locale={ar}
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={minDate}
            endMonth={maxDate}
            disabled={{
              before: minDate,
              after: maxDate,
            }}
            defaultMonth={selected ?? maxDate}
          />
        </div>
      )}
    </div>
  );
}
