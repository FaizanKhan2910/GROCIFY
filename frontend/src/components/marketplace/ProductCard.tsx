"use client";

/**
 * ============================================================================
 * GROCIFY 3D PRODUCT CARD
 * ============================================================================
 * Features:
 * - 3D card tilt (±8 deg) with dynamic moving specular glare highlight (CardTilt)
 * - Eco credential badge slide-in
 * - Wishlist heart scale pop & 6-dot radial particle burst (WishlistBurst)
 * - Add-to-cart curved parabolic image flight into header shopping bag (useCartFlight)
 * - Add button morphs to checkmark
 * - Accessible focus rings & 44px minimum touch targets
 * ============================================================================
 */

import React, { useRef } from "react";
import { Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageContainer } from "../ui/ImageContainer";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";
import { Button } from "../ui/Button";
import { validateProductPrice } from "@/lib/business-rules";
import { CardTilt } from "../motion/CardTilt";
import { WishlistBurst } from "../motion/WishlistBurst";
import { useCartFlight } from "../motion/CartFlightContext";

export interface ProductData {
  id: string;
  title: string;
  slug: string;
  category: string;
  sellingPrice: number;
  originalPrice?: number;
  imageUrl: string;
  ecoCredential?: {
    label: string;
    verified: boolean;
  };
  unitDescription?: string;
  isInStock?: boolean;
  model3d?: string;
  cutout?: string;
  heroBottle?: boolean;
  heroSale?: boolean;
}

export interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (product: ProductData) => void;
  onToggleWishlist?: (product: ProductData) => void;
  onQuickView?: (product: ProductData) => void;
  isAdded?: boolean;
  isWishlisted?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isAdded = false,
  isWishlisted = false,
  className = "",
}) => {
  const priceValidation = validateProductPrice(product.sellingPrice);
  const imgRef = useRef<HTMLDivElement>(null);
  const { flyToCart } = useCartFlight();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imgRef.current) {
      flyToCart(product.imageUrl, imgRef.current);
    }
    onAddToCart?.(product);
  };

  return (
    <CardTilt className={className}>
      <article className="group relative flex flex-col h-full bg-warm-ivory border border-ivory-border rounded-xl overflow-hidden hover:border-deep-forest/40 transition-shadow duration-300 hover:shadow-card-hover select-none">
        {/* Visual Container */}
        <div ref={imgRef} className="relative w-full overflow-hidden bg-ivory-muted/40">
          <button
            type="button"
            onClick={() => onQuickView?.(product)}
            aria-label={`View details for ${product.title}`}
            className="w-full text-left block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
          >
            <ImageContainer
              src={product.imageUrl}
              alt={product.title}
              aspectRatio="portrait"
              className="group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </button>

          {/* Eco Badge Overlay (Slides in from left) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.ecoCredential && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Badge
                  variant={product.ecoCredential.verified ? "eco" : "neutral"}
                  size="sm"
                  className="shadow-subtle"
                >
                  {product.ecoCredential.label}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Wishlist Button Overlay with Particle Burst */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <WishlistBurst
              isWishlisted={isWishlisted}
              onToggle={() => onToggleWishlist?.(product)}
              title={product.title}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col flex-1 p-4">
          {/* Category Tag */}
          <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-1">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-display font-semibold text-sm sm:text-base text-soft-ink line-clamp-2 mb-1.5 leading-snug group-hover:text-deep-forest transition-colors">
            <button
              type="button"
              onClick={() => onQuickView?.(product)}
              className="text-left hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-deep-forest rounded-xs"
            >
              {product.title}
            </button>
          </h3>

          {/* Unit / Sizing Notes */}
          {product.unitDescription && (
            <p className="text-xs text-ink-subtle mb-3 line-clamp-1">
              {product.unitDescription}
            </p>
          )}

          {/* Price & Action Row */}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-ivory-border/70">
            <div>
              <PriceDisplay
                sellingPrice={product.sellingPrice}
                originalPrice={product.originalPrice}
                size="sm"
              />
              {!priceValidation.isValid && (
                <p className="text-[10px] text-coral-hover font-semibold">
                  Invalid price rule
                </p>
              )}
            </div>

            {/* Add to Cart Button (Morphs to Checkmark) */}
            <Button
              type="button"
              variant={isAdded ? "secondary" : "primary"}
              size="sm"
              onClick={handleAdd}
              aria-label={
                isAdded ? `Added ${product.title} to bag` : `Add ${product.title} to bag`
              }
              className="min-h-[44px] min-w-[44px] px-3.5 shrink-0 transition-transform active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-deep-forest stroke-[2.5]" aria-hidden="true" />
                    <span className="hidden sm:inline font-semibold">Added</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span className="hidden sm:inline font-semibold">Add</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </article>
    </CardTilt>
  );
};
