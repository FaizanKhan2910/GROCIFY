import React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { container: string; iconClass: string; icon: React.ReactNode }
> = {
  info: {
    container: "bg-forest-subtle border-deep-forest/20 text-deep-forest",
    iconClass: "text-deep-forest",
    icon: <Info className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  success: {
    container: "bg-citrus-muted/40 border-deep-forest/20 text-deep-forest",
    iconClass: "text-deep-forest",
    icon: <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  warning: {
    container: "bg-yellow-subtle border-butter-yellow text-soft-ink",
    iconClass: "text-soft-ink",
    icon: <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
  destructive: {
    container: "bg-coral-subtle border-coral-pop text-soft-ink",
    iconClass: "text-coral-hover",
    icon: <XCircle className="w-5 h-5 shrink-0" aria-hidden="true" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  description,
  onClose,
  className = "",
}) => {
  const cfg = variantConfig[variant];

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 p-4 rounded-md border ${cfg.container} ${className}`}
    >
      <div className={cfg.iconClass}>{cfg.icon}</div>
      <div className="flex-1 text-sm leading-relaxed">
        {title && <h5 className="font-semibold text-current mb-0.5">{title}</h5>}
        <div className="text-soft-ink/90">{description}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss alert"
          className="p-1 -mr-1 -mt-1 rounded text-ink-muted hover:text-soft-ink hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
