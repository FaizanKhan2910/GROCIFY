"use client";

/**
 * ============================================================================
 * GROCIFY FREE SHIPPING PROGRESS
 * ============================================================================
 * Animates live threshold progress (₹499 ceiling) with spring-loaded bar.
 *
 * TUNABLE PARAMETERS:
 * - SPRING_STIFFNESS: 140
 * - SPRING_DAMPING: 20
 * ============================================================================
 */

import React from "react";
import { motion } from "framer-motion";
import { Truck, CheckCircle2 } from "lucide-react";
import { calculateShipping } from "@/lib/business-rules";
import { formatRupees } from "@/lib/formatters";

export interface FreeShippingProgressProps {
  currentSubtotal: number;
  className?: string;
}

export const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({
  currentSubtotal,
  className = "",
}) => {
  const calculation = calculateShipping(currentSubtotal);

  return (
    <div
      className={`p-3.5 rounded-md border border-ivory-border bg-warm-ivory text-xs shadow-subtle ${className}`}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 font-medium text-soft-ink">
          {calculation.isFreeShipping ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-deep-forest" aria-hidden="true" />
              <span className="font-semibold text-deep-forest">
                Complimentary delivery unlocked!
              </span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              <span>
                Add{" "}
                <strong className="text-deep-forest">
                  {formatRupees(calculation.amountNeededForFreeShipping)}
                </strong>{" "}
                more to unlock free shipping
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-mono text-ink-muted">
          Goal: {formatRupees(calculation.thresholdInr)}
        </span>
      </div>

      {/* Animated Spring Progress Bar */}
      <div
        className="w-full h-1.5 bg-ivory-border rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={calculation.progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-deep-forest rounded-full shadow-[0_0_8px_rgba(23,61,45,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${calculation.progressPercentage}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
        />
      </div>
    </div>
  );
};
