import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-soft-ink/80"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-ink-muted">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-warm-ivory text-soft-ink placeholder:text-ink-subtle border rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-deep-forest focus:border-deep-forest disabled:bg-ivory-muted disabled:cursor-not-allowed ${
              leftElement ? "pl-10" : ""
            } ${rightElement ? "pr-10" : ""} ${
              hasError
                ? "border-coral-hover focus:ring-coral-hover focus:border-coral-hover"
                : "border-ivory-border hover:border-ink-subtle"
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-ink-muted">
              {rightElement}
            </div>
          )}
        </div>
        {hasError ? (
          <p id={`${inputId}-error`} className="text-xs font-medium text-coral-hover">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-ink-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
