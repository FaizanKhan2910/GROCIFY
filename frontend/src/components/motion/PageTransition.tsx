"use client";

/**
 * ============================================================================
 * GROCIFY ROUTE TRANSITION WIPE
 * ============================================================================
 * Deep forest green (#173D2D) curtain clip-path wipe triggered between route changes.
 *
 * TUNABLE PARAMETERS:
 * - WIPE_DURATION: 0.45s (Curtain entrance and exit duration)
 * - EASE: [0.16, 1, 0.3, 1] (Editorial quintic-out curve)
 * ============================================================================
 */

import React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const TRANSITION_TUNABLES = {
  wipeDuration: 0.42,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0.98 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Forest Green Route Curtain Wipe */}
      <motion.div
        key={`curtain-${pathname}`}
        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        animate={{
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          transition: {
            duration: TRANSITION_TUNABLES.wipeDuration,
            ease: TRANSITION_TUNABLES.ease,
          },
        }}
        className="pointer-events-none fixed inset-0 z-[99990] bg-deep-forest"
      />
    </div>
  );
}
