import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

const groups = [
  {
    label: "Scholarships",
    items: [
      { name: "NSF S-STEM Scholar", detail: "National Science Foundation" },
      { name: "TMCF Scholar", detail: "Thurgood Marshall College Fund" },
      { name: "Gamma Sigma Delta", detail: "Honor Society of Agriculture" },
    ],
  },
  {
    label: "Ambassador roles",
    items: [{ name: "UNCF Ambassador", detail: "United Negro College Fund" }],
  },
  {
    label: "Competitions",
    items: [
      { name: "Auburn Hacks Winner", detail: "1st Place" },
      { name: "Precision Agriculture Hackathon Winner", detail: "1st Place" },
    ],
  },
] as const;

export function Recognition() {
  const gallery = mediaAssignments.awards.slice(0, 3);

  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="Markers of trust."
      subtitle="Scholarships, ambassadorship, and competition wins — the full record lives on Resume."
      className="section-wash"
    >
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
          {gallery.map((m, i) => (
            <Reveal key={m.src} delay={i * 0.04}>
              <MediaImage
                src={m.src}
                alt={m.alt}
                fit={m.fit}
                objectPosition={m.objectPosition}
                className={i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}
              />
            </Reveal>
          ))}
        </div>

        <div className="space-y-8 lg:col-span-7">
          {groups.map((group, gi) => (
            <Reveal key={group.label} delay={0.05 * gi}>
              <div>
                <p className="chapter-label mb-3">{group.label}</p>
                <ul className="space-y-3">
                  {group.items.map((a) => (
                    <li
                      key={a.name}
                      className="glass flex items-start justify-between gap-4 rounded-2xl px-5 py-4"
                    >
                      <div>
                        <p className="font-display text-lg text-mist">{a.name}</p>
                        <p className="mt-1 text-sm text-ink-400">{a.detail}</p>
                      </div>
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-tuskegee-gold shadow-gold-sm" />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/30 px-6 py-3 text-sm text-mist backdrop-blur-sm transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
          >
            View full record
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
