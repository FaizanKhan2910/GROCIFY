import React from "react";
import { Breadcrumb, BreadcrumbItem } from "../ui/Breadcrumb";

export interface CollectionHeaderProps {
  title: string;
  subtitle?: string;
  totalCount?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  title,
  subtitle,
  totalCount,
  breadcrumbs,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`border-b border-ivory-border/80 pb-6 mb-6 ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-3" />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-soft-ink tracking-tight">
              {title}
            </h1>
            {typeof totalCount === "number" && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-ivory-muted text-ink-muted border border-ivory-border">
                {totalCount} products
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};
