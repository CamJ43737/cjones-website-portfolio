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

function MarqueeTrack({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
      aria-hidden={ariaHidden}
    >
      {LABELS.map((label) => (
        <span key={label} className="flex items-center gap-8 sm:gap-12">
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
      aria-label="Research identity"
      className="relative overflow-hidden py-12 sm:py-14 lg:py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 bg-tuskegee-gold/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto mb-8 w-full max-w-6xl px-[clamp(1.25rem,4vw,2.5rem)] text-center sm:mb-10">
        <p className="font-display text-2xl font-semibold tracking-tight text-mist sm:text-3xl">
          Cameron Jones
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-tuskegee-gold sm:text-[11px] sm:tracking-[0.32em]">
          AI • Robotics • Research
        </p>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent sm:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-obsidian via-obsidian/80 to-transparent sm:w-28"
          aria-hidden
        />

        <div
          className={cn(
            "flex w-max items-center border-y border-tuskegee-gold/20 bg-charcoal/20 py-4 backdrop-blur-sm sm:py-5",
            !reduce && "animate-identity-marquee",
          )}
        >
          <MarqueeTrack />
          <MarqueeTrack ariaHidden />
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
