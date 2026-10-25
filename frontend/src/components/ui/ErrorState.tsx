import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 rounded-lg bg-coral-subtle/40 border border-coral-pop/30 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-coral-subtle flex items-center justify-center text-coral-hover mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-bold text-soft-ink mb-1">
        {title}
      </h3>
      <p className="text-sm text-ink-muted max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
