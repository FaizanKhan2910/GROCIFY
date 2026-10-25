import React from "react";
import { Leaf, CheckCircle2, Sparkles, Tag, AlertCircle } from "lucide-react";

export type BadgeVariant =
  | "eco"
  | "verified"
  | "new"
  | "value"
  | "alert"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  showIcon?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  eco: "bg-electric-citrus text-deep-forest font-semibold border border-deep-forest/10",
  verified: "bg-forest-subtle text-deep-forest font-medium border border-deep-forest/15",
  new: "bg-butter-yellow text-deep-forest font-semibold border border-deep-forest/10",
  value: "bg-coral-pop text-deep-forest font-semibold border border-deep-forest/10",
  alert: "bg-coral-subtle text-coral-hover font-semibold border border-coral-hover/20",
  neutral: "bg-ivory-muted text-ink-muted border border-ivory-border",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  showIcon = true,
  className = "",
  children,
  ...props
}) => {
  const icon = () => {
    if (!showIcon) return null;
    switch (variant) {
      case "eco":
        return <Leaf className="w-3 h-3 text-deep-forest" aria-hidden="true" />;
      case "verified":
        return <CheckCircle2 className="w-3 h-3 text-deep-forest" aria-hidden="true" />;
      case "new":
        return <Sparkles className="w-3 h-3 text-deep-forest" aria-hidden="true" />;
      case "value":
        return <Tag className="w-3 h-3 text-deep-forest" aria-hidden="true" />;
      case "alert":
        return <AlertCircle className="w-3 h-3 text-coral-hover" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1 rounded-xs"
      : "text-xs px-2.5 py-1 gap-1.5 rounded-sm";

  return (
    <span
      className={`inline-flex items-center tracking-tight leading-none uppercase font-mono ${variantStyles[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon()}
      <span>{children}</span>
    </span>
  );
};
