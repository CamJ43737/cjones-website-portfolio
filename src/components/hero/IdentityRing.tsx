"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const LABELS = [
  "Artificial Intelligence",
  "Robotics",
  "Computer Vision",
  "Machine Learning",
  "Digital Twins",
  "Precision Agriculture",
  "Healthcare AI",
  "Autonomous Systems",
  "Research",
  "Innovation",
  "Leadership",
  "Builder",
] as const;

function MarqueeTrack({ suffix }: { suffix: string }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      {LABELS.map((label) => (
        <span key={`${label}-${suffix}`} className="flex items-center gap-8 sm:gap-12">
          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-tuskegee-gold/90 sm:text-xs sm:tracking-[0.32em]">
            {label}
          </span>
          <span
            className="h-1 w-1 shrink-0 rounded-full bg-tuskegee-gold/55 shadow-[0_0_10px_rgba(200,162,74,0.45)]"
            aria-hidden
          />
        </span>
      ))}
    </div>
  );
}

export function IdentityRing() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Research domains"
      className="relative overflow-hidden py-8 sm:py-10"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 bg-tuskegee-gold/5 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-obsidian via-obsidian/85 to-transparent sm:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-obsidian via-obsidian/85 to-transparent sm:w-28"
          aria-hidden
        />

        <div
          className={cn(
            "flex w-max items-center border-y border-tuskegee-gold/20 bg-charcoal/20 py-4 backdrop-blur-sm sm:py-5",
            !reduce && "animate-identity-marquee",
          )}
        >
          <MarqueeTrack suffix="a" />
          <MarqueeTrack suffix="b" />
        </div>
      </div>

      <ul className="sr-only">
        {LABELS.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </section>
  );
}
