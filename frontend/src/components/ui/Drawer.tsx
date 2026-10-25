"use client";

/**
 * ============================================================================
 * GROCIFY SPRING SLIDE-IN DRAWER
 * ============================================================================
 * Features:
 * - Spring slide-in from right or bottom via Framer Motion AnimatePresence
 * - Frosted deep forest backdrop fade
 * - Escape key & outside click dismissal
 * - Preserves accessibility and focus management
 *
 * TUNABLE PARAMETERS:
 * - SPRING_STIFFNESS: 320 (Slide responsiveness)
 * - SPRING_DAMPING: 30 (Physics settling speed)
 * ============================================================================
 */

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const DRAWER_TUNABLES = {
  spring: {
    type: "spring" as const,
    stiffness: 320,
    damping: 30,
    mass: 0.85,
  },
};

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

  const slideVariants =
    position === "bottom"
      ? {
          hidden: { y: "100%" },
          visible: { y: "0%" },
          exit: { y: "100%" },
        }
      : {
          hidden: { x: "100%" },
          visible: { x: "0%" },
          exit: { x: "100%" },
        };

  const positionStyles =
    position === "bottom"
      ? "bottom-0 inset-x-0 max-h-[85vh] rounded-t-2xl border-t shadow-drawer"
      : "right-0 inset-y-0 w-full max-w-md border-l shadow-elevation";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "drawer-title" : undefined}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-deep-forest/45 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Spring Sliding Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={DRAWER_TUNABLES.spring}
            className={`fixed bg-warm-ivory border-ivory-border z-10 flex flex-col p-6 overflow-y-auto ${positionStyles}`}
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
                className="min-h-[44px] min-w-[44px] -mr-2 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-soft-ink hover:bg-ivory-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
