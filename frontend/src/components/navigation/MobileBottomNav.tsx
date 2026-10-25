"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Grid, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface MobileBottomNavProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCategories?: () => void;
  onOpenSearch?: () => void;
  onOpenWishlist?: () => void;
  onOpenCart?: () => void;
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
  const router = useRouter();
  const cartContext = useCart();

  const effectiveCartCount =
    cartCount !== undefined ? cartCount : cartContext.cartCount;
  const effectiveWishlistCount =
    wishlistCount !== undefined ? wishlistCount : cartContext.wishlist.length;
  const effectiveOnOpenCart = onOpenCart || (() => cartContext.setIsCartOpen(true));
  const effectiveOnOpenWishlist =
    onOpenWishlist || (() => cartContext.setIsWishlistOpen(true));
  const effectiveOnOpenCategories =
    onOpenCategories || (() => router.push("/category"));

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
            router.push("/");
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
          onClick={effectiveOnOpenCategories}
          aria-label="Categories"
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 text-center transition-colors cursor-pointer ${
            activeTab === "categories"
              ? "text-deep-forest font-semibold"
              : "text-ink-muted hover:text-soft-ink"
          }`}
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Catalog</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch || (() => router.push("/category"))}
          aria-label="Search"
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 text-center transition-colors cursor-pointer ${
            activeTab === "search"
              ? "text-deep-forest font-semibold"
              : "text-ink-muted hover:text-soft-ink"
          }`}
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Search</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={effectiveOnOpenWishlist}
          aria-label={`Saved items, ${effectiveWishlistCount} items`}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.8]" />
            {effectiveWishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-coral-pop text-deep-forest text-[9px] font-bold font-mono flex items-center justify-center leading-none">
                {effectiveWishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Saved</span>
        </button>

        {/* Bag */}
        <button
          type="button"
          onClick={effectiveOnOpenCart}
          aria-label={`Shopping bag, ${effectiveCartCount} items`}
          className="relative flex flex-col items-center justify-center min-h-[44px] py-1 text-center text-ink-muted hover:text-soft-ink transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {effectiveCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-deep-forest text-warm-ivory text-[9px] font-bold font-mono flex items-center justify-center leading-none">
                {effectiveCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-mono tracking-tight leading-none">Bag</span>
        </button>
      </div>
    </nav>
  );
};
