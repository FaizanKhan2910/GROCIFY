import React from "react";
import { Search, X } from "lucide-react";
import { Input, InputProps } from "./Input";

export interface SearchInputProps
  extends Omit<InputProps, "leftElement" | "rightElement"> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, onChange, className = "", ...props }, ref) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        leftElement={<Search className="w-4 h-4" aria-hidden="true" />}
        rightElement={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search query"
              className="p-1 rounded-full text-ink-muted hover:text-soft-ink hover:bg-ivory-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : undefined
        }
        className={`pr-10 ${className}`}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";
