"use client";

/**
 * ============================================================================
 * GROCIFY 3D CARD TILT & SPECULAR GLARE
 * ============================================================================
 * Apple product card feel with 3D tilt (±8 deg) and moving specular glare highlight.
 * Driven by Framer Motion useMotionValue and physics-based useSpring.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 *
 * TUNABLE PARAMETERS:
 * - MAX_TILT_DEG: 8 (Maximum rotational angle in degrees)
 * - SPRING_STIFFNESS: 220 (Spring response speed)
 * - SPRING_DAMPING: 22 (Spring settling speed without oscillation)
 * - PERSPECTIVE_PX: 1000 (3D scene perspective depth)
 * - GLARE_OPACITY: 0.28 (Maximum specular highlight intensity)
 * ============================================================================
 */

import React, { useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const TILT_TUNABLES = {
  maxTiltDeg: 8,
  perspectivePx: 1000,
  glareOpacity: 0.28,
  spring: {
    stiffness: 220,
    damping: 22,
    mass: 0.1,
  },
} as const;

interface CardTiltProps {
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

export function CardTilt({
  children,
  className = "",
  onClick,
  disabled = false,
}: CardTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canTilt = useSyncExternalStore(subscribePointer, getPointerSnapshot, () => false);

  const [glareState, setGlareState] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, TILT_TUNABLES.spring);
  const rotateY = useSpring(mouseX, TILT_TUNABLES.spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    mouseX.set(normalizedX * TILT_TUNABLES.maxTiltDeg);
    mouseY.set(-normalizedY * TILT_TUNABLES.maxTiltDeg);

    setGlareState({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: TILT_TUNABLES.glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setGlareState((prev) => ({ ...prev, opacity: 0 }));
  };

  if (!canTilt || disabled) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: TILT_TUNABLES.perspectivePx,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Specular Glare Highlight Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-md transition-opacity duration-300"
        style={{
          opacity: glareState.opacity,
          background: `radial-gradient(circle at ${glareState.x}% ${glareState.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
