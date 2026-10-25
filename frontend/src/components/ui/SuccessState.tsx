import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

export interface SuccessStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center text-center p-8 rounded-lg bg-citrus-muted/30 border border-deep-forest/15 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-electric-citrus flex items-center justify-center text-deep-forest mb-3">
        <CheckCircle2 className="w-6 h-6 stroke-[2]" aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-bold text-soft-ink mb-1">
        {title}
      </h3>
      <p className="text-sm text-ink-muted max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
