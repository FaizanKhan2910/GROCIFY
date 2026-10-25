/**
 * GROCIFY Core Business Rules Engine
 *
 * All pricing, delivery, and commerce policies must be declared centrally here.
 * Component layers must consume these rules rather than hardcoding business thresholds.
 */

export const MAX_PRODUCT_PRICE_INR = 1000;
export const FREE_SHIPPING_THRESHOLD_INR = 499;
export const STANDARD_SHIPPING_FEE_INR = 59;

export interface PriceValidationResult {
  isValid: boolean;
  error?: string;
  maxAllowed: number;
}

/**
 * Enforces the strict ₹1,000 ceiling on all catalog products.
 * Must be validated server-side during ingest/checkout as well as client-side.
 */
export function validateProductPrice(priceInr: number): PriceValidationResult {
  if (typeof priceInr !== "number" || isNaN(priceInr)) {
    return {
      isValid: false,
      error: "Product price must be a valid number.",
      maxAllowed: MAX_PRODUCT_PRICE_INR,
    };
  }

  if (priceInr <= 0) {
    return {
      isValid: false,
      error: "Product price must be greater than ₹0.",
      maxAllowed: MAX_PRODUCT_PRICE_INR,
    };
  }

  if (priceInr > MAX_PRODUCT_PRICE_INR) {
    return {
      isValid: false,
      error: `Product selling price (₹${priceInr}) exceeds the GROCIFY maximum limit of ₹${MAX_PRODUCT_PRICE_INR}.`,
      maxAllowed: MAX_PRODUCT_PRICE_INR,
    };
  }

  return {
    isValid: true,
    maxAllowed: MAX_PRODUCT_PRICE_INR,
  };
}

export interface ShippingCalculation {
  subtotalInr: number;
  shippingFeeInr: number;
  isFreeShipping: boolean;
  thresholdInr: number;
  amountNeededForFreeShipping: number;
  progressPercentage: number;
}

/**
 * Evaluates shipping cost for order subtotal based on the approved threshold:
 * - Orders < ₹499 incur ₹59 delivery fee
 * - Orders >= ₹499 qualify for complimentary delivery
 */
export function calculateShipping(subtotalInr: number): ShippingCalculation {
  const safeSubtotal = Math.max(0, subtotalInr);
  const isFree = safeSubtotal >= FREE_SHIPPING_THRESHOLD_INR;
  const shippingFee = isFree ? 0 : STANDARD_SHIPPING_FEE_INR;
  const needed = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - safeSubtotal);
  const progress = Math.min(
    100,
    Math.round((safeSubtotal / FREE_SHIPPING_THRESHOLD_INR) * 100)
  );

  return {
    subtotalInr: safeSubtotal,
    shippingFeeInr: shippingFee,
    isFreeShipping: isFree,
    thresholdInr: FREE_SHIPPING_THRESHOLD_INR,
    amountNeededForFreeShipping: needed,
    progressPercentage: progress,
  };
}

/**
 * UNCONFIRMED BUSINESS DECISION REGISTRY
 * Policies marked here require executive sign-off from HOW Networks before activating in checkout.
 */
export const UNCONFIRMED_COMMERCE_POLICIES = {
  PREPAID_INCENTIVE: {
    status: "UNCONFIRMED" as const,
    description: "Proposed 5% instant discount on UPI/prepaid payments",
    enabled: false,
    notes: "Requires commercial verification of payment gateway fees vs margin impact.",
  },
  COD_RESTRICTIONS: {
    status: "UNCONFIRMED" as const,
    description: "Proposed COD surcharge or restriction for high-RTO postal codes",
    enabled: false,
    notes: "Requires pincode-level logistics RTO analysis before enforcement.",
  },
} as const;
