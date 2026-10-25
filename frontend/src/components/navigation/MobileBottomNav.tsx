"use client";

import React from "react";
import { Home, Grid, Search, Heart, ShoppingBag } from "lucide-react";

export interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCategories: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  activeTab?: "home" | "categories" | "search" | "wishlist" | "cart";
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onOpenCategories,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
  activeTab = "home",
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-warm-ivory/95 backdrop-blur-md border-t border-ivory-border shadow-drawer pb-[max(env(safe-area-inset-bottom),0.5rem)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* Home */}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Home"
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 text-center transition-colors cursor-pointer ${
            activeTab === "home"
              ? "text-deep-forest font-semibold"
              : "text-ink-muted hover:text-soft-ink"
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Home</span>
        </button>

        {/* Categories */}
        <button
          type="button"
          onClick={onOpenCategories}
          aria-label="Categories"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Catalog</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Search</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          aria-label={`Saved items, ${wishlistCount} items`}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-coral-pop text-deep-forest text-[9px] font-bold font-mono flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Saved</span>
        </button>

        {/* Bag */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Shopping bag, ${cartCount} items`}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-deep-forest text-warm-ivory text-[9px] font-bold font-mono flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Bag</span>
        </button>
      </div>
    </nav>
  );
};
