"use client";

/**
 * ============================================================================
 * GROCIFY WISHLIST HEART & PARTICLE BURST
 * ============================================================================
 * Interactive heart toggle with:
 * - Scale pop (1.0 -> 1.32 -> 0.92 -> 1.0)
 * - Radial particle burst (6 micro flecks in coral/lime radiating outward)
 * - Smooth fill morph
 *
 * TUNABLE PARAMETERS:
 * - POP_DURATION: 0.4s (Heart elastic bounce time)
 * - BURST_DISTANCE_PX: 16 (Distance particles travel outward)
 * - BURST_DURATION: 0.5s (Particle fade duration)
 * ============================================================================
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export const WISHLIST_TUNABLES = {
  popDuration: 0.4,
  burstDistancePx: 16,
  burstDuration: 0.5,
  particleColors: ["#F0A7A0", "#C8E66B", "#F5CF63", "#F0A7A0", "#C8E66B", "#F5CF63"],
} as const;

interface WishlistBurstProps {
  isWishlisted: boolean;
  onToggle: () => void;
  title: string;
  className?: string;
}

export function WishlistBurst({
  isWishlisted,
  onToggle,
  title,
  className = "",
}: WishlistBurstProps) {
  const [burstKey, setBurstKey] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isWishlisted) {
      setBurstKey(Date.now());
    }
    onToggle();
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
        animate={isWishlisted ? { scale: [1, 1.28, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: WISHLIST_TUNABLES.popDuration, ease: [0.22, 1, 0.36, 1], type: "tween" }}
        aria-label={isWishlisted ? `Remove ${title} from saved items` : `Save ${title} to wishlist`}
        className={`relative z-10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
          isWishlisted
            ? "bg-coral-pop text-deep-forest shadow-subtle"
            : "bg-warm-ivory/90 backdrop-blur-xs text-soft-ink hover:text-deep-forest hover:bg-warm-ivory shadow-subtle"
        } ${className}`}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-current stroke-current" : "stroke-current fill-transparent"
          }`}
          aria-hidden="true"
        />
      </motion.button>

      {/* Particle Burst on Activation */}
      <AnimatePresence>
        {burstKey && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
            {WISHLIST_TUNABLES.particleColors.map((color, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const x = Math.cos(angle) * WISHLIST_TUNABLES.burstDistancePx;
              const y = Math.sin(angle) * WISHLIST_TUNABLES.burstDistancePx;

              return (
                <motion.span
                  key={`${burstKey}-${i}`}
                  initial={{ scale: 0.5, x: 0, y: 0, opacity: 1 }}
                  animate={{ scale: 1.2, x, y, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: WISHLIST_TUNABLES.burstDuration, ease: "easeOut" }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
