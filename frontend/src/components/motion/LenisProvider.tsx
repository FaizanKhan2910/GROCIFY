"use client";

/**
 * ============================================================================
 * GROCIFY LENIS SMOOTH SCROLL PROVIDER
 * ============================================================================
 * Integrates Lenis smooth scrolling with GSAP ScrollTrigger ticker.
 *
 * TUNABLE PARAMETERS:
 * - LERP: 0.08 (Smooth inertia, balanced between responsiveness & editorial weight)
 * - DURATION: 1.2 (Duration of wheel scroll interpolation)
 * - WHEEL_MULTIPLIER: 0.95 (Softens aggressive mouse wheels)
 * - LAG_SMOOTHING: 0 (Prevents GSAP jumps on tab switch / heavy tasks)
 * ============================================================================
 */

import React, { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const LENIS_TUNABLES = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 0.95,
  touchMultiplier: 1.0,
} as const;

interface LenisContextValue {
  lenis: Lenis | null;
  isReducedMotion: boolean;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  isReducedMotion: false,
});

export const useLenis = () => useContext(LenisContext);

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    // Register GSAP plugins safely on client
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: LENIS_TUNABLES.lerp,
      duration: LENIS_TUNABLES.duration,
      smoothWheel: LENIS_TUNABLES.smoothWheel,
      wheelMultiplier: LENIS_TUNABLES.wheelMultiplier,
      touchMultiplier: LENIS_TUNABLES.touchMultiplier,
    });

    lenisRef.current = lenis;
    // Set instance asynchronously to avoid cascading renders
    queueMicrotask(() => {
      setLenisInstance(lenis);
    });

    // Sync Lenis scroll updates with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis RAF via GSAP ticker for frame-locked synchronization
    const handleTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(handleTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(handleTicker);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [isReducedMotion]);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, isReducedMotion }}>
      {children}
    </LenisContext.Provider>
  );
}
