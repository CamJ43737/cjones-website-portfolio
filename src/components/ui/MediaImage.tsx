"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** CSS object-position — keep faces/subjects in frame */
  objectPosition?: string;
  /** cover (default documentary crop) or contain (no crop) */
  fit?: "cover" | "contain";
};

export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  objectPosition = "50% 35%",
  fit = "cover",
}: Props) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-graphite text-xs text-ink-400",
          className,
        )}
      >
        Media unavailable
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-charcoal", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "h-full w-full",
          fit === "cover" ? "object-cover" : "object-contain",
          imgClassName,
        )}
        style={{ objectPosition }}
        onError={() => setOk(false)}
      />
    </div>
  );
}
