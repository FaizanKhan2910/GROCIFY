"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export interface ImageContainerProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "video" | "wide";
  className?: string;
  priority?: boolean;
}

const aspectMap = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  video: "aspect-[16/9]",
  wide: "aspect-[3/2]",
};

export const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  aspectRatio = "portrait",
  className = "",
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`relative w-full overflow-hidden bg-ivory-muted/70 rounded-sm ${aspectMap[aspectRatio]} ${className}`}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={`object-cover object-center transition-all duration-300 ${
            isLoading ? "scale-105 blur-sm opacity-60" : "scale-100 blur-0 opacity-100"
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-ink-subtle bg-ivory-muted">
          <ImageOff className="w-6 h-6 mb-1 text-ink-subtle" />
          <span className="text-[11px] font-mono uppercase">{alt || "Visual"}</span>
        </div>
      )}
    </div>
  );
};
