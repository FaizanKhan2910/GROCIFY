import React from "react";
import { Minus, Plus } from "lucide-react";

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 10,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  ariaLabel = "Quantity selector",
}) => {
  const isMin = value <= min;
  const isMax = value >= max;

  const handleDecrement = () => {
    if (!isMin && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (!isMax && !disabled) {
      onChange(value + 1);
    }
  };

  const buttonSize = size === "sm" ? "w-8 h-8" : "w-11 h-11";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center border border-ivory-border bg-warm-ivory rounded-md overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMin || disabled}
        aria-label="Decrease quantity"
        className={`${buttonSize} flex items-center justify-center text-soft-ink hover:bg-ivory-muted active:bg-ivory-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span
        aria-live="polite"
        className="min-w-[2.5rem] px-2 text-center text-sm font-semibold text-soft-ink select-none"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMax || disabled}
        aria-label="Increase quantity"
        className={`${buttonSize} flex items-center justify-center text-soft-ink hover:bg-ivory-muted active:bg-ivory-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
