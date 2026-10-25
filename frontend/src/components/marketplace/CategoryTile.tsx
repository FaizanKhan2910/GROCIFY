import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export interface CategoryTileProps {
  title: string;
  itemCount: number;
  slug: string;
  tagline: string;
  accentColor?: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  title,
  itemCount,
  tagline,
  accentColor = "#C8E66B",
  imageUrl,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left flex flex-col justify-between p-5 rounded-md border border-ivory-border bg-warm-ivory hover:border-deep-forest/40 transition-all duration-200 hover:shadow-card overflow-hidden min-h-[190px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest ${className}`}
    >
      {/* Decorative accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: accentColor }}
      />

      {/* Subtle background image cutout for editorial feel */}
      {imageUrl && (
        <div className="absolute right-0 bottom-0 w-28 h-28 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none overflow-hidden rounded-tl-full">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3 pt-1 relative z-10 w-full">
        <span className="text-[11px] font-mono uppercase tracking-wider text-ink-muted bg-warm-ivory/80 px-2 py-0.5 rounded-xs border border-ivory-border/60">
          {itemCount} curated items
        </span>
        <div className="w-8 h-8 rounded-full bg-ivory-muted group-hover:bg-deep-forest group-hover:text-warm-ivory flex items-center justify-center text-soft-ink transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <h3 className="font-display text-lg sm:text-xl font-bold text-soft-ink group-hover:text-deep-forest transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
          {tagline}
        </p>
      </div>
    </button>
  );
};
