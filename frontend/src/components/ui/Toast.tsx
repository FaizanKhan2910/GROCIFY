"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastVariant = "info" | "success" | "error";

export interface ToastProps {
  id?: string;
  variant?: ToastVariant;
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  variant = "success",
  message,
  isVisible,
  onDismiss,
  durationMs = 4000,
}) => {
  useEffect(() => {
    if (!isVisible || durationMs <= 0) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isVisible, durationMs, onDismiss]);

  if (!isVisible) return null;

  const icon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-deep-forest" aria-hidden="true" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-coral-hover" aria-hidden="true" />;
      default:
        return <Info className="w-4 h-4 text-deep-forest" aria-hidden="true" />;
    }
  };

  const bgStyles =
    variant === "error"
      ? "bg-coral-subtle border-coral-hover/40 text-soft-ink"
      : variant === "success"
      ? "bg-warm-ivory border-deep-forest/20 text-soft-ink shadow-elevation"
      : "bg-forest-subtle border-deep-forest/20 text-deep-forest";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-md border text-sm max-w-sm transition-all duration-200 ${bgStyles}`}
    >
      <div className="shrink-0">{icon()}</div>
      <span className="flex-1 font-medium">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notification"
        className="p-1 rounded text-ink-muted hover:text-soft-ink hover:bg-black/5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
