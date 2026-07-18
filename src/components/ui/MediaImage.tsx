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
  /** Skip the shared gold frame (rare — seals / inline icons). */
  unframed?: boolean;
};

export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  objectPosition,
  fit,
  unframed = false,
}: Props) {
  const [ok, setOk] = useState(true);
  const resolvedFit = fitForPath(src, fit);
  const resolvedPosition = defaultObjectPosition(src, objectPosition);

  if (!ok) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-graphite text-xs text-ink-400",
          !unframed && "media-frame",
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
        "group relative overflow-hidden",
        !unframed && "media-frame",
        resolvedFit === "contain"
          ? "bg-gradient-to-b from-tuskegee-gold/[0.07] via-obsidian/95 to-obsidian"
          : "bg-charcoal/90",
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
          "h-full w-full max-w-full transition duration-700 ease-out",
          resolvedFit === "cover" ? "object-cover" : "object-contain p-1.5 sm:p-2",
          !unframed && "group-hover:scale-[1.015]",
          imgClassName,
        )}
        style={{ objectPosition: resolvedPosition }}
        onError={() => setOk(false)}
      />
    </div>
  );
}
