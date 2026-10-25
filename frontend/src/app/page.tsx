"use client";

import React, { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Alert } from "@/components/ui/Alert";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SuccessState } from "@/components/ui/SuccessState";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { ProductCard, ProductData } from "@/components/marketplace/ProductCard";
import { CategoryTile } from "@/components/marketplace/CategoryTile";
import { CollectionHeader } from "@/components/marketplace/CollectionHeader";
import { FreeShippingProgress } from "@/components/marketplace/FreeShippingProgress";
import {
  MAX_PRODUCT_PRICE_INR,
  FREE_SHIPPING_THRESHOLD_INR,
  STANDARD_SHIPPING_FEE_INR,
  calculateShipping,
  UNCONFIRMED_COMMERCE_POLICIES,
} from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";
import { ArrowRight } from "lucide-react";

const DEMO_PRODUCTS: ProductData[] = [
  {
    id: "prod-1",
    title: "Handmade Neem Wood Wide-Tooth Comb",
    slug: "neem-wood-wide-tooth-comb",
    category: "Personal Care",
    sellingPrice: 249,
    originalPrice: 299,
    imageUrl: "https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?auto=format&fit=crop&w=600&q=80",
    ecoCredential: {
      label: "Zero Plastic",
      verified: true,
    },
    unitDescription: "Single artisan piece • 100% Seasoned Neem",
    isInStock: true,
  },
  {
    id: "prod-2",
    title: "Plant-Fiber Scrub Brushes (Set of 3)",
    slug: "plant-fiber-scrub-brush-set",
    category: "Kitchen & Home",
    sellingPrice: 429,
    originalPrice: 499,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    ecoCredential: {
      label: "Compostable",
      verified: true,
    },
    unitDescription: "Coconut coir & sisal bristles • Beechwood handle",
    isInStock: true,
  },
  {
    id: "prod-3",
    title: "Cold-Pressed Mustard Oil in Glass Jar",
    slug: "cold-pressed-mustard-oil-glass",
    category: "Pantry Essentials",
    sellingPrice: 380,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    ecoCredential: {
      label: "Glass Packaged",
      verified: true,
    },
    unitDescription: "500ml • Traditional Kolhu Pressed",
    isInStock: true,
  },
  {
    id: "prod-4",
    title: "Pure Copper Tongue Scraper with Cotton Pouch",
    slug: "pure-copper-tongue-scraper",
    category: "Personal Care",
    sellingPrice: 199,
    originalPrice: 249,
    imageUrl: "https://images.unsplash.com/photo-1608248597359-57303c73f324?auto=format&fit=crop&w=600&q=80",
    ecoCredential: {
      label: "Ayurvedic Grade",
      verified: true,
    },
    unitDescription: "100% Antimicrobial Copper • Lifetime Durability",
    isInStock: true,
  },
];

export default function Home() {
  // Interactive test state
  const [cartItems, setCartItems] = useState<ProductData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "info" | "error">("success");
  const [selectedChip, setSelectedChip] = useState("all");
  const [demoQuantity, setDemoQuantity] = useState(1);
  const [demoCheckbox, setDemoCheckbox] = useState(true);
  const [interactiveSubtotal, setInteractiveSubtotal] = useState(380);

  const handleAddToCart = (product: ProductData) => {
    setCartItems((prev) => [...prev, product]);
    setInteractiveSubtotal((prev) => prev + product.sellingPrice);
    setToastVariant("success");
    setToastMessage(`Added "${product.title}" to bag`);
  };

  const handleOpenCart = () => {
    setIsDrawerOpen(true);
  };

  const currentCartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.sellingPrice,
    0
  );

  const cartShipping = calculateShipping(currentCartSubtotal);

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory selection:bg-electric-citrus selection:text-deep-forest">
      {/* Universal Header */}
      <Header
        cartCount={cartItems.length}
        onOpenCart={handleOpenCart}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Foundation Hero Banner */}
        <section className="mb-12 border border-ivory-border rounded-lg bg-warm-ivory p-6 sm:p-10 shadow-card">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="eco" size="md">
                Design System Foundation
              </Badge>
              <Badge variant="verified" size="md">
                Ready for Screen 01
              </Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-soft-ink tracking-tight leading-[1.1] mb-4">
              A distinctive, eco-conscious marketplace for everyday India.
            </h1>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed mb-6">
              GROCIFY is an art-directed, product-led marketplace designed with uncompromising commercial discipline: strict price cap of ₹{MAX_PRODUCT_PRICE_INR}, transparent delivery rules, zero misleading claims, and tactile warm aesthetics.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsModalOpen(true)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect Commercial Policy
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsDrawerOpen(true)}
              >
                View Bag & Shipping Drawer ({cartItems.length})
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 1: Brand Tokens & Color Palette */}
        <section className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              Design Token System
            </span>
            <h2 className="font-display text-2xl font-bold text-soft-ink mt-1">
              Core Brand Palette
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                name: "Deep Forest",
                hex: "#173D2D",
                bg: "bg-deep-forest",
                text: "text-warm-ivory",
                role: "Primary Brand / Navigation",
              },
              {
                name: "Electric Citrus",
                hex: "#C8E66B",
                bg: "bg-electric-citrus",
                text: "text-deep-forest",
                role: "Accent / Verification",
              },
              {
                name: "Warm Ivory",
                hex: "#F8F6EF",
                bg: "bg-warm-ivory",
                text: "text-soft-ink",
                role: "Canvas / Surface Base",
                border: "border border-ivory-border",
              },
              {
                name: "Coral Pop",
                hex: "#F0A7A0",
                bg: "bg-coral-pop",
                text: "text-deep-forest",
                role: "Action / Value Accent",
              },
              {
                name: "Butter Yellow",
                hex: "#F5CF63",
                bg: "bg-butter-yellow",
                text: "text-deep-forest",
                role: "Highlight / Fresh Tag",
              },
              {
                name: "Soft Ink",
                hex: "#242820",
                bg: "bg-soft-ink",
                text: "text-warm-ivory",
                role: "Primary Text & Contrast",
              },
            ].map((token) => (
              <div
                key={token.name}
                className="flex flex-col rounded-md overflow-hidden border border-ivory-border bg-warm-ivory shadow-subtle"
              >
                <div
                  className={`h-24 flex items-end p-3 font-mono text-xs font-bold ${token.bg} ${token.text} ${token.border || ""}`}
                >
                  {token.hex}
                </div>
                <div className="p-3">
                  <h4 className="font-display font-semibold text-xs text-soft-ink">
                    {token.name}
                  </h4>
                  <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">
                    {token.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Typography & Spacing Scale */}
        <section className="mb-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-md border border-ivory-border bg-warm-ivory">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-3">
              Typography Hierarchy
            </span>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-mono text-ink-subtle">
                  Space Grotesk • Display Heading
                </p>
                <h3 className="font-display text-2xl font-bold text-soft-ink">
                  Art-Directed Indian Marketplace
                </h3>
              </div>
              <div>
                <p className="text-[11px] font-mono text-ink-subtle">
                  Inter • Body & Interface
                </p>
                <p className="font-body text-sm text-ink-muted leading-relaxed">
                  Every product has been vetted for verified sustainability claims, mindful production, and honest pricing with zero artificial markup.
                </p>
              </div>
              <div>
                <p className="text-[11px] font-mono text-ink-subtle">
                  Microcopy & Monospace Meta
                </p>
                <p className="font-mono text-xs text-deep-forest">
                  ₹499 FREE SHIPPING • ₹1,000 MAX CAP • HOW NETWORKS
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-md border border-ivory-border bg-warm-ivory">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-3">
              Spacing Scale & Touch Targets
            </span>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-ivory-border pb-2">
                <span className="font-medium text-soft-ink">Base Increment</span>
                <span className="font-mono text-deep-forest">4px (Rem multiplier)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-ivory-border pb-2">
                <span className="font-medium text-soft-ink">Minimum Touch Target</span>
                <span className="font-mono text-deep-forest">44px × 44px (Strict)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-ivory-border pb-2">
                <span className="font-medium text-soft-ink">Content Margin (Mobile)</span>
                <span className="font-mono text-deep-forest">16px – 20px</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-ivory-border pb-2">
                <span className="font-medium text-soft-ink">Content Margin (Desktop)</span>
                <span className="font-mono text-deep-forest">32px (Max 1280px)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-soft-ink">Motion Accessibility</span>
                <span className="font-mono text-deep-forest">prefers-reduced-motion</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Central Business Rules & Shipping Engine */}
        <section className="mb-14 p-6 sm:p-8 rounded-lg border border-ivory-border bg-forest-subtle/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-deep-forest">
                Centralized Commerce Rules
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-deep-forest mt-1">
                Verified Pricing & Free Shipping Engine
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="verified">Ceiling: ₹{MAX_PRODUCT_PRICE_INR}</Badge>
              <Badge variant="eco">Threshold: ₹{FREE_SHIPPING_THRESHOLD_INR}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-md bg-warm-ivory border border-ivory-border">
              <h4 className="font-display font-semibold text-sm text-soft-ink mb-1">
                Rule 1: ₹1,000 Price Ceiling
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                GROCIFY strictly rejects catalog items exceeding ₹1,000. Verified server-side and client-side via business-rules engine.
              </p>
            </div>

            <div className="p-4 rounded-md bg-warm-ivory border border-ivory-border">
              <h4 className="font-display font-semibold text-sm text-soft-ink mb-1">
                Rule 2: ₹499 Free Shipping
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Orders &lt; ₹499 incur flat ₹{STANDARD_SHIPPING_FEE_INR} delivery fee. Orders ₹{FREE_SHIPPING_THRESHOLD_INR}+ qualify for free delivery across India.
              </p>
            </div>

            <div className="p-4 rounded-md bg-warm-ivory border border-ivory-border">
              <h4 className="font-display font-semibold text-sm text-soft-ink mb-1">
                Rule 3: Unconfirmed Policies ({UNCONFIRMED_COMMERCE_POLICIES.PREPAID_INCENTIVE.status})
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Prepaid incentives ({UNCONFIRMED_COMMERCE_POLICIES.PREPAID_INCENTIVE.description}) & COD rules remain unconfirmed until explicitly approved.
              </p>
            </div>
          </div>

          {/* Live Dynamic Calculator */}
          <div className="bg-warm-ivory p-5 rounded-md border border-ivory-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-soft-ink block">
                  Interactive Shipping Calculator Test:
                </span>
                <span className="text-xs text-ink-muted">
                  Simulate basket subtotal to test dynamic threshold calculations:
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[199, 380, 499, 750].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setInteractiveSubtotal(amount)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      interactiveSubtotal === amount
                        ? "bg-deep-forest text-warm-ivory border-deep-forest"
                        : "bg-warm-ivory text-soft-ink border-ivory-border hover:bg-ivory-muted"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            <FreeShippingProgress currentSubtotal={interactiveSubtotal} />
          </div>
        </section>

        {/* SECTION 4: Interactive Component Library */}
        <section className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              UI System
            </span>
            <h2 className="font-display text-2xl font-bold text-soft-ink mt-1">
              Component Foundation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Matrix */}
            <div className="p-6 rounded-md border border-ivory-border bg-warm-ivory space-y-6">
              <div>
                <h4 className="font-display font-bold text-base text-soft-ink mb-1">
                  Buttons & Interactive States
                </h4>
                <p className="text-xs text-ink-muted mb-4">
                  Touch targets strictly ≥ 44px with keyboard focus rings.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="accent">Accent</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-border">
                <span className="text-xs font-semibold text-soft-ink block mb-2">
                  Special States:
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" isLoading>
                    Loading State
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled State
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setToastVariant("info");
                      setToastMessage("Toast triggered from demo button!");
                    }}
                  >
                    Trigger Toast
                  </Button>
                </div>
              </div>
            </div>

            {/* Form & Selection Controls */}
            <div className="p-6 rounded-md border border-ivory-border bg-warm-ivory space-y-5">
              <h4 className="font-display font-bold text-base text-soft-ink mb-1">
                Form Inputs & Selectors
              </h4>

              <SearchInput
                placeholder="Search products in catalogue..."
                value=""
                onChange={() => {}}
              />

              <Input
                label="Postal Code (Pincode)"
                placeholder="e.g. 560001"
                helperText="Delivery available to over 19,000 pin codes across India"
              />

              <div>
                <span className="text-xs font-semibold text-soft-ink block mb-2">
                  Price Display Formatting (₹ INR):
                </span>
                <div className="flex flex-wrap gap-4 items-center">
                  <PriceDisplay sellingPrice={249} originalPrice={299} size="sm" />
                  <PriceDisplay sellingPrice={499} originalPrice={699} size="md" />
                  <PriceDisplay sellingPrice={999} size="lg" />
                </div>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span className="text-xs font-semibold text-soft-ink block mb-1.5">
                    Quantity Selector (44px target):
                  </span>
                  <QuantitySelector
                    value={demoQuantity}
                    onChange={setDemoQuantity}
                    min={1}
                    max={10}
                  />
                </div>

                <div className="pt-4">
                  <Checkbox
                    label="Plastic-free packaging"
                    description="Shipped in 100% corrugated paper mailer"
                    checked={demoCheckbox}
                    onChange={(e) => setDemoCheckbox(e.target.checked)}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-soft-ink block mb-2">
                  Filter Chips:
                </span>
                <div className="flex flex-wrap gap-2">
                  {["all", "kitchen", "body", "certified"].map((chip) => (
                    <Chip
                      key={chip}
                      selected={selectedChip === chip}
                      onClick={() => setSelectedChip(chip)}
                      count={chip === "all" ? 18 : 6}
                    >
                      {chip.toUpperCase()}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Badges, Alerts, Feedback States */}
        <section className="mb-14 space-y-6">
          <div className="p-6 rounded-md border border-ivory-border bg-warm-ivory">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted block mb-3">
              Badge & Verification System
            </span>
            <div className="flex flex-wrap gap-3">
              <Badge variant="eco">Zero Plastic</Badge>
              <Badge variant="verified">NPOP Organic</Badge>
              <Badge variant="new">New Curation</Badge>
              <Badge variant="value">Save 20%</Badge>
              <Badge variant="alert">Low Inventory</Badge>
              <Badge variant="neutral">Batch #2409</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert
              variant="info"
              title="Verified Sourcing"
              description="All products on GROCIFY must pass laboratory authenticity testing before listing."
            />
            <Alert
              variant="success"
              title="Carbon Neutral Logistics"
              description="HOW Networks offsets 100% of last-mile dispatch emissions via certified regional reforestation."
            />
          </div>

          {/* Skeletons & Lifecycle States */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-md border border-ivory-border bg-warm-ivory">
              <h5 className="font-display font-semibold text-sm mb-3">Loading Skeletons</h5>
              <div className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>

            <EmptyState
              title="Your Bag is Empty"
              description="Explore everyday essentials with verified green credentials."
              actionLabel="Discover Essentials"
              onAction={() => {
                setToastVariant("info");
                setToastMessage("Redirecting to discovery catalogue...");
              }}
            />

            <ErrorState
              title="Network Interrupted"
              message="Unable to refresh stock availability for selected postal code."
              retryLabel="Retry"
              onRetry={() => {
                setToastVariant("info");
                setToastMessage("Reconnecting to inventory node...");
              }}
            />

            <SuccessState
              title="Order Confirmed"
              message="Your package is packed in recycled mailers and dispatched."
              actionLabel="View Tracking"
              onAction={() => {
                setToastVariant("success");
                setToastMessage("Tracking view opened.");
              }}
            />
          </div>
        </section>

        {/* SECTION 6: Marketplace Grid Demo */}
        <section className="mb-14">
          <CollectionHeader
            title="Mindful Everyday Curations"
            subtitle="Curated, practical tools for Indian homes. Tested for durability, verified for eco claims, and strictly under ₹1,000."
            totalCount={DEMO_PRODUCTS.length}
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Marketplace", href: "/category" },
              { label: "Curated Everyday Goods" },
            ]}
          />

          {/* Responsive Product Grid: 2 cols on mobile, 3 to 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {DEMO_PRODUCTS.map((product) => {
              const isAdded = cartItems.some((item) => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdded={isAdded}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        </section>

        {/* SECTION 7: Category Visual Exploration */}
        <section className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">
              Art-Directed Categories
            </span>
            <h2 className="font-display text-2xl font-bold text-soft-ink mt-1">
              Explore By Daily Ritual
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryTile
              title="Kitchen & Pantry"
              tagline="Pure ingredients & compostable tools"
              itemCount={28}
              slug="kitchen-pantry"
              accentColor="#C8E66B"
            />
            <CategoryTile
              title="Personal Care"
              tagline="Plastic-free oral & hair wellness"
              itemCount={19}
              slug="personal-care"
              accentColor="#F0A7A0"
            />
            <CategoryTile
              title="Home & Clean"
              tagline="Bio-enzymes & zero-toxic cleaners"
              itemCount={14}
              slug="home-clean"
              accentColor="#F5CF63"
            />
            <CategoryTile
              title="Reusables & Travel"
              tagline="Copper, unbleached cotton & steel"
              itemCount={22}
              slug="reusables"
              accentColor="#173D2D"
            />
          </div>
        </section>
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-ivory-border bg-warm-ivory py-10 px-4 sm:px-6 lg:px-8 text-xs text-ink-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-deep-forest">
              GROCIFY
            </span>
            <span>• An initiative of HOW Networks</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>₹1,000 MAX PRICE</span>
            <span>•</span>
            <span>FREE SHIPPING ₹499+</span>
            <span>•</span>
            <span>INDIA</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="GROCIFY Commercial & Quality Charter"
        description="Core tenets established for the India-focused mindful marketplace"
      >
        <div className="space-y-4 text-xs text-soft-ink leading-relaxed">
          <div className="p-3 rounded-md bg-forest-subtle border border-deep-forest/20">
            <strong className="text-deep-forest block mb-1">1. Price Cap Guarantee</strong>
            No item on GROCIFY will ever be sold for more than ₹1,000. Premium eco-conscious living must remain accessible.
          </div>
          <div className="p-3 rounded-md bg-yellow-subtle border border-butter-yellow">
            <strong className="text-soft-ink block mb-1">2. Transparent Shipping</strong>
            Orders below ₹499 incur flat ₹59 shipping. Orders ₹499 and above receive free standard delivery across all reachable Indian pin codes.
          </div>
          <div className="p-3 rounded-md bg-coral-subtle border border-coral-pop/40">
            <strong className="text-soft-ink block mb-1">3. Zero Fake Scarcity</strong>
            We will never display artificial countdown timers, fake reviews, or fabricated stock scarcity warnings.
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Acknowledge & Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Interactive Cart Drawer Demo */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Your Mindful Bag (${cartItems.length})`}
        position="right"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <FreeShippingProgress currentSubtotal={currentCartSubtotal} />

            {cartItems.length === 0 ? (
              <EmptyState
                title="Your bag is empty"
                description="Add items from the curations on the page to test the interactive bag and shipping calculator."
                actionLabel="Explore Items"
                onAction={() => setIsDrawerOpen(false)}
              />
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center justify-between p-3 rounded-md border border-ivory-border bg-warm-ivory"
                  >
                    <div>
                      <h5 className="font-display font-semibold text-xs text-soft-ink line-clamp-1">
                        {item.title}
                      </h5>
                      <span className="text-[11px] text-ink-muted">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-xs text-deep-forest">
                      {formatRupees(item.sellingPrice)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="pt-4 border-t border-ivory-border space-y-3 mt-6">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Subtotal</span>
                <span>{formatRupees(currentCartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Delivery</span>
                <span>
                  {cartShipping.isFreeShipping
                    ? "FREE"
                    : formatRupees(cartShipping.shippingFeeInr)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-soft-ink pt-2 border-t border-ivory-border">
                <span>Total</span>
                <span className="text-deep-forest font-mono">
                  {formatRupees(currentCartSubtotal + cartShipping.shippingFeeInr)}
                </span>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setToastVariant("success");
                  setToastMessage("Foundation demo verified: Order checkout ready for implementation in next phase.");
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </Drawer>

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
