"use client";

/**
 * ============================================================================
 * GROCIFY SHARED SLIDING FILTER PILL
 * ============================================================================
 * Fluid sliding pill background powered by Framer Motion layoutId.
 * Glides smoothly between category filter chips with spring physics.
 *
 * TUNABLE PARAMETERS:
 * - SPRING_STIFFNESS: 380 (Physics response speed)
 * - SPRING_DAMPING: 30 (Settling dampness without overshoot)
 * ============================================================================
 */

import React from "react";
import { motion } from "framer-motion";

export const PILL_TUNABLES = {
  spring: {
    type: "spring" as const,
    stiffness: 380,
    damping: 30,
  },
};

interface SlidingPillProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  layoutId?: string;
  className?: string;
}

export function SlidingPill({
  selected,
  onClick,
  children,
  layoutId = "category-active-pill",
  className = "",
}: SlidingPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest shrink-0 ${
        selected ? "text-warm-ivory" : "text-soft-ink hover:text-deep-forest hover:bg-ivory-muted/70"
      } ${className}`}
    >
      {/* Sliding Active Pill Background */}
      {selected && (
        <motion.span
          layoutId={layoutId}
          transition={PILL_TUNABLES.spring}
          className="absolute inset-0 bg-deep-forest rounded-full shadow-subtle -z-10"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
