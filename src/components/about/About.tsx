import { aboutStory, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { TuskegeeSealWatermark } from "@/components/brand/TuskegeeAtmosphere";

export function About() {
  const sideImages = mediaAssignments.about;

  return (
    <Section
      id="about"
      eyebrow="Chapter 01 — Origin"
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
            {aboutStory.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 24)} delay={0.08 * (i + 1)}>
                <p className="prose-brand">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            {aboutStory.whys.map((item, i) => (
              <Reveal key={item.q} delay={0.05 * i}>
                <div className="glass rounded-2xl px-5 py-5 sm:px-6">
                  <h3 className="font-display text-lg text-tuskegee-gold">{item.q}</h3>
                  <p className="mt-2 max-w-measure text-sm leading-relaxed text-ink-200 sm:text-base">
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="glass mt-6 rounded-2xl px-5 py-6 sm:px-6">
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
                className={`rounded-2xl border border-white/[0.08] ${
                  m.aspect === "portrait"
                    ? "aspect-[4/5] sm:col-span-2 lg:col-span-1"
                    : "aspect-[16/11]"
                }`}
              />
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div className="flex items-center gap-4 rounded-2xl border border-tuskegee-gold/25 bg-tuskegee-gold/[0.06] px-4 py-4 backdrop-blur-md">
              <MediaImage
                src={mediaAssignments.logoSeal.src}
                alt={mediaAssignments.logoSeal.alt}
                fit="contain"
                objectPosition="50% 50%"
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
