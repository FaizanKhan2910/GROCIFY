"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { ProductData } from "./ProductCard";
import { ImageContainer } from "../ui/ImageContainer";
import { Badge } from "../ui/Badge";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantitySelector } from "../ui/QuantitySelector";
import { Button } from "../ui/Button";
import { ShieldCheck, Truck, RotateCcw, Plus, Check } from "lucide-react";
import { MAX_PRODUCT_PRICE_INR } from "@/lib/business-rules";

export interface ProductQuickViewProps {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ProductData, quantity: number) => void;
  isAdded?: boolean;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isAdded = false,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.title}
      description={`Category: ${product.category} • Price Guaranteed ≤ ₹${MAX_PRODUCT_PRICE_INR}`}
      maxWidth="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left: Product Imagery */}
        <div className="relative">
          <ImageContainer
            src={product.imageUrl}
            alt={product.title}
            aspectRatio="square"
            className="rounded-md border border-ivory-border"
          />
          {product.ecoCredential && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="eco" size="md">
                {product.ecoCredential.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Right: Specifications & Commerce Actions */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                {product.category}
              </span>
              <h3 className="font-display text-xl font-bold text-soft-ink mt-0.5 leading-snug">
                {product.title}
              </h3>
              {product.unitDescription && (
                <p className="text-xs text-ink-muted mt-1">
                  {product.unitDescription}
                </p>
              )}
            </div>

            <div className="py-2 border-y border-ivory-border/70">
              <PriceDisplay
                sellingPrice={product.sellingPrice}
                originalPrice={product.originalPrice}
                size="lg"
              />
            </div>

            {/* Quality & Transparency Guarantees */}
            <div className="space-y-2 text-xs text-soft-ink/90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-deep-forest shrink-0" />
                <span>Zero artificial chemicals • Verified origin batch</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-deep-forest shrink-0" />
                <span>Eligible for Free Delivery on orders ₹499+</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-deep-forest shrink-0" />
                <span>Easy 7-day hassle-free replacement on transit damage</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-ivory-border/70 flex flex-col sm:flex-row items-center gap-3 mt-4">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-semibold text-soft-ink sm:hidden">
                Qty:
              </span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={8}
              />
            </div>

            <Button
              variant={isAdded ? "secondary" : "primary"}
              size="md"
              className="flex-1 w-full"
              onClick={handleAdd}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-deep-forest mr-1" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add {quantity} to Bag</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
