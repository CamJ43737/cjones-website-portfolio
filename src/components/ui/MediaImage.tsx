"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { defaultObjectPosition, fitForPath } from "@/lib/image-rules";
import type { MediaFit } from "@/data/media-assignments";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  objectPosition?: string;
  fit?: MediaFit;
};

export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  objectPosition,
  fit,
}: Props) {
  const [ok, setOk] = useState(true);
  const resolvedFit = fitForPath(src, fit);
  const resolvedPosition = defaultObjectPosition(src, objectPosition);

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
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-charcoal/70",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "max-h-full max-w-full",
          resolvedFit === "cover" ? "h-full w-full object-cover" : "h-full w-full object-contain",
          imgClassName,
        )}
        style={{ objectPosition: resolvedPosition }}
        onError={() => setOk(false)}
      />
    </div>
  );
}
