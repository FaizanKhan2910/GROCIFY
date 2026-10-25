"use client";

/**
 * ============================================================================
 * GROCIFY EDITORIAL SPLIT HEADLINE
 * ============================================================================
 * Splits headline into masked rising words with an editorial skew-to-straight
 * settle on the italic signature phrase.
 *
 * TUNABLE PARAMETERS:
 * - WORD_DURATION: 0.75s (Rise duration per word)
 * - STAGGER_STEP: 0.055s (Delay between consecutive words)
 * - ITALIC_DELAY: 0.35s (Delay before the signature italic phrase reveals)
 * - SKEW_FROM: -7deg (Initial skew for dynamic calligraphic settle)
 * - EASING: [0.16, 1, 0.3, 1] (Editorial quintic-out curve)
 * ============================================================================
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export const HEADLINE_TUNABLES = {
  wordDuration: 0.75,
  staggerStep: 0.055,
  italicDelay: 0.35,
  skewFrom: -7,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface SplitHeadlineProps {
  primaryText?: string;
  italicText?: string;
  className?: string;
}

export function SplitHeadline({
  primaryText = "Better everyday.",
  italicText = "Thoughtfully chosen.",
  className = "",
}: SplitHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();

  const words = primaryText.split(" ");

  if (shouldReduceMotion) {
    return (
      <h1 className={`font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-soft-ink tracking-tight leading-[1.06] mb-6 ${className}`}>
        {primaryText}
        <br />
        <span className="text-deep-forest italic font-normal">
          {italicText}
        </span>
      </h1>
    );
  }

  return (
    <h1 className={`font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-soft-ink tracking-tight leading-[1.06] mb-6 ${className}`}>
      {/* Primary Headline Words */}
      <span className="block overflow-hidden pb-1">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
            <motion.span
              className="inline-block"
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: HEADLINE_TUNABLES.wordDuration,
                delay: i * HEADLINE_TUNABLES.staggerStep,
                ease: HEADLINE_TUNABLES.ease,
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>

      {/* Signature Italic Subhead with Skew-to-Straight Settle */}
      <span className="block overflow-hidden pt-1">
        <motion.span
          className="inline-block text-deep-forest italic font-normal origin-bottom-left"
          initial={{
            y: "120%",
            opacity: 0,
            skewX: HEADLINE_TUNABLES.skewFrom,
          }}
          animate={{
            y: "0%",
            opacity: 1,
            skewX: 0,
          }}
          transition={{
            duration: HEADLINE_TUNABLES.wordDuration + 0.15,
            delay: HEADLINE_TUNABLES.italicDelay,
            ease: HEADLINE_TUNABLES.ease,
          }}
        >
          {italicText}
        </motion.span>
      </span>
    </h1>
  );
}
