"use client";

import PhoneInput, { type Value } from "react-phone-number-input";
import ar from "react-phone-number-input/locale/ar.json";
import { cn } from "@/lib/cn";
import "react-phone-number-input/style.css";

type PhoneFieldProps = {
  value?: Value;
  onChange: (value: Value) => void;
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  className?: string;
  defaultCountry?: "EG" | "SA" | "AE" | "US" | "GB";
};

export function PhoneField({
  value,
  onChange,
  label,
  placeholder,
  name,
  required = false,
  className,
  defaultCountry = "EG",
}: PhoneFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <span className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
      )}
      <div className="share3a-phone-field" dir="ltr">
        <PhoneInput
          name={name}
          international
          defaultCountry={defaultCountry}
          countryCallingCodeEditable={false}
          labels={ar}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="share3a-phone-input"
        />
      </div>
    </div>
  );
}
