import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { aboutStory, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { TuskegeeSealWatermark } from "@/components/brand/TuskegeeAtmosphere";

export function About() {
  const sideImages = mediaAssignments.about.slice(0, 2);

  return (
    <Section
      id="about"
      eyebrow="About"
      title="The builder before the researcher."
      subtitle={`${site.name} · ${site.major} · ${site.university} · Expected ${site.graduation}`}
      className="overflow-hidden section-wash"
      backdrop={
        <TuskegeeSealWatermark
          size="lg"
          className="left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        />
      }
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-display text-2xl leading-snug text-mist sm:text-3xl">
              {aboutStory.lead}
            </p>
          </Reveal>
          <div className="mt-8 space-y-5">
            {aboutStory.homepageParagraphs.map((p) => (
              <Reveal key={p.slice(0, 28)}>
                <p className="prose-brand">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 rounded-full border border-tuskegee-gold/35 bg-tuskegee-gold/10 px-5 py-2.5 text-sm text-tuskegee-gold transition hover:border-tuskegee-gold/55 hover:bg-tuskegee-gold/15"
              >
                Read my journey
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-mist transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
              >
                View research
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="glass mt-8 rounded-2xl px-5 py-6 sm:px-6">
              <p className="chapter-label">Focus</p>
              <p className="mt-3 font-display text-xl leading-snug text-mist sm:text-2xl">
                AI + Robotics + Agriculture + Healthcare
              </p>
              <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-300">
                Based between {site.hometown} and {site.location}.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {sideImages.map((m, i) => (
            <Reveal key={m.src} delay={0.1 * i}>
              <MediaImage
                src={m.src}
                alt={m.alt}
                fit={m.fit}
                objectPosition={m.objectPosition}
                className={
                  m.aspect === "portrait"
                    ? "aspect-[4/5] sm:col-span-2 lg:col-span-1"
                    : "aspect-[16/11]"
                }
              />
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="flex items-center gap-4 rounded-2xl border border-tuskegee-gold/25 bg-tuskegee-gold/[0.06] px-4 py-4 backdrop-blur-md">
              <MediaImage
                src={mediaAssignments.logoSeal.src}
                alt={mediaAssignments.logoSeal.alt}
                fit="contain"
                objectPosition="50% 50%"
                unframed
                className="h-14 w-14 shrink-0 bg-transparent"
                imgClassName="p-1"
              />
              <p className="text-sm leading-relaxed text-ink-200">
                Tuskegee University — heritage, excellence, and research in service of people.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
