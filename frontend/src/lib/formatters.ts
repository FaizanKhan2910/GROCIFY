/**
 * Consistent Indian Rupee Currency & Formatting Helpers
 */

/**
 * Formats a numeric amount to Indian Rupee representation (e.g. ₹999 or ₹1,000)
 * Uses en-IN locale grouping standards (lakh/crore conventions where applicable).
 */
export function formatRupees(amount: number, showDecimals = false): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "₹0";
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}

/**
 * Calculates genuine percentage discount without deceptive roundings.
 */
export function calculateSavings(
  originalPrice: number,
  sellingPrice: number
): {
  amountSaved: number;
  percentageSaved: number;
  hasDiscount: boolean;
} {
  if (originalPrice <= sellingPrice || originalPrice <= 0) {
    return {
      amountSaved: 0,
      percentageSaved: 0,
      hasDiscount: false,
    };
  }

  const diff = originalPrice - sellingPrice;
  const percent = Math.round((diff / originalPrice) * 100);

  return {
    amountSaved: diff,
    percentageSaved: percent,
    hasDiscount: true,
  };
}
