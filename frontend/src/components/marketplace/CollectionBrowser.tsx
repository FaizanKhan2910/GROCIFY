"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ProductCard, ProductData } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb, BreadcrumbItem } from "../ui/Breadcrumb";
import { Badge } from "../ui/Badge";
import { Chip } from "../ui/Chip";
import { Button } from "../ui/Button";
import { Drawer } from "../ui/Drawer";
import { SearchInput } from "../ui/SearchInput";
import { EmptyState } from "../ui/EmptyState";
import {
  CATEGORIES,
  ALL_PRODUCTS,
  filterAndSortProducts,
  SortOption,
} from "@/lib/catalog";
import {
  MAX_PRODUCT_PRICE_INR,
} from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import {
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export interface CollectionBrowserProps {
  initialCategorySlug?: string;
  showCategoryLandingCards?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const AVAILABLE_CREDENTIALS = [
  "Zero Plastic",
  "Compostable",
  "Glass Packaged",
  "Ayurvedic Grade",
  "Biodegradable",
  "Unbleached Cotton",
  "Lifetime Metal",
  "Natural Ferment",
];

const PRICE_PRESETS = [
  { label: "All Prices (≤ ₹1,000)", value: 1000 },
  { label: "Under ₹250", value: 250 },
  { label: "Under ₹500", value: 500 },
  { label: "Under ₹750", value: 750 },
];

export const CollectionBrowser: React.FC<CollectionBrowserProps> = ({
  initialCategorySlug = "all",
  showCategoryLandingCards = false,
  pageTitle = "Find your everyday favourites.",
  pageSubtitle = "Curated domestic tools, cold-pressed essentials, and zero-plastic alternatives for your daily Indian routines. All guaranteed ≤ ₹1,000.",
  breadcrumbs,
}) => {
  const { addToCart, toggleWishlist, isWishlisted, cart } = useCart();

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("curated");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Overlays
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);

  // Toggle credential filter
  const handleToggleCredential = (cred: string) => {
    setSelectedCredentials((prev) =>
      prev.includes(cred) ? prev.filter((c) => c !== cred) : [...prev, cred]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(1000);
    setSelectedCredentials([]);
    setSortBy("curated");
    setSearchQuery("");
  };

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count += 1;
    if (maxPrice < 1000) count += 1;
    if (selectedCredentials.length > 0) count += selectedCredentials.length;
    if (searchQuery.trim().length > 0) count += 1;
    return count;
  }, [selectedCategory, maxPrice, selectedCredentials, searchQuery]);

  // Derived filtered & sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(ALL_PRODUCTS, {
      categorySlug: selectedCategory,
      maxPrice,
      selectedCredentials,
      sortBy,
      searchQuery,
    });
  }, [selectedCategory, maxPrice, selectedCredentials, sortBy, searchQuery]);

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/category" },
  ];

  if (selectedCategory !== "all") {
    const currentCat = CATEGORIES.find((c) => c.slug === selectedCategory);
    if (currentCat) {
      defaultBreadcrumbs.push({ label: currentCat.title });
    }
  }

  // Active category meta
  const currentCategoryData = useMemo(() => {
    return CATEGORIES.find((c) => c.slug === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs || defaultBreadcrumbs} className="mb-6" />

      {/* Editorial Header Section */}
      <div className="border-b border-ivory-border/80 pb-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="eco" size="sm">
                Curated Collections
              </Badge>
              <span className="font-mono text-xs text-deep-forest font-semibold bg-forest-subtle px-2 py-0.5 rounded-xs border border-deep-forest/15">
                ≤ ₹{MAX_PRODUCT_PRICE_INR} Guaranteed
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-soft-ink tracking-tight leading-[1.08]">
              {currentCategoryData ? currentCategoryData.title : pageTitle}
            </h1>

            <p className="font-body text-sm sm:text-base text-ink-muted mt-3 leading-relaxed max-w-2xl">
              {currentCategoryData ? currentCategoryData.description : pageSubtitle}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="p-3 bg-warm-ivory border border-ivory-border rounded-md shadow-subtle flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-deep-forest" />
              <div>
                <span className="font-mono text-xs font-bold text-deep-forest block">
                  {filteredProducts.length} of {ALL_PRODUCTS.length} Essentials
                </span>
                <span className="text-[10px] text-ink-muted">
                  Substantiated laboratory claims
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Editorial Category Landing Visual Cards */}
      {showCategoryLandingCards && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Choose by domestic routine
            </span>
            <span className="text-xs text-ink-muted hidden sm:inline">
              Click a routine to explore its verified tools
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(isSelected ? "all" : cat.slug)
                  }
                  className={`group relative text-left flex flex-col justify-between p-5 rounded-md border transition-all duration-200 overflow-hidden min-h-[170px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest ${
                    isSelected
                      ? "border-deep-forest bg-forest-subtle/50 shadow-card"
                      : "border-ivory-border bg-warm-ivory hover:border-deep-forest/40 hover:shadow-subtle"
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                    style={{ backgroundColor: cat.accentColor }}
                  />

                  {/* Visual Accent */}
                  <div className="absolute right-0 bottom-0 w-24 h-24 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none overflow-hidden rounded-tl-full">
                    <Image
                      src={cat.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-start justify-between relative z-10 w-full">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted bg-warm-ivory/80 px-2 py-0.5 rounded-xs border border-ivory-border/60">
                      {cat.itemCount} items
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-deep-forest text-warm-ivory"
                          : "bg-ivory-muted group-hover:bg-deep-forest group-hover:text-warm-ivory text-soft-ink"
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                  </div>

                  <div className="mt-6 relative z-10">
                    <h4 className="font-display text-base sm:text-lg font-bold text-soft-ink group-hover:text-deep-forest transition-colors leading-tight">
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-ink-muted mt-1 line-clamp-1">
                      {cat.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Catalog Workspace: Filter Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start p-6 rounded-md border border-ivory-border bg-warm-ivory space-y-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-border">
            <div className="flex items-center gap-2 font-display font-bold text-sm text-soft-ink">
              <SlidersHorizontal className="w-4 h-4 text-deep-forest" />
              <span>Filters</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-coral-hover font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>

          {/* Search within collection */}
          <div>
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Search Essentials
            </label>
            <SearchInput
              placeholder="e.g. neem, brass, oil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2.5">
              Category
            </label>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`text-left text-xs px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-deep-forest text-warm-ivory font-semibold"
                    : "text-soft-ink hover:bg-ivory-muted"
                }`}
              >
                <span>All Collections</span>
                <span className="font-mono text-[10px] opacity-80">
                  {ALL_PRODUCTS.length}
                </span>
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-left text-xs px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-deep-forest text-warm-ivory font-semibold"
                        : "text-soft-ink hover:bg-ivory-muted"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span className="font-mono text-[10px] opacity-80">
                      {cat.itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Ceiling & Range Filter */}
          <div className="pt-4 border-t border-ivory-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase text-ink-muted block">
                Max Price
              </label>
              <span className="font-mono text-xs font-bold text-deep-forest">
                {formatRupees(maxPrice)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={150}
              max={1000}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-deep-forest cursor-pointer mb-3"
              aria-label="Filter maximum price up to ₹1,000"
            />

            {/* Price Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setMaxPrice(preset.value)}
                  className={`text-[11px] py-1 px-2 rounded border text-center transition-colors cursor-pointer ${
                    maxPrice === preset.value
                      ? "bg-forest-subtle text-deep-forest border-deep-forest font-semibold"
                      : "border-ivory-border text-ink-muted hover:border-ink-subtle"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-ink-muted mt-2">
              *Strict policy: No products exceed ₹1,000.
            </p>
          </div>

          {/* Verified Eco Credentials */}
          <div className="pt-4 border-t border-ivory-border">
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Verified Credential
            </label>
            <div className="flex flex-col gap-1.5">
              {AVAILABLE_CREDENTIALS.map((cred) => {
                const isSelected = selectedCredentials.includes(cred);
                return (
                  <button
                    key={cred}
                    type="button"
                    onClick={() => handleToggleCredential(cred)}
                    className="flex items-center justify-between text-left text-xs py-1 text-soft-ink hover:text-deep-forest cursor-pointer group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {cred}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-deep-forest border-deep-forest text-warm-ivory"
                          : "border-ivory-border bg-warm-ivory"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT LISTING COLUMN */}
        <section className="lg:col-span-9 flex flex-col">
          {/* Top Control Bar: Mobile Filter Button, Sorting & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-md border border-ivory-border bg-warm-ivory mb-6 shadow-subtle">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Sheet Trigger */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden"
                leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>

              <span className="text-xs text-ink-muted">
                Showing{" "}
                <strong className="text-soft-ink font-semibold">
                  {filteredProducts.length}
                </strong>{" "}
                of {ALL_PRODUCTS.length} curated essentials
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label
                htmlFor="sort-select"
                className="text-xs font-mono uppercase text-ink-muted shrink-0"
              >
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs bg-warm-ivory border border-ivory-border rounded-md px-3 py-1.5 text-soft-ink focus:outline-none focus:ring-2 focus:ring-deep-forest cursor-pointer font-medium"
              >
                <option value="curated">Curated Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-md bg-forest-subtle/50 border border-deep-forest/10">
              <span className="text-xs font-mono text-deep-forest font-semibold mr-1">
                Active filters:
              </span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-warm-ivory border border-deep-forest/20 text-deep-forest px-2.5 py-1 rounded-full font-medium">
                  <span>Category: {currentCategoryData?.title || selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-coral-hover cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {maxPrice < 1000 && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-warm-ivory border border-deep-forest/20 text-deep-forest px-2.5 py-1 rounded-full font-medium">
                  <span>Price: ≤ {formatRupees(maxPrice)}</span>
                  <button
                    type="button"
                    onClick={() => setMaxPrice(1000)}
                    className="hover:text-coral-hover cursor-pointer"
                    aria-label="Reset price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCredentials.map((cred) => (
                <span
                  key={cred}
                  className="inline-flex items-center gap-1.5 text-xs bg-warm-ivory border border-deep-forest/20 text-deep-forest px-2.5 py-1 rounded-full font-medium"
                >
                  <span>{cred}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleCredential(cred)}
                    className="hover:text-coral-hover cursor-pointer"
                    aria-label={`Remove ${cred} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {searchQuery.trim().length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-warm-ivory border border-deep-forest/20 text-deep-forest px-2.5 py-1 rounded-full font-medium">
                  <span>Search: &quot;{searchQuery}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="hover:text-coral-hover cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-coral-hover font-semibold hover:underline ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No essentials match these filters"
              description="Try broadening your price range or resetting selected environmental credentials to view more curated domestic items."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
              className="my-8"
            />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => {
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
                        onAddToCart={(p) => addToCart(p, 1)}
                        onToggleWishlist={toggleWishlist}
                        onQuickView={setQuickViewProduct}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET / DRAWER */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter & Refine Collection"
        position="bottom"
      >
        <div className="space-y-6 py-2">
          {/* Categories */}
          <div>
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <Chip
                selected={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              >
                All ({ALL_PRODUCTS.length})
              </Chip>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.slug}
                  selected={selectedCategory === cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.title} ({cat.itemCount})
                </Chip>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-ivory-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase text-ink-muted block">
                Max Price
              </label>
              <span className="font-mono text-sm font-bold text-deep-forest">
                {formatRupees(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={150}
              max={1000}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-deep-forest cursor-pointer mb-3"
            />
            <div className="grid grid-cols-2 gap-2">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setMaxPrice(preset.value)}
                  className={`text-xs py-1.5 px-2 rounded border text-center ${
                    maxPrice === preset.value
                      ? "bg-deep-forest text-warm-ivory border-deep-forest font-semibold"
                      : "border-ivory-border text-soft-ink bg-warm-ivory"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eco Attributes */}
          <div className="pt-4 border-t border-ivory-border">
            <label className="text-xs font-semibold uppercase text-ink-muted block mb-2">
              Verified Attribute
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CREDENTIALS.map((cred) => {
                const isSelected = selectedCredentials.includes(cred);
                return (
                  <button
                    key={cred}
                    type="button"
                    onClick={() => handleToggleCredential(cred)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isSelected
                        ? "bg-deep-forest text-warm-ivory border-deep-forest font-medium"
                        : "bg-warm-ivory border-ivory-border text-soft-ink"
                    }`}
                  >
                    {cred}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions: Apply & Reset */}
          <div className="pt-4 border-t border-ivory-border flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset All
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsMobileFilterOpen(false)}
              className="flex-1"
            >
              View {filteredProducts.length} Results
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, qty) => {
          addToCart(p, qty);
          setQuickViewProduct(null);
        }}
        isAdded={Boolean(
          quickViewProduct && cart.some((c) => c.id === quickViewProduct.id)
        )}
      />
    </div>
  );
};
