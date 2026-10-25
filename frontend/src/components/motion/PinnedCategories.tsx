"use client";

/**
 * ============================================================================
 * GROCIFY PINNED HORIZONTAL CATEGORIES
 * ============================================================================
 * Pinned horizontal category track powered by GSAP ScrollTrigger.
 * As user scrolls, the section pins and the 4 category cards travel horizontally.
 * Each card features:
 * - Image parallax inside a clip-path mask (scale 1.15 -> 1.0, +/-8% parallax)
 * - Accent color bar that grows in from left to right (scaleX: 0 -> 1)
 * - Micro-label, item count, and direct category link
 *
 * TUNABLE PARAMETERS:
 * - SCRUB_DAMPING: 1 (GSAP ScrollTrigger scrub inertia)
 * - PARALLAX_PERCENT: 8 (Image translation within mask)
 * - PIN_SCROLL_DISTANCE: 1400px (Total scroll distance while pinned)
 * - CARD_WIDTH_PX: 400px (Desktop card width in horizontal track)
 * ============================================================================
 */

import React, { useRef, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES, CategoryData } from "@/lib/catalog";
import { SectionHeading } from "./SectionHeading";

export const PINNED_TUNABLES = {
  scrubDamping: 1,
  parallaxPercent: 8,
  pinScrollDistance: 1300,
  cardWidthPx: 390,
} as const;

interface PinnedCategoriesProps {
  onSelectCategory?: (slug: string) => void;
}

const subscribePointer = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

const getIsDesktopSnapshot = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth >= 1024 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

export function PinnedCategories({ onSelectCategory }: PinnedCategoriesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useSyncExternalStore(
    subscribePointer,
    getIsDesktopSnapshot,
    () => false
  );

  useEffect(() => {
    if (!isDesktop || !containerRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const scrollDistance = track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
      // 1. Horizontal Scroll Scrub
      gsap.to(track, {
        x: () => -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: PINNED_TUNABLES.scrubDamping,
          start: "top top",
          end: () => `+=${PINNED_TUNABLES.pinScrollDistance}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // 2. Accent Color Bars Growing In
      const colorBars = track.querySelectorAll(".category-accent-bar");
      colorBars.forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              containerAnimation: gsap.getTweensOf(track)[0],
              start: "left 85%",
              end: "left 50%",
              scrub: true,
            },
          }
        );
      });

      // 3. Image Parallax inside Clip-Path
      const images = track.querySelectorAll(".category-parallax-image");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { x: "-8%", scale: 1.14 },
          {
            x: "8%",
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: gsap.getTweensOf(track)[0],
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section
      id="categories"
      ref={containerRef}
      className={`relative border-b border-ivory-border bg-warm-ivory overflow-hidden ${
        isDesktop ? "h-screen flex flex-col justify-center" : "py-14 sm:py-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-6">
        <SectionHeading
          label="Curated Catalogues"
          title="Shop by daily ritual"
          subtitle="Practical, durable everyday tools categorized by domestic routine. Zero novelty junk."
          action={
            <Link
              href="/category"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-deep-forest hover:text-forest-light transition-colors group"
            >
              <span>Explore full directory</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
      </div>

      {/* Desktop Pinned Horizontal Track */}
      {isDesktop ? (
        <div className="w-full overflow-hidden pl-4 sm:pl-6 lg:pl-16">
          <div
            ref={trackRef}
            className="flex items-center gap-8 will-change-transform"
            style={{ width: "max-content" }}
          >
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={idx}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Mobile & Tablet Responsive Flow */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={idx}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  onSelectCategory?: (slug: string) => void;
}

function CategoryCard({ category, index, onSelectCategory }: CategoryCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(category.slug);
    }
  };

  return (
    <Link
      href={`/category/${category.slug}`}
      onClick={handleClick}
      className="group block relative w-full lg:w-[390px] shrink-0 rounded-xl overflow-hidden border border-ivory-border bg-warm-ivory shadow-card hover:shadow-card-hover transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
    >
      {/* 1. Image Container with Clip-Path & Parallax */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-muted/60">
        <Image
          src={category.imageUrl}
          alt={category.title}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="category-parallax-image object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 via-transparent to-transparent pointer-events-none" />

        {/* Category Index & Item Count Chip */}
        <div className="absolute top-3.5 left-3.5 z-10 backdrop-blur-md bg-warm-ivory/90 border border-ivory-border px-2.5 py-1 rounded-sm shadow-subtle flex items-center gap-2">
          <span className="font-mono text-[10px] text-ink-muted">
            0{index + 1}
          </span>
          <span className="w-1 h-1 rounded-full bg-deep-forest" />
          <span className="font-mono text-[10px] font-semibold text-deep-forest">
            {category.itemCount} items
          </span>
        </div>
      </div>

      {/* 2. Dynamic Growing Accent Color Bar */}
      <div
        className="category-accent-bar h-[3.5px] w-full origin-left"
        style={{
          backgroundColor: category.accentColor,
          transform: "scaleX(1)", // Fallback if JS animation is inactive
        }}
      />

      {/* 3. Editorial Metadata & Direct Action */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-xl font-bold text-soft-ink tracking-tight group-hover:text-deep-forest transition-colors">
              {category.title}
            </h3>
            <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-deep-forest group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mt-1">
            {category.tagline}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-ivory-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span>Verifiable Indian Sourcing</span>
          <span className="text-deep-forest font-semibold flex items-center gap-1 group-hover:underline">
            <Sparkles className="w-3 h-3 text-electric-citrus" />
            <span>Discover</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
