"use client";

import { timeline } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function Journey() {
  return (
    <Section
      id="journey"
      eyebrow="Chapter 02 — Trajectory"
      title="A timeline of becoming."
      subtitle="From opening computer cases to leading research that touches fields and homes."
      className="bg-gradient-to-b from-transparent via-charcoal/40 to-transparent"
    >
      <ol className="relative">
        <div
          className="absolute bottom-0 left-[1.15rem] top-2 w-px bg-gradient-to-b from-tuskegee-gold/55 via-white/10 to-tuskegee-muted/40 sm:left-1/2 sm:-translate-x-px"
          aria-hidden
        />
        {timeline.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <li key={`${item.year}-${item.title}`} className="relative py-6 sm:py-7">
              <Reveal>
                <div
                  className={cn(
                    "grid gap-4 sm:grid-cols-2 sm:gap-10",
                    left ? "" : "sm:[&>*:first-child]:order-2",
                  )}
                >
                  <div className={cn("pl-12 sm:pl-0", left ? "sm:pr-12 sm:text-right" : "sm:pl-12")}>
                    <p className="font-mono text-sm text-tuskegee-gold">{item.year}</p>
                    <h3 className="mt-2 font-display text-xl text-mist sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">
                      {item.detail}
                    </p>
                  </div>
                  <div className="hidden sm:block" />
                </div>
                <span
                  className="absolute left-[0.85rem] top-9 h-2.5 w-2.5 rounded-full border-2 border-obsidian bg-tuskegee-gold shadow-gold-sm sm:left-1/2 sm:-translate-x-1/2"
                  aria-hidden
                />
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
