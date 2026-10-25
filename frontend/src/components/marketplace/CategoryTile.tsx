import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CategoryTileProps {
  title: string;
  itemCount: number;
  slug: string;
  tagline: string;
  accentColor?: string;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  title,
  itemCount,
  slug,
  tagline,
  accentColor = "var(--color-electric-citrus)",
  className = "",
}) => {
  return (
    <Link
      href={`/category/${slug}`}
      className={`group relative flex flex-col justify-between p-5 rounded-md border border-ivory-border bg-warm-ivory hover:border-deep-forest/40 transition-all duration-200 hover:shadow-card overflow-hidden min-h-[160px] ${className}`}
    >
      {/* Decorative accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-3 pt-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
          {itemCount} curated items
        </span>
        <div className="w-8 h-8 rounded-full bg-ivory-muted group-hover:bg-deep-forest group-hover:text-warm-ivory flex items-center justify-center text-soft-ink transition-colors">
          <ArrowUpRight className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-lg sm:text-xl font-bold text-soft-ink group-hover:text-deep-forest transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-xs text-ink-muted mt-1 line-clamp-1">
          {tagline}
        </p>
      </div>
    </Link>
  );
};
