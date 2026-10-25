import { ProductData } from "@/components/marketplace/ProductCard";

export interface CategoryData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  itemCount: number;
  accentColor: string;
  imageUrl: string;
  description: string;
}

export const CATEGORIES: CategoryData[] = [
  {
    id: "cat-kitchen",
    slug: "kitchen",
    title: "Kitchen & Pantry",
    tagline: "Unrefined cold-pressed oils, cast tools & plastic-free cookware",
    itemCount: 5,
    accentColor: "#C8E66B", // Electric Citrus
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    description: "Everyday culinary essentials pressed using traditional Indian oil mills, seasoned cast iron, and durable pantry glassware. Always under ₹1,000.",
  },
  {
    id: "cat-personal-care",
    slug: "personal-care",
    title: "Personal Care",
    tagline: "Ayurvedic copper, seasoned neem wood & herbal tooth powders",
    itemCount: 5,
    accentColor: "#F0A7A0", // Coral Pop
    imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
    description: "Gentle daily grooming tools crafted from antimicrobial metals, seasoned timbers, and natural botanicals. Zero plastic toothbrushes, combs, or toxic coatings.",
  },
  {
    id: "cat-home-clean",
    slug: "home-clean",
    title: "Home & Clean",
    tagline: "Coir dish scrubbers, bio-enzyme cleansers & coconut fiber brushes",
    itemCount: 4,
    accentColor: "#F5CF63", // Butter Yellow
    imageUrl: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=800&q=80",
    description: "Effective domestic cleaners powered by wild citrus ferments, coir bristles, and non-toxic terracotta. Completely safe for greywater and municipal drainage.",
  },
  {
    id: "cat-reusables",
    slug: "reusables",
    title: "Reusables & Travel",
    tagline: "Unbleached kora cotton produce bags, copper ware & brass filters",
    itemCount: 4,
    accentColor: "#173D2D", // Deep Forest
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    description: "Heritage reusable containers and market tote bags designed to replace thousands of single-use polybags, takeaway boxes, and disposable filters over a lifetime.",
  },
];

export const EVERYDAY_FAVOURITES: ProductData[] = [
  {
    id: "prod-comb",
    title: "Handmade Neem Wood Wide-Tooth Comb",
    slug: "handmade-neem-wood-wide-tooth-comb",
    category: "Personal Care",
    sellingPrice: 249,
    originalPrice: 299,
    imageUrl: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Zero Plastic",
      verified: true,
    },
    unitDescription: "Single artisan piece • 100% Seasoned Neem Wood",
    isInStock: true,
  },
  {
    id: "prod-brushes",
    title: "Plant-Fiber Scrub Brushes, Set of 3",
    slug: "plant-fiber-scrub-brushes-set-of-3",
    category: "Home & Clean",
    sellingPrice: 429,
    originalPrice: 499,
    imageUrl: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Compostable",
      verified: true,
    },
    unitDescription: "Coconut coir & sisal bristles • Ergonomic beechwood handle",
    isInStock: true,
  },
  {
    id: "prod-mustard-oil",
    title: "Cold-Pressed Mustard Oil, 500 ml",
    slug: "cold-pressed-mustard-oil-500ml",
    category: "Kitchen & Pantry",
    sellingPrice: 380,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Glass Packaged",
      verified: true,
    },
    unitDescription: "500 ml • Traditional Wood-Ghani Pressed",
    isInStock: true,
  },
  {
    id: "prod-copper-scraper",
    title: "Pure Copper Tongue Scraper",
    slug: "pure-copper-tongue-scraper",
    category: "Personal Care",
    sellingPrice: 199,
    originalPrice: 249,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Ayurvedic Grade",
      verified: true,
    },
    unitDescription: "100% Pure Antimicrobial Copper with Cotton Pouch",
    isInStock: true,
  },
];

export const SMALL_UPGRADES: ProductData[] = [
  {
    id: "prod-vetiver-loofah",
    title: "Organic Vetiver Root Body Scrubber",
    slug: "organic-vetiver-root-body-scrubber",
    category: "Personal Care",
    sellingPrice: 169,
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Biodegradable",
      verified: true,
    },
    unitDescription: "Naturally fragrant Khus root • Hand-knitted outer mesh",
    isInStock: true,
  },
  {
    id: "prod-kora-bags",
    title: "Handwoven Kora Cotton Produce Bags, Set of 4",
    slug: "handwoven-kora-cotton-produce-bags-set-of-4",
    category: "Reusables & Travel",
    sellingPrice: 349,
    originalPrice: 399,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Unbleached Cotton",
      verified: true,
    },
    unitDescription: "Tare weight tags included • Washable & food-safe",
    isInStock: true,
  },
  {
    id: "prod-coconut-oil",
    title: "Cold-Pressed Virgin Coconut Oil, 350 ml",
    slug: "cold-pressed-virgin-coconut-oil-350ml",
    category: "Kitchen & Pantry",
    sellingPrice: 310,
    imageUrl: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "100% Pure Raw",
      verified: true,
    },
    unitDescription: "350 ml • Single-origin Kerala coconuts in glass bottle",
    isInStock: true,
  },
  {
    id: "prod-brass-filter",
    title: "Traditional Brass South Indian Coffee Filter",
    slug: "traditional-brass-south-indian-coffee-filter",
    category: "Kitchen & Pantry",
    sellingPrice: 520,
    originalPrice: 599,
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Lifetime Metal",
      verified: true,
    },
    unitDescription: "Size 2 (200 ml decoction) • Heavy-gauge food-grade brass",
    isInStock: true,
  },
];

export const CATALOG_ADDITIONAL: ProductData[] = [
  // Kitchen & Pantry additions
  {
    id: "prod-desi-ghee",
    title: "Certified Organic A2 Desi Cow Ghee, 250 ml",
    slug: "certified-organic-a2-desi-cow-ghee-250ml",
    category: "Kitchen & Pantry",
    sellingPrice: 490,
    originalPrice: 540,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Glass Jar",
      verified: true,
    },
    unitDescription: "250 ml • Bilona Churned Grass-Fed Indigenous Cow Ghee",
    isInStock: true,
  },
  {
    id: "prod-cast-iron-pan",
    title: "Pre-Seasoned Cast Iron Tadka Pan",
    slug: "pre-seasoned-cast-iron-tadka-pan",
    category: "Kitchen & Pantry",
    sellingPrice: 440,
    originalPrice: 499,
    imageUrl: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Zero Teflon",
      verified: true,
    },
    unitDescription: "Naturally non-stick seasoned with gingelly oil • Heavy base",
    isInStock: true,
  },

  // Personal Care additions
  {
    id: "prod-tooth-powder",
    title: "Charcoal & Clove Herbal Tooth Powder, 100g",
    slug: "charcoal-clove-herbal-tooth-powder-100g",
    category: "Personal Care",
    sellingPrice: 180,
    imageUrl: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Plastic-Free Tin",
      verified: true,
    },
    unitDescription: "100g • Calcium carbonate, activated charcoal & pure clove",
    isInStock: true,
  },
  {
    id: "prod-rosewater",
    title: "Pure Steam-Distilled Rosewater Mist, 100 ml",
    slug: "pure-steam-distilled-rosewater-mist-100ml",
    category: "Personal Care",
    sellingPrice: 290,
    imageUrl: "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Glass Bottle",
      verified: true,
    },
    unitDescription: "100 ml • Kannauj Desi Gulab hydrosol without alcohol",
    isInStock: true,
  },

  // Home & Clean additions
  {
    id: "prod-bio-cleaner",
    title: "Citrus Bio-Enzyme Multi-Surface Cleaner, 1 L",
    slug: "citrus-bio-enzyme-multi-surface-cleaner-1l",
    category: "Home & Clean",
    sellingPrice: 280,
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Natural Ferment",
      verified: true,
    },
    unitDescription: "1 L • Fermented citrus peels & soapnuts • Greywater safe",
    isInStock: true,
  },
  {
    id: "prod-candle",
    title: "Soy Wax & Citronella Terracotta Candle",
    slug: "soy-wax-citronella-terracotta-candle",
    category: "Home & Clean",
    sellingPrice: 360,
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Zero Paraffin",
      verified: true,
    },
    unitDescription: "35 hrs burn time • Hand-thrown reusable terracotta vessel",
    isInStock: true,
  },

  // Reusables & Travel additions
  {
    id: "prod-copper-flask",
    title: "Handcrafted Pure Copper Water Flask, 750 ml",
    slug: "handcrafted-pure-copper-water-flask-750ml",
    category: "Reusables & Travel",
    sellingPrice: 890,
    originalPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Ayurvedic Grade",
      verified: true,
    },
    unitDescription: "750 ml • Leak-proof silicone seal • Hand-hammered finish",
    isInStock: true,
  },
  {
    id: "prod-muslin-cloth",
    title: "Organic Cotton Muslin Strainer Bags, Set of 2",
    slug: "organic-cotton-muslin-strainer-bags-set-of-2",
    category: "Reusables & Travel",
    sellingPrice: 220,
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    ecoCredential: {
      label: "Zero Bleach",
      verified: true,
    },
    unitDescription: "Ultra-fine weave for paneer, almond milk, and cold brew",
    isInStock: true,
  },
];

export const ALL_PRODUCTS: ProductData[] = [
  ...EVERYDAY_FAVOURITES,
  ...SMALL_UPGRADES,
  ...CATALOG_ADDITIONAL,
];

/**
 * Filter and sorting utilities
 */
export type SortOption = "curated" | "price-asc" | "price-desc" | "name-asc";

export interface FilterState {
  categorySlug: string;
  maxPrice: number;
  selectedCredentials: string[];
  searchQuery: string;
  sortBy: SortOption;
}

export function filterAndSortProducts(
  products: ProductData[],
  filters: FilterState
): ProductData[] {
  return products
    .filter((product) => {
      // Category filter
      if (filters.categorySlug && filters.categorySlug !== "all") {
        const cat = CATEGORIES.find((c) => c.slug === filters.categorySlug);
        if (cat && product.category.toLowerCase() !== cat.title.toLowerCase()) {
          return false;
        }
      }

      // Price ceiling filter (must always be <= 1,000)
      const maxAllowed = Math.min(filters.maxPrice || 1000, 1000);
      if (product.sellingPrice > maxAllowed) {
        return false;
      }

      // Verified credentials filter
      if (
        filters.selectedCredentials &&
        filters.selectedCredentials.length > 0
      ) {
        if (
          !product.ecoCredential ||
          !filters.selectedCredentials.includes(product.ecoCredential.label)
        ) {
          return false;
        }
      }

      // Search query filter
      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesBadge = product.ecoCredential?.label.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesBadge) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.sellingPrice - b.sellingPrice;
        case "price-desc":
          return b.sellingPrice - a.sellingPrice;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "curated":
        default:
          return 0; // Natural curated order
      }
    });
}
