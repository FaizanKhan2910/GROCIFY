"use client";

import React from "react";
import { Plus, Check, Heart } from "lucide-react";
import { ImageContainer } from "../ui/ImageContainer";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";
import { Button } from "../ui/Button";
import { validateProductPrice } from "@/lib/business-rules";

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

  return (
    <article
      className={`group relative flex flex-col bg-warm-ivory border border-ivory-border rounded-md overflow-hidden hover:border-deep-forest/40 transition-all duration-200 hover:shadow-card ${className}`}
    >
      {/* Visual Container */}
      <div className="relative w-full overflow-hidden bg-ivory-muted/40">
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
            className="group-hover:scale-103 transition-transform duration-300"
          />
        </button>

        {/* Eco Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.ecoCredential && (
            <Badge
              variant={product.ecoCredential.verified ? "eco" : "neutral"}
              size="sm"
            >
              {product.ecoCredential.label}
            </Badge>
          )}
        </div>

        {/* Wishlist Button Overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from saved items`
              : `Save ${product.title} to wishlist`
          }
          className={`absolute top-2.5 right-2.5 z-10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer ${
            isWishlisted
              ? "bg-coral-pop text-deep-forest shadow-subtle"
              : "bg-warm-ivory/90 backdrop-blur-xs text-soft-ink hover:text-deep-forest hover:bg-warm-ivory shadow-subtle"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
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
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-ivory-border/70">
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

          <Button
            type="button"
            variant={isAdded ? "secondary" : "primary"}
            size="sm"
            onClick={() => onAddToCart?.(product)}
            aria-label={
              isAdded ? `Added ${product.title} to bag` : `Add ${product.title} to bag`
            }
            className="min-h-[44px] min-w-[44px] px-3 shrink-0"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-deep-forest stroke-[2.5]" aria-hidden="true" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
