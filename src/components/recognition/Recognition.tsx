import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

const groups = [
  {
    label: "Scholarships",
    items: [
      { name: "NSF S-STEM Scholar", detail: "National Science Foundation" },
      { name: "UNCF Scholar", detail: "United Negro College Fund" },
      { name: "TMCF Scholar", detail: "Thurgood Marshall College Fund" },
    ],
  },
  {
    label: "Honors Societies",
    items: [
      {
        name: "Gamma Sigma Delta",
        detail: "Honor Society of Agriculture",
      },
    ],
  },
  {
    label: "Ambassador Roles",
    items: [
      { name: "UNCF Ambassador", detail: "United Negro College Fund" },
      { name: "HBCUniverse Ambassador", detail: "HBCU community leadership" },
    ],
  },
  {
    label: "Competitions",
    items: [
      { name: "Auburn Hacks Winner", detail: "1st Place" },
      { name: "Precision Agriculture Hackathon Winner", detail: "1st Place" },
    ],
  },
] as const;

const recognitionImages = [
  {
    src: "/images/07_Awards/nsf-stem-scholars.jpg",
    alt: "NSF S-STEM Scholars",
    caption: "NSF S-STEM Scholars cohort recognition.",
    fit: "contain" as const,
    objectPosition: "50% 30%",
  },
  {
    src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
    alt: "NSF STEM Scholars celebration",
    caption: "Celebrating with the NSF S-STEM scholarship committee.",
    fit: "contain" as const,
    objectPosition: "50% 35%",
  },
  {
    src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
    alt: "Gamma Sigma Delta honors",
    caption: "Gamma Sigma Delta Honor Society of Agriculture.",
    fit: "contain" as const,
    objectPosition: "50% 40%",
  },
  {
    src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
    alt: "Auburn Hacks winners",
    caption: "Auburn Hacks first-place team.",
    fit: "contain" as const,
    objectPosition: "50% 30%",
  },
  {
    src: "/images/07_Awards/hackathon-winners.jpeg",
    alt: "Precision agriculture hackathon winners",
    caption: "Precision Agriculture Hackathon first-place recognition.",
    fit: "contain" as const,
    objectPosition: "50% 50%",
  },
  {
    src: "/images/07_Awards/my-sister-and-i-presenting-our-hakcathon-for-auburn-hacks.jpeg",
    alt: "Auburn Hacks presentation",
    caption: "Presenting the Auburn Hacks competition project.",
    fit: "contain" as const,
    objectPosition: "50% 28%",
  },
] as const;

export function Recognition() {
  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="Markers of trust."
      subtitle="Scholarships, honors, ambassadorship, and competition wins — the full record lives on Resume."
      className="section-wash"
    >
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6">
          {recognitionImages.map((m, i) => (
            <Reveal key={m.src} delay={Math.min(i * 0.04, 0.2)}>
              <figure className="flex h-full flex-col">
                <MediaImage
                  src={m.src}
                  alt={m.alt}
                  fit={m.fit}
                  objectPosition={m.objectPosition}
                  className="aspect-square w-full"
                />
                <figcaption className="mt-2 text-[11px] leading-snug text-ink-400 sm:text-xs">
                  {m.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="space-y-7 lg:col-span-6">
          {groups.map((group, gi) => (
            <Reveal key={group.label} delay={0.05 * gi}>
              <div>
                <p className="chapter-label mb-3">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.items.map((a) => (
                    <li
                      key={a.name}
                      className="glass flex min-h-[4.5rem] items-start justify-between gap-4 rounded-2xl px-5 py-4"
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
