"use client";

/**
 * ============================================================================
 * GROCIFY CART INDICATOR WITH SPRING BOUNCE & POPPING BADGE
 * ============================================================================
 * Features:
 * - Springs and bounces on receipt of flying product clones
 * - Numerically springs badge count via Framer Motion
 * - Identified via #header-cart-indicator for curved flight targeting
 *
 * TUNABLE PARAMETERS:
 * - BOUNCE_SCALE: 1.25 (Icon bounce expansion)
 * - SPRING_STIFFNESS: 320 (Badge bounce stiffness)
 * ============================================================================
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartFlight } from "../motion/CartFlightContext";

export interface CartIndicatorProps {
  itemCount: number;
  hydrated?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CartIndicator: React.FC<CartIndicatorProps> = ({
  itemCount,
  hydrated = true,
  onClick,
  className = "",
}) => {
  const { isCartBouncing } = useCartFlight();
  const displayCount = hydrated ? itemCount : 0;

  return (
    <motion.button
      id="header-cart-indicator"
      type="button"
      onClick={onClick}
      animate={isCartBouncing ? { scale: [1, 1.24, 0.9, 1] } : { scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], type: "tween" }}
      aria-label={`Shopping bag, ${displayCount} ${displayCount === 1 ? "item" : "items"}`}
      className={`relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md border border-ivory-border bg-warm-ivory text-soft-ink hover:text-deep-forest hover:border-deep-forest/30 hover:bg-ivory-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest cursor-pointer ${className}`}
    >
      <ShoppingBag className="w-5 h-5 stroke-[1.8]" />

      <AnimatePresence>
        {hydrated && displayCount > 0 && (
          <motion.span
            key={displayCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-deep-forest text-warm-ivory text-[11px] font-bold font-mono flex items-center justify-center leading-none shadow-subtle border-2 border-warm-ivory"
            aria-hidden="true"
          >
            {displayCount > 99 ? "99+" : displayCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
