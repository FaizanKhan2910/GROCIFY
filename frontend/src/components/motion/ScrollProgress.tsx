"use client";

/**
 * ============================================================================
 * GROCIFY THIN LIME SCROLL PROGRESS BAR
 * ============================================================================
 * Renders an organic lime progress bar underneath the header reflecting total page scroll.
 *
 * TUNABLE PARAMETERS:
 * - STIFFNESS: 100 (Spring response speed)
 * - DAMPING: 30 (Smooth settling without bounce)
 * - REST_DELTA: 0.001 (Precision threshold)
 * - BAR_HEIGHT_PX: 2.5 (Subtle, non-distracting hairline)
 * ============================================================================
 */

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const PROGRESS_TUNABLES = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
  barHeight: 2.5,
  color: "#C8E66B", // Electric citrus / lime
} as const;

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className = "" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: PROGRESS_TUNABLES.stiffness,
    damping: PROGRESS_TUNABLES.damping,
    restDelta: PROGRESS_TUNABLES.restDelta,
  });

  return (
    <div
      className={`w-full overflow-hidden pointer-events-none ${className}`}
      style={{ height: `${PROGRESS_TUNABLES.barHeight}px` }}
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-full origin-left bg-electric-citrus shadow-[0_0_8px_rgba(200,230,107,0.5)]"
        style={{ scaleX }}
      />
    </div>
  );
}
