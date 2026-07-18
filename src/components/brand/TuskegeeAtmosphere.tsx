import { asset } from "@/lib/asset";
import { mediaAssignments } from "@/data/media-assignments";
import { cn } from "@/lib/cn";

/**
 * Fixed, site-wide Tuskegee cinematic backdrop.
 * Layer 1: campus atmosphere image
 * Layer 2: charcoal/black readability gradient
 * Layer 3: soft gold/bronze glow accents
 */
export function GlobalBackdrop() {
  const backdrop = mediaAssignments.backdrop;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Layer 1 — Tuskegee backdrop (more visible) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(backdrop.src)}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[50%_35%] opacity-[0.48] sm:opacity-[0.52]"
      />

      {/* Layer 2 — dark gradient for text readability (not a solid black veil) */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-obsidian/55 to-obsidian/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/50 via-transparent to-obsidian/45" />

      {/* Layer 3 — soft gold / bronze academic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_70%_15%,rgba(200,162,74,0.16),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_85%,rgba(166,106,48,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(10,10,10,0.15),transparent_70%)]" />
    </div>
  );
}

type SealProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

/** Low-opacity Tuskegee seal watermark */
export function TuskegeeSealWatermark({ className, size = "lg" }: SealProps) {
  const seal = mediaAssignments.logoSeal;
  const dim =
    size === "sm" ? "h-24 w-24" : size === "md" ? "h-40 w-40 sm:h-48 sm:w-48" : "h-56 w-56 sm:h-72 sm:w-72";

  return (
    <div className={cn("pointer-events-none absolute select-none", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(seal.src)}
        alt=""
        className={cn(dim, "object-contain opacity-[0.07] sm:opacity-[0.08]")}
      />
    </div>
  );
}
