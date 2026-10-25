import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, id, className = "", checked, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-start gap-3 cursor-pointer select-none group min-h-[44px] py-1.5 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded border border-ivory-border bg-warm-ivory transition-colors peer-checked:bg-deep-forest peer-checked:border-deep-forest peer-focus-visible:ring-2 peer-focus-visible:ring-deep-forest peer-focus-visible:ring-offset-2 group-hover:border-deep-forest flex items-center justify-center">
            <Check
              className="w-3.5 h-3.5 text-warm-ivory opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-soft-ink leading-tight">
            {label}
          </span>
          {description && (
            <span className="text-xs text-ink-muted leading-normal mt-0.5">
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
