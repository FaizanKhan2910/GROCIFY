"use client";

/**
 * ============================================================================
 * GROCIFY EDITORIAL PRELOADER
 * ============================================================================
 * Features:
 * - Logo "G" leaf mark draws itself via SVG stroke-dashoffset (pathLength: 0 -> 1)
 * - Fills with deep forest green (#173D2D) and electric citrus accent
 * - Screen wipes up via clip-path: inset(0 0 100% 0) to reveal the hero
 * - Duration: <= 1.5s, skippable via click or ESC, shown once per session
 * - Disabled automatically on prefers-reduced-motion
 *
 * TUNABLE PARAMETERS:
 * - DRAW_DURATION: 0.7s (SVG stroke path drawing)
 * - FILL_DURATION: 0.35s (Color fill transition)
 * - WIPE_DURATION: 0.55s (Curtain wipe-up reveal)
 * - TOTAL_LIFETIME: 1.5s (Automatic dismissal timeout)
 * ============================================================================
 */

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const PRELOADER_TUNABLES = {
  drawDuration: 0.7,
  fillDuration: 0.35,
  wipeDuration: 0.55,
  totalLifetimeMs: 1450,
  ease: [0.16, 1, 0.3, 1] as const,
};

const SESSION_KEY = "grocify_preloader_seen_v1";

const getHasSeenSnapshot = () => {
  if (typeof window === "undefined") return true;
  return (
    Boolean(sessionStorage.getItem(SESSION_KEY)) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

export function Preloader() {
  const alreadySeen = useSyncExternalStore(
    () => () => {},
    getHasSeenSnapshot,
    () => true
  );

  const [isVisible, setIsVisible] = useState(true);

  const dismissPreloader = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, []);

  useEffect(() => {
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      dismissPreloader();
    }, PRELOADER_TUNABLES.totalLifetimeMs);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissPreloader();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [alreadySeen, dismissPreloader]);

  if (alreadySeen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onClick={dismissPreloader}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: PRELOADER_TUNABLES.wipeDuration, ease: PRELOADER_TUNABLES.ease },
          }}
          className="fixed inset-0 z-[99999] bg-warm-ivory flex flex-col items-center justify-center cursor-pointer select-none"
          aria-label="Loading Grocify, click to skip"
        >
          {/* Central Logo Leaf Mark */}
          <div className="relative flex flex-col items-center">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 sm:w-20 sm:h-20"
            >
              {/* Outer Geometric Leaf Boundary */}
              <motion.path
                d="M50 10 C72 10 90 28 90 50 C90 72 72 90 50 90 C28 90 10 72 10 50 C10 28 28 10 50 10 Z"
                stroke="#173D2D"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: PRELOADER_TUNABLES.drawDuration,
                  ease: "easeInOut",
                }}
              />

              {/* Stylized Leaf Spine & Organic G Curve */}
              <motion.path
                d="M50 20 C66 20 78 33 78 50 C78 66 66 78 50 78 C38 78 30 70 30 58 C30 46 40 38 52 38 L68 38"
                stroke="#173D2D"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: PRELOADER_TUNABLES.drawDuration,
                  delay: 0.15,
                  ease: "easeInOut",
                }}
              />

              {/* Center Citrus Bud Accent */}
              <motion.circle
                cx="68"
                cy="38"
                r="4.5"
                fill="#C8E66B"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: PRELOADER_TUNABLES.drawDuration - 0.1, duration: 0.25 }}
              />
            </svg>

            {/* Wordmark Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-4 flex flex-col items-center"
            >
              <span className="font-display font-extrabold text-xl tracking-tight text-deep-forest">
                GROCIFY
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mt-0.5">
                Thoughtfully Chosen
              </span>
            </motion.div>
          </div>

          {/* Minimal Skip Micro-Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="absolute bottom-8 font-mono text-[10px] uppercase tracking-widest text-ink-muted"
          >
            Click or press ESC to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
