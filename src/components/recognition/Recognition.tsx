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

/** Full awards gallery — all 12 recognition stills. */
const recognitionImages = [
  {
    src: "/images/07_Awards/nsf-stem-scholars.jpg",
    alt: "NSF S-STEM Scholars",
    caption: "NSF S-STEM Scholars cohort.",
  },
  {
    src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
    alt: "NSF STEM Scholars celebration",
    caption: "NSF S-STEM scholarship committee celebration.",
  },
  {
    src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
    alt: "Gamma Sigma Delta honors",
    caption: "Gamma Sigma Delta Honor Society of Agriculture.",
  },
  {
    src: "/images/07_Awards/gsd-honors-society-of-ag-official-pin.jpeg",
    alt: "Gamma Sigma Delta pin",
    caption: "Gamma Sigma Delta honor society pin.",
  },
  {
    src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
    alt: "Auburn Hacks winners",
    caption: "Auburn Hacks first-place team.",
  },
  {
    src: "/images/07_Awards/hackathon-team-for-auburn-hacks-hackathon.jpeg",
    alt: "Auburn Hacks team",
    caption: "Auburn Hacks competition team.",
  },
  {
    src: "/images/07_Awards/my-sister-and-i-presenting-our-hakcathon-for-auburn-hacks.jpeg",
    alt: "Auburn Hacks presentation",
    caption: "Presenting at Auburn Hacks.",
  },
  {
    src: "/images/07_Awards/hackathon-winners.jpeg",
    alt: "Precision agriculture hackathon winners",
    caption: "Precision Agriculture Hackathon winners.",
  },
  {
    src: "/images/07_Awards/uiuc-2026-cda-hackathon-winners.jpeg",
    alt: "CDA hackathon winners",
    caption: "CDA hackathon recognition.",
  },
  {
    src: "/images/07_Awards/img-3444.jpg",
    alt: "Awards recognition moment",
    caption: "Recognition and scholarship community.",
  },
  {
    src: "/images/07_Awards/img-6798.jpg",
    alt: "Awards ceremony moment",
    caption: "Honors and awards celebration.",
  },
  {
    src: "/images/07_Awards/img-6842.jpg",
    alt: "Awards program recognition",
    caption: "Program recognition and community support.",
  },
] as const;

export function Recognition() {
  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="Markers of trust."
      subtitle="Scholarships, honors, leadership roles, and achievements that represent the communities supporting my journey."
      className="section-wash"
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:col-span-7">
          {recognitionImages.map((m, i) => (
            <Reveal key={m.src} delay={Math.min(i * 0.025, 0.28)} className="h-full">
              <figure className="flex h-full flex-col gap-1.5 sm:gap-2">
                <MediaImage
                  src={m.src}
                  alt={m.alt}
                  fit="cover"
                  objectPosition="50% 50%"
                  className="aspect-square w-full rounded-lg"
                />
                <figcaption className="line-clamp-2 min-h-[2rem] px-0.5 text-[10px] leading-snug text-ink-400 sm:text-[11px]">
                  {m.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="space-y-8 lg:col-span-5 lg:sticky lg:top-28">
          {groups.map((group, gi) => (
            <Reveal key={group.label} delay={0.05 * gi}>
              <div>
                <p className="chapter-label mb-3">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.items.map((a) => (
                    <li
                      key={a.name}
                      className="glass flex min-h-[4.25rem] items-start justify-between gap-4 rounded-2xl px-5 py-4"
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

          <Reveal delay={0.2}>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/30 px-6 py-3 text-sm text-mist backdrop-blur-sm transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
            >
              View full record
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
