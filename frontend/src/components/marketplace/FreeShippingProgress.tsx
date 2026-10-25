import React from "react";
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
      className={`p-3.5 rounded-md border border-ivory-border bg-warm-ivory text-xs ${className}`}
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

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-ivory-border rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={calculation.progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-deep-forest transition-all duration-300 rounded-full"
          style={{ width: `${calculation.progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
