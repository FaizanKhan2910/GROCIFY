import { ProductData } from "@/components/marketplace/ProductCard";

export interface CategoryData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  itemCount: number;
  accentColor: string;
  imageUrl: string;
}

export const CATEGORIES: CategoryData[] = [
  {
    id: "cat-kitchen",
    slug: "kitchen",
    title: "Kitchen & Pantry",
    tagline: "Unrefined cold-pressed oils, cast tools & plastic-free cookware",
    itemCount: 28,
    accentColor: "#C8E66B", // Electric Citrus
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-personal-care",
    slug: "personal-care",
    title: "Personal Care",
    tagline: "Ayurvedic copper, seasoned neem wood & herbal tooth powders",
    itemCount: 19,
    accentColor: "#F0A7A0", // Coral Pop
    imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-home-clean",
    slug: "home-clean",
    title: "Home & Clean",
    tagline: "Coir dish scrubbers, bio-enzyme cleansers & coconut fiber brushes",
    itemCount: 14,
    accentColor: "#F5CF63", // Butter Yellow
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cat-reusables",
    slug: "reusables",
    title: "Reusables & Travel",
    tagline: "Unbleached kora cotton produce bags, copper ware & brass filters",
    itemCount: 22,
    accentColor: "#173D2D", // Deep Forest
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
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

export const ALL_PRODUCTS = [...EVERYDAY_FAVOURITES, ...SMALL_UPGRADES];
