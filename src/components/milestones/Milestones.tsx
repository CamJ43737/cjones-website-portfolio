import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homepageMilestones } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function Milestones() {
  return (
    <Section
      id="milestones"
      eyebrow="Milestones"
      title="Selected milestones."
      subtitle="Key moments that shaped my journey from builder to researcher."
      className="section-wash"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {homepageMilestones.map((item, i) => (
          <Reveal key={`${item.year}-${item.title}`} delay={Math.min(i * 0.05, 0.25)}>
            <Link
              href={item.href}
              className="glass group flex h-full flex-col rounded-2xl p-6 transition hover:border-tuskegee-gold/40 hover:shadow-gold"
            >
              <p className="font-mono text-xs tracking-[0.22em] text-tuskegee-gold">
                {item.year}
              </p>
              <h3 className="mt-3 font-display text-xl leading-snug text-mist sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-auto pt-6 inline-flex items-center gap-2 text-sm text-ink-300 transition group-hover:text-tuskegee-gold">
                Open journey
                <ArrowUpRight size={14} />
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <Link
            href="/journey"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/30 px-6 py-3 text-sm text-mist backdrop-blur-sm transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
          >
            Explore the full journey
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
