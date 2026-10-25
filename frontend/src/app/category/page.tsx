import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/navigation/Header";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { CollectionBrowser } from "@/components/marketplace/CollectionBrowser";

export const metadata: Metadata = {
  title: "Categories & Collections — GROCIFY",
  description:
    "Explore mindful domestic essentials across Kitchen, Personal Care, Home & Clean, and Reusables. Tested utility, zero plastic packaging, strictly ≤ ₹1,000.",
};

export default function CategoryLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory selection:bg-electric-citrus selection:text-deep-forest pb-20 lg:pb-0">
      {/* Universal Header with Navigation & Live Cart */}
      <Header />

      <main className="flex-1">
        <CollectionBrowser
          initialCategorySlug="all"
          showCategoryLandingCards={true}
          pageTitle="Find your everyday favourites."
          pageSubtitle="Mindfully crafted essentials for your home, kitchen, and domestic routines — selected with care, verified for eco claims, and strictly priced under ₹1,000."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Categories" },
          ]}
        />
      </main>

      {/* Footer */}
      <footer className="bg-warm-ivory border-t border-ivory-border text-xs text-ink-muted py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            © {new Date().getFullYear()} GROCIFY • HOW Networks. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>≤ ₹1,000 PRICE CEILING</span>
            <span>•</span>
            <span>FREE DELIVERY OVER ₹499</span>
          </div>
        </div>
      </footer>

      {/* Mobile Shopping Navigation Bar */}
      <MobileBottomNav activeTab="categories" />
    </div>
  );
}
