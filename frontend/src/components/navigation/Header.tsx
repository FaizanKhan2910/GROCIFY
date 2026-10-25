"use client";

/**
 * ============================================================================
 * GROCIFY EDITORIAL HEADER
 * ============================================================================
 * Features:
 * - Dynamic scroll behavior: Compresses, blurs, and hides on scroll-down,
 *   smoothly slides back in on scroll-up.
 * - Continuous infinite marquee announcement bar that pauses on hover.
 * - Precision lime scroll progress bar anchored to the bottom edge.
 *
 * TUNABLE PARAMETERS:
 * - TRANSITION_DURATION: 300ms (Header slide & compression transition)
 * - BLUR_AMOUNT: backdrop-blur-xl (Glassmorphism density)
 * - COMPRESSION_HEIGHT: h-14 sm:h-16 (Compressed height when scrolled)
 * - EXPANDED_HEIGHT: h-16 sm:h-20 (Full editorial height at top)
 * ============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Leaf, Heart } from "lucide-react";
import { CartIndicator } from "./CartIndicator";
import { Drawer } from "../ui/Drawer";
import { SearchInput } from "../ui/SearchInput";
import { useCart } from "@/context/CartContext";
import { useScrollDirection } from "../motion/useScrollDirection";
import { ScrollProgress } from "../motion/ScrollProgress";

export interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenCategory?: (categorySlug: string) => void;
  className?: string;
}

const NAV_LINKS = [
  { label: "All Collections", slug: "all", href: "/category" },
  { label: "Kitchen & Pantry", slug: "kitchen", href: "/category/kitchen" },
  { label: "Personal Care", slug: "personal-care", href: "/category/personal-care" },
  { label: "Home & Clean", slug: "home-clean", href: "/category/home-clean" },
  { label: "Reusables & Travel", slug: "reusables", href: "/category/reusables" },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  searchQuery = "",
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenCategory,
  className = "",
}) => {
  const router = useRouter();
  const cartContext = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollDirection, isScrolled } = useScrollDirection();

  const effectiveCartCount = cartCount !== undefined ? cartCount : cartContext.cartCount;
  const effectiveWishlistCount =
    wishlistCount !== undefined ? wishlistCount : cartContext.wishlist.length;
  const effectiveOnOpenCart = onOpenCart || (() => cartContext.setIsCartOpen(true));
  const effectiveOnOpenWishlist =
    onOpenWishlist || (() => cartContext.setIsWishlistOpen(true));
  const { hydrated } = cartContext;

  const handleNavClick = (slug: string, href: string) => {
    setMobileMenuOpen(false);
    if (onOpenCategory) {
      onOpenCategory(slug);
    } else {
      router.push(href);
    }
  };

  // Header hide/show translation classes
  const isHidden = scrollDirection === "down" && isScrolled;
  const transformClass = isHidden ? "-translate-y-full" : "translate-y-0";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-transform duration-300 ease-in-out ${transformClass} ${className}`}
    >
      {/* Infinite Marquee Announcement Strip */}
      <div className="bg-deep-forest text-warm-ivory text-[11px] sm:text-xs py-1.5 overflow-hidden whitespace-nowrap font-medium tracking-wide border-b border-forest-dark/40 select-none">
        <div className="animate-marquee flex items-center gap-8 cursor-default">
          {[1, 2, 3].map((cycle) => (
            <div key={cycle} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-citrus animate-pulse" />
                <span>Complimentary delivery on orders ₹499+ across India</span>
              </span>
              <span className="text-electric-citrus/60 font-mono text-[10px]">•</span>
              <span>Strict ₹1,000 max price guarantee</span>
              <span className="text-electric-citrus/60 font-mono text-[10px]">•</span>
              <span>Plastic-free shipping & verifiable provenance</span>
              <span className="text-electric-citrus/60 font-mono text-[10px]">•</span>
              <span>Thoughtfully chosen everyday essentials</span>
              <span className="text-electric-citrus/60 font-mono text-[10px]">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ease-in-out border-b ${
          isScrolled
            ? "bg-warm-ivory/85 backdrop-blur-xl border-deep-forest/10 shadow-card"
            : "bg-warm-ivory/95 backdrop-blur-md border-ivory-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ease-in-out ${
              isScrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
            }`}
          >
            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="lg:hidden min-h-[44px] min-w-[44px] -ml-2 inline-flex items-center justify-center rounded-md text-soft-ink hover:bg-ivory-muted cursor-pointer transition-colors"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Brand Wordmark & Identity */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest rounded-sm"
              >
                <div className="w-8 h-8 rounded-sm bg-deep-forest text-electric-citrus flex items-center justify-center font-display font-extrabold text-lg shadow-subtle group-hover:bg-forest-light transition-all duration-200 group-hover:scale-105">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-xl sm:text-2xl text-deep-forest tracking-tight leading-none group-hover:text-forest-light transition-colors">
                    GROCIFY
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-ink-muted leading-tight mt-0.5">
                    Mindful Essentials
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <SearchInput
                placeholder="Search essentials"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onClear={() => onSearchChange?.("")}
              />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-soft-ink">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.slug}
                  type="button"
                  onClick={() => handleNavClick(link.slug, link.href)}
                  className="hover:text-deep-forest transition-colors py-2 relative after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-deep-forest after:scale-x-0 hover:after:scale-x-100 after:transition-transform cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Actions: Verified Pledge, Saved, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/category"
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-deep-forest bg-forest-subtle px-3 py-2 rounded-sm border border-deep-forest/15 hover:bg-forest-subtle/80 transition-colors"
              >
                <Leaf className="w-3.5 h-3.5 text-deep-forest" aria-hidden="true" />
                <span>Catalog Browser</span>
              </Link>

              {/* Desktop Wishlist Button */}
              <button
                type="button"
                onClick={effectiveOnOpenWishlist}
                aria-label={`Saved items, ${effectiveWishlistCount} items`}
                className="hidden sm:inline-flex relative min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-ivory-border bg-warm-ivory text-soft-ink hover:text-deep-forest hover:border-deep-forest/30 hover:bg-ivory-muted transition-colors cursor-pointer"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
                {hydrated && effectiveWishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral-pop text-deep-forest text-[10px] font-bold font-mono flex items-center justify-center leading-none border-2 border-warm-ivory">
                    {effectiveWishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Bag Indicator */}
              <CartIndicator
                itemCount={effectiveCartCount}
                hydrated={hydrated}
                onClick={effectiveOnOpenCart}
              />
            </div>
          </div>
        </div>

        {/* Thin Lime Scroll Progress Bar Underneath Header */}
        <ScrollProgress className="absolute bottom-0 left-0 right-0" />
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="GROCIFY Directory"
        position="bottom"
      >
        <div className="flex flex-col gap-5 py-2">
          <div>
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Find Mindful Essentials
            </label>
            <SearchInput
              placeholder="Search essentials"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onClear={() => onSearchChange?.("")}
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-3">
              Shop Categories
            </span>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.slug}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.slug, link.href)}
                    className="w-full text-left min-h-[44px] flex items-center justify-between px-3 rounded-md text-sm font-medium text-soft-ink hover:bg-ivory-muted hover:text-deep-forest transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-ink-muted">View →</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-ivory-border flex flex-col gap-2 text-xs text-ink-muted">
            <div className="flex items-center gap-2 text-deep-forest font-semibold">
              <Leaf className="w-4 h-4" />
              <span>Commercial & Eco Charter</span>
            </div>
            <p className="leading-relaxed">
              Every item is guaranteed under ₹1,000 with transparent origin documentation and zero plastic packaging.
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
