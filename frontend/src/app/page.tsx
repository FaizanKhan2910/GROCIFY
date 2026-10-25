"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Header } from "@/components/navigation/Header";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { ProductCard, ProductData } from "@/components/marketplace/ProductCard";
import { ProductQuickView } from "@/components/marketplace/ProductQuickView";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { SearchInput } from "@/components/ui/SearchInput";
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
} from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Hero3DCanvas } from "@/components/three/Hero3DCanvas";
import { SaleStoryHero } from "@/components/three/SaleStoryHero";
import { PinnedCategories } from "@/components/motion/PinnedCategories";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { SlidingPill } from "@/components/motion/SlidingPill";

export default function HomePage() {
  const router = useRouter();
  const {
    cart,
    wishlist,
    addToCart,
    toggleWishlist,
    isWishlisted,
    cartCount: cartItemCount,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useCart();

  // Overlays State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  // Cart operations
  const handleAddToCart = (product: ProductData, quantity = 1) => {
    addToCart(product, quantity);
  };

  const handleToggleWishlist = (product: ProductData) => {
    toggleWishlist(product);
  };

  // Category filter trigger — "all" maps to the /category index, not /category/all
  const handleSelectCategory = (categorySlug: string) => {
    router.push(categorySlug === "all" ? "/category" : `/category/${categorySlug}`);
  };

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
        {/* Cinematic Scroll-Driven 3D Product Sale Story */}
        <SaleStoryHero />

        {/* SECTION D: Shop by Category (Pinned Horizontal Travel) */}
        <PinnedCategories onSelectCategory={handleSelectCategory} />

        {/* SECTION E: Curated Product Collection ("Everyday favourites") */}
        <section id="collection" className="py-14 sm:py-20 border-b border-ivory-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Filter Chips */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <SectionHeading
                label="Primary Curation"
                title="Everyday favourites"
                subtitle="Useful things, thoughtfully selected."
                className="mb-0"
              />

              {/* Filter Tabs with Shared Sliding Pill */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <SlidingPill
                  selected={selectedCategorySlug === "all"}
                  onClick={() => setSelectedCategorySlug("all")}
                  layoutId="favourites-category-pill"
                >
                  All Favourites
                </SlidingPill>
                {CATEGORIES.map((cat) => (
                  <SlidingPill
                    key={cat.slug}
                    selected={selectedCategorySlug === cat.slug}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    layoutId="favourites-category-pill"
                  >
                    {cat.title}
                  </SlidingPill>
                ))}
              </div>
            </div>

            {/* Smooth Reshuffling Product Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredFavourites.map((product) => {
                  const isAdded = cart.some((c) => c.id === product.id);
                  const isSaved = isWishlisted(product.id);

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <ProductCard
                        product={product}
                        isAdded={isAdded}
                        isWishlisted={isSaved}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onToggleWishlist={handleToggleWishlist}
                        onQuickView={setQuickViewProduct}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
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
                const isSaved = isWishlisted(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdded={isAdded}
                    isWishlisted={isSaved}
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
                  We started GROCIFY because mindful Indian living shouldn&apos;t require navigating 10-minute gimmicks, inflated influencer markups, or fake discounts. We curate dependable essentials made with honest materials, transparent sourcing, and an uncompromising ₹1,000 price ceiling.
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

          {/* Giant Outlined Wordmark That Fills as it Scrolls into View */}
          <div className="py-10 sm:py-16 overflow-hidden border-t border-ivory-border/60">
            <motion.div
              initial={{ opacity: 0.35, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex justify-center select-none"
            >
              <span
                className="font-display font-extrabold text-[16vw] leading-none tracking-tighter text-transparent uppercase transition-all duration-700 ease-out hover:text-deep-forest"
                style={{
                  WebkitTextStroke: "1.5px #173D2D",
                }}
              >
                GROCIFY
              </span>
            </motion.div>
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

    </div>
  );
}
