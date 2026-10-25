"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Leaf } from "lucide-react";
import { CartIndicator } from "./CartIndicator";
import { Drawer } from "../ui/Drawer";
import { SearchInput } from "../ui/SearchInput";

export interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  className?: string;
}

const NAV_LINKS = [
  { label: "Kitchen & Pantry", href: "/category/kitchen" },
  { label: "Personal Care", href: "/category/personal-care" },
  { label: "Eco Home & Clean", href: "/category/home-clean" },
  { label: "Reusables", href: "/category/reusables" },
  { label: "Verified Claims", href: "/about/verified-standards" },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  onOpenCart,
  className = "",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-warm-ivory/95 backdrop-blur-md border-b border-ivory-border ${className}`}
    >
      {/* Top Banner: Transparency & Shipping Rule */}
      <div className="bg-deep-forest text-warm-ivory text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <span>Free delivery on orders ₹499+ across India • Strict ₹1,000 max price guarantee</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-soft-ink hover:bg-ivory-muted"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Brand Logo & Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest rounded-sm"
            >
              <div className="w-8 h-8 rounded-sm bg-deep-forest text-electric-citrus flex items-center justify-center font-display font-extrabold text-lg">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl text-deep-forest tracking-tight leading-none group-hover:text-forest-light transition-colors">
                  GROCIFY
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-ink-muted leading-tight">
                  HOW Networks
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <SearchInput
              placeholder="Search mindful essentials under ₹1,000..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-soft-ink">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-deep-forest transition-colors py-2 relative after:absolute after:bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-deep-forest after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions: Eco Promise & Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/standards"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium text-deep-forest bg-forest-subtle px-3 py-2 rounded-sm border border-deep-forest/15 hover:bg-forest-subtle/80 transition-colors"
            >
              <Leaf className="w-3.5 h-3.5 text-deep-forest" aria-hidden="true" />
              <span>100% Verified</span>
            </Link>

            <CartIndicator itemCount={cartCount} onClick={onOpenCart} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="GROCIFY Menu"
        position="bottom"
      >
        <div className="flex flex-col gap-5 py-2">
          <div>
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Search Products
            </label>
            <SearchInput
              placeholder="Search eco essentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-3">
              Explore Collections
            </span>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center px-3 rounded-md text-sm font-medium text-soft-ink hover:bg-ivory-muted hover:text-deep-forest transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-ivory-border flex flex-col gap-2 text-xs text-ink-muted">
            <div className="flex items-center gap-2 text-deep-forest font-semibold">
              <Leaf className="w-4 h-4" />
              <span>The GROCIFY Credential Standard</span>
            </div>
            <p className="leading-relaxed">
              We never list unverified green claims or items above ₹1,000. Every item has transparent ingredient & source documentation.
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
