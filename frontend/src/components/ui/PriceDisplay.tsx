import React from "react";
import { formatRupees, calculateSavings } from "@/lib/formatters";
import { MAX_PRODUCT_PRICE_INR } from "@/lib/business-rules";

export interface PriceDisplayProps {
  sellingPrice: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  showSavingsTag?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    selling: "text-sm font-semibold",
    original: "text-xs",
    tag: "text-[10px] px-1.5 py-0.5",
  },
  md: {
    selling: "text-lg font-bold font-display",
    original: "text-sm",
    tag: "text-xs px-2 py-0.5",
  },
  lg: {
    selling: "text-2xl font-bold font-display tracking-tight",
    original: "text-base",
    tag: "text-xs px-2.5 py-0.5",
  },
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  sellingPrice,
  originalPrice,
  size = "md",
  showSavingsTag = true,
  className = "",
}) => {
  // Validate against ceiling
  const isCappedExceeded = sellingPrice > MAX_PRODUCT_PRICE_INR;
  const cfg = sizeConfig[size];

  const savings =
    originalPrice && originalPrice > sellingPrice
      ? calculateSavings(originalPrice, sellingPrice)
      : null;

  return (
    <div className={`inline-flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`text-deep-forest ${cfg.selling}`}>
        {formatRupees(sellingPrice)}
      </span>

      {savings && savings.hasDiscount && (
        <>
          <span
            className={`line-through text-ink-subtle ${cfg.original}`}
            aria-label={`Original price: ${formatRupees(originalPrice!)}`}
          >
            {formatRupees(originalPrice!)}
          </span>
          {showSavingsTag && (
            <span
              className={`font-mono uppercase font-semibold text-deep-forest bg-citrus-muted rounded-xs ${cfg.tag}`}
              aria-label={`${savings.percentageSaved}% savings`}
            >
              Save {savings.percentageSaved}%
            </span>
          )}
        </>
      )}

      {isCappedExceeded && (
        <span className="text-[10px] text-coral-hover font-medium">
          [Price exceeds ₹{MAX_PRODUCT_PRICE_INR} cap]
        </span>
      )}
    </div>
  );
};
