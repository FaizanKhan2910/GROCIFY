"use client";

/**
 * ============================================================================
 * GROCIFY SCROLL DIRECTION & STATE HOOK
 * ============================================================================
 * Smoothly tracks scroll direction ('up' | 'down') and compression states.
 *
 * TUNABLE PARAMETERS:
 * - THRESHOLD_PX: 8 (Prevents jitter from micro-scrolls)
 * - COLLAPSE_OFFSET_PX: 70 (Distance before header begins compressing & blurring)
 * ============================================================================
 */

import { useState, useEffect } from "react";

export const SCROLL_DIR_TUNABLES = {
  thresholdPx: 8,
  collapseOffsetPx: 70,
} as const;

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.pageYOffset;

      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > SCROLL_DIR_TUNABLES.collapseOffsetPx);

      if (Math.abs(currentScrollY - lastScrollY) < SCROLL_DIR_TUNABLES.thresholdPx) {
        ticking = false;
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > SCROLL_DIR_TUNABLES.collapseOffsetPx) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollDir();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrollDirection, isScrolled, scrollY };
}
