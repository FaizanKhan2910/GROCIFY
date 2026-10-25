"use client";

/**
 * ============================================================================
 * GROCIFY HERO 3D CANVAS WRAPPER & GLASS INFO CHIPS
 * ============================================================================
 * Lazy-loads the R3F 3D Canvas on desktop browsers with hardware acceleration.
 * Gracefully falls back to high-resolution editorial photography on:
 * - Mobile / touch screens (< 768px)
 * - Users with prefers-reduced-motion: reduce
 * - WebGL disabled environments
 *
 * TUNABLE PARAMETERS:
 * - CHIP_FLOAT_DELAY: 0.6s (Entrance delay for floating proof chips)
 * ============================================================================
 */

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

// Lazy load the cinematic bottle-reveal R3F Canvas without SSR
const LazyHeroScene = dynamic(
  () => import("./BottleRevealScene").then((mod) => mod.BottleRevealScene),
  {
    ssr: false,
    loading: () => <HeroFallbackLoading />,
  }
);

function HeroFallbackLoading() {
  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-xl overflow-hidden bg-ivory-muted/40 shadow-card">
      <Image
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
        alt="Studio scene poster"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover object-center opacity-60 filter blur-[2px]"
      />
      <div className="absolute inset-0 bg-warm-ivory/50 backdrop-blur-xs flex items-center justify-center">
        <div className="text-deep-forest font-mono text-xs uppercase tracking-widest flex items-center gap-2 bg-warm-ivory/90 px-3 py-1.5 rounded-full border border-ivory-border shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-electric-citrus animate-ping" />
          <span>Loading 3D Studio...</span>
        </div>
      </div>
    </div>
  );
}

function HeroStaticImage() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="absolute -inset-2 sm:-inset-4 bg-forest-subtle/70 rounded-lg -rotate-1 border border-deep-forest/10" />
      <div className="relative rounded-md overflow-hidden border border-ivory-border bg-warm-ivory shadow-card">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-muted/40">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
            alt="Mindful kitchen and home essentials on warm wood surface"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface CanvasErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends React.Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  constructor(props: CanvasErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Hero 3D Canvas error caught, falling back to static visual:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const subscribeResize = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

const getIsMobileSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

const subscribeMount = () => () => {};
const getIsMountedSnapshot = () => true;

const subscribeWebGL = () => () => {};
const getWebGLSnapshot = () => checkWebGLSupport();
const getWebGLServerSnapshot = () => true;

export function Hero3DCanvas() {
  const isMounted = useSyncExternalStore(subscribeMount, getIsMountedSnapshot, () => false);
  const isMobile = useSyncExternalStore(subscribeResize, getIsMobileSnapshot, () => false);
  const hasWebGL = useSyncExternalStore(subscribeWebGL, getWebGLSnapshot, getWebGLServerSnapshot);
  const prefersReduced = useReducedMotion();

  // Fade out proof chips when user scrolls down into fullscreen showcase
  const [chipOpacity, setChipOpacity] = React.useState(1);

  React.useEffect(() => {
    const handleScroll = () => {
      const track = document.getElementById("hero-scroll-track");
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      setChipOpacity(progress > 0.12 ? Math.max(0, 1 - (progress - 0.12) * 5) : 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) {
    return <HeroFallbackLoading />;
  }

  // Fallback for mobile, reduced motion, or unsupported WebGL
  if (isMobile || prefersReduced || !hasWebGL) {
    return <HeroStaticImage />;
  }

  return (
    <div className="relative w-full h-full">
      {/* 3D Scene Viewport */}
      <div className="relative w-full h-full rounded-xl overflow-visible">
        <CanvasErrorBoundary fallback={<HeroStaticImage />}>
          <LazyHeroScene />
        </CanvasErrorBoundary>

        {/* Floating Glass Proof Chips (Fade out when scrolling into fullscreen showcase) */}
        <div
          className="transition-opacity duration-200 pointer-events-none"
          style={{ opacity: chipOpacity }}
        >
          {/* Floating Glass Proof Chip 1 (Top Left) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-6 left-2 sm:left-4 z-10 backdrop-blur-md bg-warm-ivory/85 border border-deep-forest/15 px-3 py-2 rounded-full shadow-card flex items-center gap-2 select-none hover:border-deep-forest/30 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-electric-citrus animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-deep-forest tracking-wide">
            Zero Plastic Packaging
          </span>
        </motion.div>

        {/* Floating Glass Proof Chip 2 (Bottom Right) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-10 right-2 sm:right-6 z-10 backdrop-blur-md bg-warm-ivory/85 border border-deep-forest/15 px-3.5 py-2 rounded-full shadow-card flex items-center gap-2 select-none hover:border-deep-forest/30 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-deep-forest" />
          <span className="font-mono text-[11px] font-semibold text-deep-forest tracking-wide">
            Fair Price Guarantee: Always ≤ ₹1,000
          </span>
        </motion.div>

        {/* Floating Glass Proof Chip 3 (Top Right - Artisan Metier) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="hidden xl:flex absolute top-12 right-2 z-10 backdrop-blur-md bg-warm-ivory/85 border border-deep-forest/15 px-3 py-1.5 rounded-full shadow-subtle items-center gap-1.5 select-none"
        >
          <Sparkles className="w-3 h-3 text-electric-citrus" />
          <span className="font-mono text-[10px] text-ink-muted tracking-wider uppercase">
            Ayurvedic Copper & Seasoned Neem
          </span>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
