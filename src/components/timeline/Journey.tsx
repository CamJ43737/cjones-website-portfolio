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
      className="bg-gradient-to-b from-transparent via-graphite/40 to-transparent"
    >
      <ol className="relative space-y-0">
        <div
          className="absolute bottom-0 left-[1.15rem] top-2 w-px bg-gradient-to-b from-cyan-electric/60 via-white/15 to-tuskegee-gold/50 sm:left-1/2 sm:-translate-x-px"
          aria-hidden
        />
        {timeline.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <li key={`${item.year}-${item.title}`} className="relative py-6 sm:py-8">
              <Reveal>
                <div
                  className={cn(
                    "grid gap-4 sm:grid-cols-2 sm:gap-10",
                    left ? "" : "sm:[&>*:first-child]:order-2",
                  )}
                >
                  <div className={cn("pl-12 sm:pl-0", left ? "sm:text-right sm:pr-12" : "sm:pl-12")}>
                    <p className="font-mono text-sm text-cyan-electric">{item.year}</p>
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
                  className="absolute left-[0.85rem] top-9 h-3 w-3 rounded-full border-2 border-obsidian bg-cyan-electric shadow-glow sm:left-1/2 sm:-translate-x-1/2"
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
