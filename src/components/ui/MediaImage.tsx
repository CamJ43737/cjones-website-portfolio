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
};

export function MediaImage({ src, alt, className, imgClassName, priority }: Props) {
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
    <div className={cn("overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={() => setOk(false)}
      />
    </div>
  );
}
