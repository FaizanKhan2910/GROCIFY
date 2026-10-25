import React from "react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  count?: number;
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  count,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-150 inline-flex items-center gap-1.5 border select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest focus-visible:ring-offset-1 ${
        selected
          ? "bg-deep-forest text-warm-ivory border-deep-forest shadow-subtle"
          : "bg-warm-ivory text-soft-ink border-ivory-border hover:border-ink-subtle hover:bg-ivory-muted"
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            selected
              ? "bg-forest-light text-electric-citrus"
              : "bg-ivory-border text-ink-muted"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
