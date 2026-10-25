import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "accent";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-forest text-warm-ivory hover:bg-forest-dark active:bg-black shadow-subtle hover:shadow-card focus-visible:ring-2 focus-visible:ring-deep-forest focus-visible:ring-offset-2",
  secondary:
    "bg-warm-ivory text-deep-forest border border-deep-forest/20 hover:border-deep-forest hover:bg-ivory-muted active:bg-ivory-border focus-visible:ring-2 focus-visible:ring-deep-forest",
  tertiary:
    "bg-transparent text-soft-ink hover:text-deep-forest hover:bg-forest-subtle/50 active:bg-forest-subtle focus-visible:ring-2 focus-visible:ring-deep-forest",
  destructive:
    "bg-coral-pop text-deep-forest font-semibold hover:bg-coral-hover active:bg-coral-hover/90 focus-visible:ring-2 focus-visible:ring-coral-hover",
  accent:
    "bg-electric-citrus text-deep-forest font-semibold hover:bg-citrus-hover active:bg-citrus-hover/90 shadow-subtle hover:shadow-card focus-visible:ring-2 focus-visible:ring-deep-forest",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5 rounded-sm",
  md: "h-11 px-5 text-sm gap-2 rounded-md", // >= 44px touch target (44px = h-11)
  lg: "h-13 px-7 text-base gap-2.5 rounded-md", // 52px
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span className="inline-flex items-center gap-1.5">{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
