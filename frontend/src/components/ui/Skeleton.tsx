import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  className = "",
  ...props
}) => {
  const variantClass = {
    rectangular: "rounded-sm",
    circular: "rounded-full",
    text: "h-4 rounded-xs",
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-ivory-border/70 ${variantClass} ${className}`}
      {...props}
    />
  );
};
