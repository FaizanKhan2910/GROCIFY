"use client";

/**
 * ============================================================================
 * GROCIFY EDITORIAL SECTION HEADING
 * ============================================================================
 * Choreographs editorial section reveals:
 * 1. Micro monospace label fades and rises in.
 * 2. Big display title emerges with a clean line-mask reveal (y: 100% -> 0%).
 * 3. Subtitle / description softly dissolves in.
 *
 * TUNABLE PARAMETERS:
 * - LABEL_DURATION: 0.5s (Micro-label fade duration)
 * - TITLE_DURATION: 0.7s (Display title mask reveal duration)
 * - TITLE_DELAY: 0.1s (Delay after label before title begins rising)
 * - SUBTITLE_DELAY: 0.25s (Delay for supporting editorial description)
 * - EASE: [0.16, 1, 0.3, 1] (Apple / editorial quintic ease-out)
 * ============================================================================
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const HEADING_TUNABLES = {
  labelDuration: 0.5,
  titleDuration: 0.7,
  titleDelay: 0.1,
  subtitleDelay: 0.25,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "between";
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "between",
  action,
  className = "",
}: SectionHeadingProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`mb-8 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              {label}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-soft-ink mt-1 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-ink-muted mt-2 max-w-md leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`mb-8 ${className}`}
    >
      <div
        className={`flex flex-col ${
          align === "center"
            ? "items-center text-center"
            : "sm:flex-row sm:items-end justify-between gap-4"
        }`}
      >
        <div>
          {/* 1. Small Mono Label */}
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: HEADING_TUNABLES.labelDuration,
                  ease: HEADING_TUNABLES.ease,
                },
              },
            }}
            className="block text-xs font-mono uppercase tracking-widest text-deep-forest font-semibold"
          >
            {label}
          </motion.span>

          {/* 2. Big Title with Line-Mask Reveal */}
          <div className="overflow-hidden mt-1 pb-1">
            <motion.h2
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: {
                    duration: HEADING_TUNABLES.titleDuration,
                    delay: HEADING_TUNABLES.titleDelay,
                    ease: HEADING_TUNABLES.ease,
                  },
                },
              }}
              className="font-display text-2xl sm:text-4xl font-extrabold text-soft-ink tracking-tight"
            >
              {title}
            </motion.h2>
          </div>

          {/* 3. Subtitle Fade-in */}
          {subtitle && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: HEADING_TUNABLES.subtitleDelay,
                    ease: HEADING_TUNABLES.ease,
                  },
                },
              }}
              className="text-xs sm:text-sm text-ink-muted mt-2 max-w-md leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {action && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
            }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
