"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Leaf, Heart } from "lucide-react";
import { CartIndicator } from "./CartIndicator";
import { Drawer } from "../ui/Drawer";
import { SearchInput } from "../ui/SearchInput";

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
  { label: "Kitchen & Pantry", slug: "kitchen", targetId: "categories" },
  { label: "Personal Care", slug: "personal-care", targetId: "categories" },
  { label: "Home & Clean", slug: "home-clean", targetId: "categories" },
  { label: "Reusables & Travel", slug: "reusables", targetId: "categories" },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  searchQuery = "",
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenCategory,
  className = "",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (slug: string) => {
    setMobileMenuOpen(false);
    if (onOpenCategory) {
      onOpenCategory(slug);
    } else {
      const el = document.getElementById("collection");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-warm-ivory/95 backdrop-blur-md border-b border-ivory-border ${className}`}
    >
      {/* A. Announcement Strip */}
      <div className="bg-deep-forest text-warm-ivory text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-electric-citrus animate-pulse" />
          <span>Complimentary delivery on orders ₹499+ across India • Strict ₹1,000 max price guarantee</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            className="lg:hidden min-h-[44px] min-w-[44px] -ml-2 inline-flex items-center justify-center rounded-md text-soft-ink hover:bg-ivory-muted cursor-pointer"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* B. Brand Wordmark & Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest rounded-sm"
            >
              <div className="w-8 h-8 rounded-sm bg-deep-forest text-electric-citrus flex items-center justify-center font-display font-extrabold text-lg shadow-subtle group-hover:bg-forest-light transition-colors">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl sm:text-2xl text-deep-forest tracking-tight leading-none group-hover:text-forest-light transition-colors">
                  GROCIFY
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-ink-muted leading-tight mt-0.5">
                  HOW Networks
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <SearchInput
              placeholder="Search mindful essentials under ₹1,000..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onClear={() => onSearchChange?.("")}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-soft-ink">
            {NAV_LINKS.map((link) => (
              <button
                key={link.slug}
                type="button"
                onClick={() => handleNavClick(link.slug)}
                className="hover:text-deep-forest transition-colors py-2 relative after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-deep-forest after:scale-x-0 hover:after:scale-x-100 after:transition-transform cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Verified Pledge, Saved, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#standards"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-deep-forest bg-forest-subtle px-3 py-2 rounded-sm border border-deep-forest/15 hover:bg-forest-subtle/80 transition-colors"
            >
              <Leaf className="w-3.5 h-3.5 text-deep-forest" aria-hidden="true" />
              <span>≤ ₹1,000 Guarantee</span>
            </a>

            {/* Desktop Wishlist Button */}
            <button
              type="button"
              onClick={onOpenWishlist}
              aria-label={`Saved items, ${wishlistCount} items`}
              className="hidden sm:inline-flex relative min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-ivory-border bg-warm-ivory text-soft-ink hover:text-deep-forest hover:border-deep-forest/30 hover:bg-ivory-muted transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral-pop text-deep-forest text-[10px] font-bold font-mono flex items-center justify-center leading-none border-2 border-warm-ivory">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Indicator */}
            <CartIndicator itemCount={cartCount} onClick={onOpenCart} />
          </div>
        </div>
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
              placeholder="Search eco essentials..."
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
                    onClick={() => handleNavClick(link.slug)}
                    className="w-full text-left min-h-[44px] flex items-center justify-between px-3 rounded-md text-sm font-medium text-soft-ink hover:bg-ivory-muted hover:text-deep-forest transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-ink-muted">Explore →</span>
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
