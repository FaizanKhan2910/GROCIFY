import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-ivory-border rounded-lg bg-warm-ivory/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-forest-subtle flex items-center justify-center text-deep-forest mb-4">
        {icon || <PackageOpen className="w-7 h-7 stroke-[1.5]" aria-hidden="true" />}
      </div>
      <h3 className="font-display text-lg font-bold text-soft-ink mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-ink-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
