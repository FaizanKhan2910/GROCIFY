import { ProductData } from "@/components/marketplace/ProductCard";

export interface ComboResult {
  saleProducts: ProductData[];
  totalSalePrice: number;
  totalOriginalPrice: number;
  totalSaved: number;
  savingsPercent: number;
  showCombo: boolean;
}

/**
 * Pure calculation of percentage discount.
 * Never hardcoded. Always derived from sellingPrice and originalPrice.
 */
export function calculateDiscountPercent(sellingPrice: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= sellingPrice) return 0;
  return Math.round((1 - sellingPrice / originalPrice) * 100);
}

/**
 * Select the hero bottle:
 * 1. Product explicitly flagged with `heroBottle: true`
 * 2. Or the first Kitchen & Pantry product with "oil" in its title (e.g. Cold-Pressed Mustard Oil, 500 ml)
 * 3. Or the first product packaged in glass
 * 4. Or the first product in the catalog
 */
export function selectHeroBottle(products: ProductData[]): ProductData | null {
  if (!products || products.length === 0) return null;

  // 1. Explicit override
  const explicitBottle = products.find((p) => p.heroBottle === true);
  if (explicitBottle) return explicitBottle;

  // 2. Kitchen & Pantry oil product
  const oilProduct = products.find(
    (p) =>
      p.category.toLowerCase().includes("kitchen") &&
      p.title.toLowerCase().includes("oil")
  );
  if (oilProduct) return oilProduct;

  // 3. Glass-packaged product
  const glassProduct = products.find(
    (p) =>
      p.ecoCredential?.label.toLowerCase().includes("glass") ||
      p.unitDescription?.toLowerCase().includes("glass")
  );
  if (glassProduct) return glassProduct;

  // 4. Default fallback
  return products[0];
}

/**
 * Select N on-sale items (default N = 3, supports 2-4):
 * - Must have originalPrice > sellingPrice and an image
 * - Sorted by discount % descending
 * - Priority given to items with `heroSale: true`
 * - Prefers different categories for visual and ritual variety
 */
export function selectSaleProducts(products: ProductData[], n = 3): ProductData[] {
  const targetN = Math.max(2, Math.min(4, n));
  if (!products || products.length === 0) return [];

  // Exclude the hero bottle from being its own sale flyer if possible
  const bottle = selectHeroBottle(products);

  // Eligible sale items
  const eligible = products.filter(
    (p) =>
      p.originalPrice &&
      p.originalPrice > p.sellingPrice &&
      Boolean(p.imageUrl) &&
      (!bottle || p.id !== bottle.id)
  );

  if (eligible.length === 0) return [];

  // Sort by heroSale override first, then discount percentage (descending)
  const sorted = [...eligible].sort((a, b) => {
    if (a.heroSale && !b.heroSale) return -1;
    if (!a.heroSale && b.heroSale) return 1;

    const discA = calculateDiscountPercent(a.sellingPrice, a.originalPrice);
    const discB = calculateDiscountPercent(b.sellingPrice, b.originalPrice);
    return discB - discA;
  });

  // Prefer different categories
  const selected: ProductData[] = [];
  const usedCategories = new Set<string>();

  // First pass: Pick items from distinct categories
  for (const item of sorted) {
    if (selected.length >= targetN) break;
    if (!usedCategories.has(item.category)) {
      selected.push(item);
      usedCategories.add(item.category);
    }
  }

  // Second pass: If still under targetN, fill from remaining sorted items
  for (const item of sorted) {
    if (selected.length >= targetN) break;
    if (!selected.some((s) => s.id === item.id)) {
      selected.push(item);
    }
  }

  return selected;
}

/**
 * Calculate the Daily Ritual Combo totals and combined savings.
 * Returns showCombo = true only if N >= 2.
 */
export function calculateCombo(saleProducts: ProductData[]): ComboResult {
  const count = saleProducts.length;
  const totalSalePrice = saleProducts.reduce((sum, p) => sum + p.sellingPrice, 0);
  const totalOriginalPrice = saleProducts.reduce(
    (sum, p) => sum + (p.originalPrice ?? p.sellingPrice),
    0
  );
  const totalSaved = Math.max(0, totalOriginalPrice - totalSalePrice);
  const savingsPercent =
    totalOriginalPrice > 0 ? Math.round((totalSaved / totalOriginalPrice) * 100) : 0;

  return {
    saleProducts,
    totalSalePrice,
    totalOriginalPrice,
    totalSaved,
    savingsPercent,
    showCombo: count >= 2,
  };
}

/**
 * Returns sale end time if configured via environment or null.
 * Never invents a fake countdown.
 */
export function getSaleEndTime(): string | null {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SALE_ENDS_AT) {
    return process.env.NEXT_PUBLIC_SALE_ENDS_AT;
  }
  return null;
}

/**
 * Dev-only validator to check if sale item photos accurately match their titles.
 * Emits console warnings for catalog maintainers.
 */
export function checkHeroImageWarnings(products: ProductData[]): string[] {
  const warnings: string[] = [];

  for (const p of products) {
    const title = p.title.toLowerCase();
    const url = p.imageUrl.toLowerCase();

    // Known potential stock photo mismatches
    if (title.includes("brush") && (url.includes("pill") || url.includes("blister"))) {
      warnings.push(`[Grocify Catalog] Product "${p.title}" (id: ${p.id}) image may show a pill blister pack instead of scrub brushes.`);
    }
    if (title.includes("copper") && url.includes("toothbrush")) {
      warnings.push(`[Grocify Catalog] Product "${p.title}" (id: ${p.id}) image may show toothbrushes instead of a copper tongue scraper.`);
    }
  }

  return warnings;
}
