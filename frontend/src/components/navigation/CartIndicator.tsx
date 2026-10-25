"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

export interface CartIndicatorProps {
  itemCount: number;
  onClick?: () => void;
  className?: string;
}

export const CartIndicator: React.FC<CartIndicatorProps> = ({
  itemCount,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className={`relative min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md border border-ivory-border bg-warm-ivory text-soft-ink hover:text-deep-forest hover:border-deep-forest/30 hover:bg-ivory-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest cursor-pointer ${className}`}
    >
      <ShoppingBag className="w-5 h-5 stroke-[1.8]" />

      {itemCount > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-deep-forest text-warm-ivory text-[11px] font-bold font-mono flex items-center justify-center leading-none shadow-subtle border-2 border-warm-ivory"
          aria-hidden="true"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
};
