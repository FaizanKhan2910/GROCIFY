"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/navigation/Header";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { ProductCard, ProductData } from "@/components/marketplace/ProductCard";
import { CategoryTile } from "@/components/marketplace/CategoryTile";
import { ProductQuickView } from "@/components/marketplace/ProductQuickView";
import { FreeShippingProgress } from "@/components/marketplace/FreeShippingProgress";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Drawer } from "@/components/ui/Drawer";
import { Toast } from "@/components/ui/Toast";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CATEGORIES,
  EVERYDAY_FAVOURITES,
  SMALL_UPGRADES,
  ALL_PRODUCTS,
} from "@/lib/catalog";
import {
  MAX_PRODUCT_PRICE_INR,
  FREE_SHIPPING_THRESHOLD_INR,
  STANDARD_SHIPPING_FEE_INR,
  calculateShipping,
} from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface CartItem extends ProductData {
  quantity: number;
}

export default function HomePage() {
  // Commerce State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ProductData[]>([]);

  // Overlays State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  // Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "info" | "error">("success");

  // Cart operations
  const handleAddToCart = (product: ProductData, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setToastVariant("success");
    setToastMessage(`Added "${product.title}" to your bag.`);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Wishlist operations
  const handleToggleWishlist = (product: ProductData) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        setToastVariant("info");
        setToastMessage(`Removed "${product.title}" from saved items.`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        setToastVariant("success");
        setToastMessage(`Saved "${product.title}" to your wishlist.`);
        return [...prev, product];
      }
    });
  };

  // Category filter trigger
  const handleSelectCategory = (categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setIsCategoriesOpen(false);
    const target = document.getElementById("collection");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Calculations
  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0),
    [cart]
  );

  const shippingCalc = useMemo(
    () => calculateShipping(cartSubtotal),
    [cartSubtotal]
  );

  // Search filtered products
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.ecoCredential?.label.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Collection 1 filtering
  const filteredFavourites = useMemo(() => {
    if (selectedCategorySlug === "all") return EVERYDAY_FAVOURITES;
    const cat = CATEGORIES.find((c) => c.slug === selectedCategorySlug);
    if (!cat) return EVERYDAY_FAVOURITES;
    const filtered = EVERYDAY_FAVOURITES.filter(
      (p) => p.category.toLowerCase() === cat.title.toLowerCase()
    );
    return filtered.length > 0 ? filtered : EVERYDAY_FAVOURITES;
  }, [selectedCategorySlug]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory selection:bg-electric-citrus selection:text-deep-forest pb-20 lg:pb-0">
      {/* SECTION A & B: Responsive Header with Announcement Strip */}
      <Header
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCategory={handleSelectCategory}
      />

      <main className="flex-1">
        {/* SECTION C: Hero — The Signature Moment */}
        <section className="relative overflow-hidden border-b border-ivory-border bg-warm-ivory py-12 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Brand Statement & Hierarchy */}
              <div className="lg:col-span-7 flex flex-col items-start">
                {/* Brand Proof Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Badge variant="eco" size="md">
                    Zero Plastic Packaging
                  </Badge>
                  <span className="font-mono text-xs text-deep-forest font-semibold bg-forest-subtle px-2.5 py-1 rounded-sm border border-deep-forest/15">
                    Strictly ≤ ₹1,000
                  </span>
                  <span className="font-mono text-xs text-ink-muted hidden sm:inline">
                    HOW Networks
                  </span>
                </div>

                {/* Primary Display Headline */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-soft-ink tracking-tight leading-[1.06] mb-6">
                  Better everyday.
                  <br />
                  <span className="text-deep-forest italic font-normal">
                    Thoughtfully chosen.
                  </span>
                </h1>

                {/* Supporting Copy */}
                <p className="font-body text-base sm:text-xl text-ink-muted max-w-xl leading-relaxed mb-8">
                  Everyday essentials for your home, rituals and routines — selected with care and priced under ₹1,000. Verified origins with zero synthetic markups.
                </p>

                {/* Direct Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    rightIcon={<ArrowDown className="w-4 h-4" />}
                    className="shadow-card"
                  >
                    Explore the collection
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Shop everyday essentials
                  </Button>
                </div>

                {/* Micro Assurance Strip */}
                <div className="mt-10 pt-6 border-t border-ivory-border/70 flex flex-wrap items-center gap-6 text-xs text-ink-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-deep-forest" />
                    <span>Free shipping ₹499+ across India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-deep-forest" />
                    <span>Laboratory-tested non-toxic</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Layered Editorial Product Composition */}
              <div className="lg:col-span-5 relative">
                {/* Visual Canvas Frame */}
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Backdrop Offset Block */}
                  <div className="absolute -inset-2 sm:-inset-4 bg-forest-subtle/70 rounded-lg -rotate-1 border border-deep-forest/10" />

                  {/* Main Editorial Showcase Image */}
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

                      {/* Editorial Overlay Pill 1 */}
                      <div className="absolute top-4 left-4 z-10 bg-warm-ivory/95 backdrop-blur-xs p-2.5 rounded-sm border border-ivory-border shadow-subtle flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-electric-citrus animate-ping" />
                        <span className="font-mono text-xs font-semibold text-deep-forest uppercase tracking-wider">
                          100% Seasoned Neem & Coir
                        </span>
                      </div>

                      {/* Editorial Overlay Pill 2 (Price Guarantee) */}
                      <div className="absolute bottom-4 right-4 z-10 bg-deep-forest text-warm-ivory p-3 rounded-sm shadow-card flex flex-col items-end">
                        <span className="font-mono text-[10px] text-electric-citrus uppercase tracking-widest">
                          Fair Price Guarantee
                        </span>
                        <span className="font-display text-lg font-bold">
                          Always ≤ ₹1,000
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tactile Secondary Accent Card */}
                  <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-warm-ivory border border-ivory-border p-3.5 rounded-md shadow-card items-center gap-3 z-20">
                    <div className="w-10 h-10 rounded-sm bg-electric-citrus flex items-center justify-center text-deep-forest font-bold">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-xs text-soft-ink leading-tight">
                        Plastic-Free Promise
                      </p>
                      <p className="text-[11px] text-ink-muted">
                        Shipped in recycled paper mailers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D: Shop by Category */}
        <section id="categories" className="py-14 sm:py-20 border-b border-ivory-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
                  Curated Catalogues
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-soft-ink mt-1 tracking-tight">
                  Shop by daily ritual
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted max-w-sm">
                Practical, durable everyday tools categorized by domestic routine. Zero novelty junk.
              </p>
            </div>

            {/* 4 Distinctive Category Tiles: 2-column on mobile, 4-column on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {CATEGORIES.map((cat) => (
                <CategoryTile
                  key={cat.id}
                  title={cat.title}
                  slug={cat.slug}
                  tagline={cat.tagline}
                  itemCount={cat.itemCount}
                  accentColor={cat.accentColor}
                  imageUrl={cat.imageUrl}
                  onClick={() => handleSelectCategory(cat.slug)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION E: Curated Product Collection ("Everyday favourites") */}
        <section id="collection" className="py-14 sm:py-20 border-b border-ivory-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Filter Chips */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-deep-forest font-semibold">
                  Primary Curation
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-soft-ink mt-1 tracking-tight">
                  Everyday favourites
                </h2>
                <p className="text-sm sm:text-base text-ink-muted mt-2 leading-relaxed">
                  Useful things, thoughtfully selected.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <Chip
                  selected={selectedCategorySlug === "all"}
                  onClick={() => setSelectedCategorySlug("all")}
                >
                  All Favourites
                </Chip>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.slug}
                    selected={selectedCategorySlug === cat.slug}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                  >
                    {cat.title}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Product Grid: 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredFavourites.map((product) => {
                const isAdded = cart.some((c) => c.id === product.id);
                const isWishlisted = wishlist.some((w) => w.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdded={isAdded}
                    isWishlisted={isWishlisted}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={setQuickViewProduct}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION F: A Distinctive Editorial Brand Section */}
        <section className="py-16 sm:py-24 bg-deep-forest text-warm-ivory border-b border-ivory-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Editorial Image Side */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-warm-ivory/15 shadow-elevation">
                  <Image
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80"
                    alt="Handcrafted pantry and kitchen utensils in traditional glass and wood"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-warm-ivory">
                    <p className="font-mono text-xs uppercase text-electric-citrus mb-1">
                      The Curation Standard
                    </p>
                    <p className="font-display text-sm font-semibold">
                      Tested for everyday Indian cooking & living routines
                    </p>
                  </div>
                </div>
              </div>

              {/* Editorial Copy Side */}
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center lg:pl-6">
                <span className="font-mono text-xs uppercase tracking-widest text-electric-citrus mb-3">
                  Philosophy & Origin
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6 text-warm-ivory">
                  Less noise.
                  <br />
                  Better everyday choices.
                </h2>
                <p className="font-body text-base sm:text-lg text-warm-ivory/80 leading-relaxed mb-8 max-w-xl">
                  We started GROCIFY because mindful Indian living shouldn’t require navigating 10-minute gimmicks, inflated influencer markups, or fake discounts. We curate dependable essentials made with honest materials, transparent sourcing, and an uncompromising ₹1,000 price ceiling.
                </p>

                {/* Grounded Pillars (Substantiated claims only) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-warm-ivory/15">
                  <div>
                    <span className="font-display text-2xl font-bold text-electric-citrus">
                      ≤ ₹1,000
                    </span>
                    <h4 className="font-display text-sm font-semibold text-warm-ivory mt-1">
                      Strict Price Cap
                    </h4>
                    <p className="text-xs text-warm-ivory/70 mt-1">
                      Guaranteed maximum price across every single catalog item.
                    </p>
                  </div>

                  <div>
                    <span className="font-display text-2xl font-bold text-butter-yellow">
                      100%
                    </span>
                    <h4 className="font-display text-sm font-semibold text-warm-ivory mt-1">
                      Substantiated Claims
                    </h4>
                    <p className="text-xs text-warm-ivory/70 mt-1">
                      Only verified eco credentials with laboratory batch records.
                    </p>
                  </div>

                  <div>
                    <span className="font-display text-2xl font-bold text-coral-pop">
                      ₹499+
                    </span>
                    <h4 className="font-display text-sm font-semibold text-warm-ivory mt-1">
                      Free India Delivery
                    </h4>
                    <p className="text-xs text-warm-ivory/70 mt-1">
                      Clear shipping rules with zero hidden handling surcharges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION G: Shopping-Value Strip */}
        <section id="standards" className="py-12 bg-warm-ivory border-b border-ivory-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="p-5 rounded-md border border-ivory-border bg-warm-ivory shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-forest-subtle flex items-center justify-center text-deep-forest shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-soft-ink">
                    ₹{MAX_PRODUCT_PRICE_INR} Maximum Price Ceiling
                  </h4>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Every product is evaluated against our strict ₹{MAX_PRODUCT_PRICE_INR} ceiling. Quality essentials should remain accessible to all Indian households.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-5 rounded-md border border-ivory-border bg-warm-ivory shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-citrus-muted/60 flex items-center justify-center text-deep-forest shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-soft-ink">
                    Transparent Shipping Policy
                  </h4>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Complimentary delivery on orders ₹{FREE_SHIPPING_THRESHOLD_INR} and above. Orders under ₹{FREE_SHIPPING_THRESHOLD_INR} incur flat ₹{STANDARD_SHIPPING_FEE_INR} shipping.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-5 rounded-md border border-ivory-border bg-warm-ivory shadow-subtle flex items-start gap-4">
                <div className="w-10 h-10 rounded-sm bg-coral-subtle flex items-center justify-center text-coral-hover shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-soft-ink">
                    Plastic-Free Paper Mailers
                  </h4>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Shipped exclusively in 100% recyclable corrugated paper and paper tape. Zero bubble wrap or single-use shrink wrap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION H: Additional Curated Collection ("Small upgrades, everyday") */}
        <section className="py-14 sm:py-20 border-b border-ivory-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-deep-forest font-semibold">
                  Fresh Curations
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-soft-ink mt-1 tracking-tight">
                  Small upgrades, everyday
                </h2>
                <p className="text-sm text-ink-muted mt-1">
                  Thoughtful picks for your space — durable, beautiful, and sustainable.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="verified">100% Genuine Materials</Badge>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {SMALL_UPGRADES.map((product) => {
                const isAdded = cart.some((c) => c.id === product.id);
                const isWishlisted = wishlist.some((w) => w.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdded={isAdded}
                    isWishlisted={isWishlisted}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={setQuickViewProduct}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* SECTION I: Refined Footer */}
      <footer className="bg-warm-ivory border-t border-ivory-border text-xs text-ink-muted pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-deep-forest text-electric-citrus flex items-center justify-center font-display font-bold text-sm">
                  G
                </div>
                <span className="font-display font-extrabold text-xl text-deep-forest tracking-tight">
                  GROCIFY
                </span>
              </div>
              <p className="text-xs text-ink-muted max-w-sm leading-relaxed">
                A curated Indian marketplace for practical, eco-conscious everyday products. Thoughtfully crafted essentials with transparent verified credentials under ₹1,000.
              </p>
              <div className="pt-2 text-[11px] font-mono text-soft-ink">
                An initiative of <strong className="text-deep-forest">HOW Networks</strong>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h5 className="font-mono text-xs uppercase tracking-wider text-soft-ink font-semibold mb-3">
                  Shop Catalog
                </h5>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(cat.slug)}
                        className="hover:text-deep-forest transition-colors text-left cursor-pointer"
                      >
                        {cat.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-mono text-xs uppercase tracking-wider text-soft-ink font-semibold mb-3">
                  Pledges
                </h5>
                <ul className="space-y-2">
                  <li>
                    <a href="#standards" className="hover:text-deep-forest transition-colors">
                      ₹1,000 Price Ceiling
                    </a>
                  </li>
                  <li>
                    <a href="#standards" className="hover:text-deep-forest transition-colors">
                      ₹499 Free Shipping
                    </a>
                  </li>
                  <li>
                    <a href="#standards" className="hover:text-deep-forest transition-colors">
                      Plastic-Free Packaging
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-mono text-xs uppercase tracking-wider text-soft-ink font-semibold mb-3">
                  Delivery Inquiries
                </h5>
                <p className="text-xs leading-relaxed text-ink-muted">
                  Standard delivery across 19,000+ Indian pincodes. Flat ₹59 under ₹499; complimentary at ₹499+.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-ivory-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
            <div>
              © {new Date().getFullYear()} GROCIFY • HOW Networks. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>MADE IN INDIA</span>
              <span>•</span>
              <span>VERIFIED COMMERCIAL POLICY</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SECTION J: Mobile Bottom Shopping Navigation */}
      <MobileBottomNav
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onOpenCategories={() => setIsCategoriesOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* OVERLAY 1: Shopping Bag Drawer */}
      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Your Shopping Bag (${cartItemCount})`}
        position="right"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            {/* Free Shipping Progress Indicator */}
            <FreeShippingProgress currentSubtotal={cartSubtotal} />

            {cart.length === 0 ? (
              <EmptyState
                title="Your shopping bag is empty"
                description="Explore everyday essentials priced under ₹1,000 with transparent verified credentials."
                actionLabel="Explore Favourites"
                onAction={() => {
                  setIsCartOpen(false);
                  document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-md border border-ivory-border bg-warm-ivory"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-ivory-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-ink-muted">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-xs text-deep-forest">
                          {formatRupees(item.sellingPrice * item.quantity)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-ivory-muted hover:bg-ivory-border flex items-center justify-center text-xs font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-1 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-ivory-muted hover:bg-ivory-border flex items-center justify-center text-xs font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="p-1 rounded text-ink-subtle hover:text-coral-hover transition-colors"
                      aria-label={`Remove ${item.title} from bag`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-ivory-border space-y-3 mt-6">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatRupees(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Shipping Fee</span>
                <span className="font-mono">
                  {shippingCalc.isFreeShipping
                    ? "FREE"
                    : formatRupees(shippingCalc.shippingFeeInr)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-soft-ink pt-2 border-t border-ivory-border">
                <span>Order Total</span>
                <span className="text-deep-forest font-mono text-base">
                  {formatRupees(cartSubtotal + shippingCalc.shippingFeeInr)}
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setToastVariant("success");
                  setToastMessage("Proceeding to checkout — order validation confirmed.");
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      {/* OVERLAY 2: Wishlist Drawer */}
      <Drawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        title={`Saved Items (${wishlist.length})`}
        position="right"
      >
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <EmptyState
              title="No saved items yet"
              description="Click the heart icon on any product to bookmark essentials you want to purchase later."
              actionLabel="Discover Essentials"
              onAction={() => {
                setIsWishlistOpen(false);
                document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ) : (
            <div className="space-y-3">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-md border border-ivory-border bg-warm-ivory"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-ivory-muted shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                        {item.title}
                      </h5>
                      <span className="font-mono text-xs text-deep-forest font-bold">
                        {formatRupees(item.sellingPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        handleAddToCart(item);
                        handleToggleWishlist(item);
                      }}
                    >
                      Move to Bag
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(item)}
                      aria-label="Remove from saved items"
                      className="p-1 rounded text-ink-subtle hover:text-coral-hover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      {/* OVERLAY 3: Mobile Search Drawer */}
      <Drawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Essentials"
        position="bottom"
      >
        <div className="space-y-4 py-2">
          <SearchInput
            placeholder="Search neem comb, coir brushes, cold-pressed oils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            autoFocus
          />

          {searchQuery.trim() && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                {searchResults.length} Matching Essentials:
              </span>
              {searchResults.length === 0 ? (
                <p className="text-xs text-ink-muted py-4 text-center">
                  No products matched &quot;{searchQuery}&quot;. All items are guaranteed ≤ ₹1,000.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setQuickViewProduct(item);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded border border-ivory-border bg-warm-ivory hover:border-deep-forest cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-ivory-muted shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-ink-muted">{item.category}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-deep-forest">
                        {formatRupees(item.sellingPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {/* OVERLAY 4: Mobile Category Drawer */}
      <Drawer
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        title="Explore Categories"
        position="bottom"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.slug)}
              className="flex items-center justify-between p-3.5 rounded-md border border-ivory-border bg-warm-ivory hover:border-deep-forest text-left"
            >
              <div>
                <h5 className="font-display font-semibold text-sm text-soft-ink">
                  {cat.title}
                </h5>
                <p className="text-xs text-ink-muted mt-0.5">{cat.itemCount} curated items</p>
              </div>
              <ArrowRight className="w-4 h-4 text-deep-forest" />
            </button>
          ))}
        </div>
      </Drawer>

      {/* OVERLAY 5: Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
          setQuickViewProduct(null);
        }}
        isAdded={Boolean(
          quickViewProduct && cart.some((c) => c.id === quickViewProduct.id)
        )}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <Toast
          variant={toastVariant}
          message={toastMessage}
          isVisible={Boolean(toastMessage)}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
