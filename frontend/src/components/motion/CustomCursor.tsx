"use client";

/**
 * ============================================================================
 * GROCIFY CUSTOM EDITORIAL CURSOR
 * ============================================================================
 * Apple / Awwwards-level interactive cursor:
 * - Precision center dot (6px)
 * - Spring-lag follower ring (32px)
 * - Contextual expansions:
 *   - "View" label over products
 *   - "Drag" label over horizontal categories
 *   - Shrink & magnetic focus over interactive buttons / links
 * - Disabled automatically on touch screens & prefers-reduced-motion
 *
 * TUNABLE PARAMETERS:
 * - SPRING_STIFFNESS: 450 (Ring tracking velocity)
 * - SPRING_DAMPING: 28 (Ring settling inertia)
 * - EXPANDED_SIZE: 56px (Diameter when displaying contextual text)
 * ============================================================================
 */

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const CURSOR_TUNABLES = {
  spring: {
    stiffness: 450,
    damping: 28,
    mass: 0.1,
  },
  expandedSize: 56,
  standardSize: 32,
  shrinkSize: 20,
};

type CursorVariant = "default" | "hover" | "view" | "drag";

const subscribePointer = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getPointerFineSnapshot = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(subscribePointer, getPointerFineSnapshot, () => false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [cursorVisible, setCursorVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const smoothX = useSpring(rawX, CURSOR_TUNABLES.spring);
  const smoothY = useSpring(rawY, CURSOR_TUNABLES.spring);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!cursorVisible) setCursorVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("[data-cursor='view']") || target.closest("article")) {
        setVariant("view");
      } else if (target.closest("[data-cursor='drag']") || target.closest("#categories")) {
        setVariant("drag");
      } else if (target.closest("button, a, input, select, [role='button']")) {
        setVariant("hover");
      } else {
        setVariant("default");
      }
    };

    const handleMouseLeave = () => setCursorVisible(false);
    const handleMouseEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isFinePointer, cursorVisible, rawX, rawY]);

  if (!isFinePointer || !cursorVisible) return null;

  const isExpanded = variant === "view" || variant === "drag";

  return (
    <div className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden select-none">
      {/* Precision Center Dot */}
      <motion.div
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isExpanded ? 0 : variant === "hover" ? 0 : 1,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="w-1.5 h-1.5 rounded-full bg-deep-forest"
      />

      {/* Lagged Spring Follower Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isExpanded
            ? CURSOR_TUNABLES.expandedSize
            : variant === "hover"
            ? CURSOR_TUNABLES.shrinkSize
            : CURSOR_TUNABLES.standardSize,
          height: isExpanded
            ? CURSOR_TUNABLES.expandedSize
            : variant === "hover"
            ? CURSOR_TUNABLES.shrinkSize
            : CURSOR_TUNABLES.standardSize,
          borderColor: isExpanded ? "#173D2D" : variant === "hover" ? "#C8E66B" : "#173D2D",
          backgroundColor: isExpanded
            ? "rgba(23, 61, 45, 0.92)"
            : variant === "hover"
            ? "rgba(200, 230, 107, 0.25)"
            : "rgba(247, 246, 242, 0)",
          borderWidth: isExpanded ? "0px" : "1.5px",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className="rounded-full flex items-center justify-center shadow-subtle backdrop-blur-[1px]"
      >
        <AnimatePresence>
          {variant === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-warm-ivory"
            >
              View
            </motion.span>
          )}
          {variant === "drag" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-warm-ivory"
            >
              Drag
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
