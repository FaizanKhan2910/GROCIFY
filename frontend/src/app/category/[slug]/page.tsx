import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { CollectionBrowser } from "@/components/marketplace/CollectionBrowser";
import { CATEGORIES } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "Category Not Found — GROCIFY",
    };
  }

  return {
    title: `${category.title} — Curated Mindful Essentials | GROCIFY`,
    description: category.description,
  };
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory selection:bg-electric-citrus selection:text-deep-forest pb-20 lg:pb-0">
      {/* Universal Header with Navigation & Live Cart */}
      <Header />

      <main className="flex-1">
        <CollectionBrowser
          initialCategorySlug={category.slug}
          showCategoryLandingCards={false}
          pageTitle={category.title}
          pageSubtitle={category.description}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/category" },
            { label: category.title },
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
