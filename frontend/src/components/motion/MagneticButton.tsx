"use client";

/**
 * ============================================================================
 * GROCIFY MAGNETIC BUTTON WRAPPER
 * ============================================================================
 * Magnetically pulls the button toward the cursor when within interactive proximity.
 * Disabled automatically on touch devices and when prefers-reduced-motion is active.
 *
 * TUNABLE PARAMETERS:
 * - MAGNETIC_RADIUS: 80 (Pixel proximity threshold to engage magnetic pull)
 * - MAX_PULL_PX: 14 (Maximum distance the button translates)
 * - SPRING_STIFFNESS: 160 (Physics spring stiffness)
 * - SPRING_DAMPING: 15 (Physics damping for subtle organic settle)
 * - SPRING_MASS: 0.12 (Snappy responsiveness)
 * ============================================================================
 */

import React, { useRef, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const MAGNETIC_TUNABLES = {
  magneticRadius: 80,
  maxPullPx: 14,
  spring: {
    stiffness: 160,
    damping: 15,
    mass: 0.12,
  },
} as const;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const subscribePointer = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getPointerSnapshot = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

export function MagneticButton({
  children,
  className = "",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useSyncExternalStore(
    subscribePointer,
    getPointerSnapshot,
    () => false
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, MAGNETIC_TUNABLES.spring);
  const smoothY = useSpring(y, MAGNETIC_TUNABLES.spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < MAGNETIC_TUNABLES.magneticRadius) {
      // Calculate pull ratio with non-linear falloff
      const ratio = 1 - distance / MAGNETIC_TUNABLES.magneticRadius;
      const pullX = (distanceX / distance) * ratio * MAGNETIC_TUNABLES.maxPullPx;
      const pullY = (distanceY / distance) * ratio * MAGNETIC_TUNABLES.maxPullPx;
      x.set(pullX);
      y.set(pullY);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
