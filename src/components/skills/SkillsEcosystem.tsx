"use client";

import { useState } from "react";
import { skillCategories } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function SkillsEcosystem() {
  const [active, setActive] = useState(skillCategories[0].name);
  const current = skillCategories.find((c) => c.name === active) ?? skillCategories[0];

  return (
    <Section
      id="skills"
      eyebrow="Chapter 04 — Stack"
      title="Technology ecosystem."
      subtitle="Not skill bars — a living map of how research gets built."
    >
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {skillCategories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActive(cat.name)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                active === cat.name
                  ? "border-tuskegee-gold/45 bg-tuskegee-gold/12 text-tuskegee-gold"
                  : "border-white/10 text-ink-300 hover:border-white/25 hover:text-mist",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {current.skills.map((skill, i) => (
            <div
              key={skill}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:border-tuskegee-gold/35"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-tuskegee-gold/8 blur-2xl transition group-hover:bg-tuskegee-gold/14"
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">
                Node {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 font-display text-xl text-mist">{skill}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
