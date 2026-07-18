"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const LABELS = [
  "AI Research",
  "Robotics",
  "Computer Vision",
  "Digital Twins",
  "Precision Agriculture",
  "Healthcare AI",
  "Machine Learning",
  "Autonomous Systems",
  "Research",
  "Innovation",
] as const;

export function IdentityRing() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Research identity ring"
      className="section-pad relative overflow-hidden py-14 sm:py-16 lg:py-20"
    >
      <div className="relative mx-auto flex w-full max-w-6xl justify-center">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,28rem)] w-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-tuskegee-gold/10 blur-3xl"
          aria-hidden
        />

        <div className="relative aspect-square w-[min(92vw,26rem)] sm:w-[min(80vw,30rem)] lg:w-[32rem]">
          <div
            className="absolute inset-0 rounded-full border border-tuskegee-gold/25 shadow-gold-sm"
            aria-hidden
          />
          <div
            className="absolute inset-[8%] rounded-full border border-white/[0.06] bg-charcoal/25 backdrop-blur-sm"
            aria-hidden
          />

          <div
            className={cn("absolute inset-0", !reduce && "animate-identity-spin")}
            aria-hidden
          >
            {LABELS.map((label, i) => {
              const angle = (360 / LABELS.length) * i;
              return (
                <div
                  key={label}
                  className="absolute left-1/2 top-0 h-1/2 w-0 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                >
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 block -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-tuskegee-gold/85 sm:text-[10px] sm:tracking-[0.24em]",
                      !reduce && "animate-identity-spin-reverse",
                    )}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-[28%] flex flex-col items-center justify-center rounded-full border border-tuskegee-gold/30 bg-obsidian/55 px-4 text-center shadow-gold backdrop-blur-xl sm:inset-[30%]">
            <p className="font-display text-lg font-semibold leading-tight text-mist sm:text-xl lg:text-2xl">
              Cameron Jones
            </p>
            <p className="mt-2 max-w-[11rem] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-tuskegee-gold sm:text-[10px] sm:tracking-[0.2em]">
              AI + Robotics + Research
            </p>
          </div>
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
