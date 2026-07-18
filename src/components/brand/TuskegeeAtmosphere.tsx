import { asset } from "@/lib/asset";
import { mediaAssignments } from "@/data/media-assignments";
import { cn } from "@/lib/cn";

type Props = {
  /** hero = stronger presence; section = faint texture; footer = minimal */
  intensity?: "hero" | "section" | "footer";
  className?: string;
};

/**
 * Subtle Tuskegee backdrop — cinematic academic atmosphere, not sports branding.
 */
export function TuskegeeAtmosphere({ intensity = "section", className }: Props) {
  const backdrop = mediaAssignments.backdrop;
  const opacity =
    intensity === "hero" ? "opacity-[0.22]" : intensity === "footer" ? "opacity-[0.07]" : "opacity-[0.1]";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(backdrop.src)}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full scale-105 object-cover object-center",
          opacity,
        )}
      />
      {/* Dark cinematic grade + warm gold wash — keep text readable */}
      <div
        className={cn(
          "absolute inset-0",
          intensity === "hero"
            ? "bg-gradient-to-b from-obsidian via-obsidian/85 to-obsidian"
            : "bg-gradient-to-b from-obsidian/95 via-obsidian/90 to-obsidian",
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          intensity === "hero"
            ? "bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(200,162,74,0.14),transparent_55%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(166,106,48,0.08),transparent_50%)]"
            : "bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(200,162,74,0.06),transparent_55%)]",
        )}
      />
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
    <div
      className={cn("pointer-events-none absolute select-none", className)}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(seal.src)}
        alt=""
        className={cn(dim, "object-contain opacity-[0.06] sm:opacity-[0.07]")}
      />
    </div>
  );
}
