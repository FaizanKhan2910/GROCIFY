"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "bottom" | "right";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "bottom",
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const positionStyles =
    position === "bottom"
      ? "bottom-0 inset-x-0 max-h-[85vh] rounded-t-xl border-t shadow-drawer"
      : "right-0 inset-y-0 w-full max-w-md border-l shadow-elevation";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="fixed inset-0 bg-deep-forest/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed bg-warm-ivory border-ivory-border z-10 flex flex-col p-6 overflow-y-auto ${positionStyles} transition-transform duration-200`}
      >
        {position === "bottom" && (
          <div className="w-12 h-1.5 bg-ivory-border rounded-full mx-auto mb-4 shrink-0" />
        )}

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory-border shrink-0">
          {title && (
            <h2 id="drawer-title" className="font-display text-lg font-bold text-soft-ink">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="min-h-[44px] min-w-[44px] -mr-2 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-soft-ink hover:bg-ivory-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
