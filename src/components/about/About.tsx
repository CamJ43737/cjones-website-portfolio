import { aboutStory, site } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByCategory, mediaByPathPrefix, pickFeatured } from "@/lib/media";

export function About() {
  const pc = pickFeatured(mediaByCategory("12_PC_Build"), 2, ["img-2713", "6902"]);
  const campus = pickFeatured(
    [
      ...mediaByCategory("10_Family"),
      ...mediaByPathPrefix("/images/08_Photography"),
    ],
    1,
    ["tuskegee", "family", "lake"],
  );
  const sideImages = [...pc, ...campus].slice(0, 3);
  if (sideImages.length === 0) {
    sideImages.push(...imagesOnly(mediaByCategory("01_Hero")).slice(0, 1));
  }

  return (
    <Section
      id="about"
      eyebrow="Chapter 01 — Origin"
      title="The builder before the researcher."
      subtitle={`${site.name} · ${site.major} · ${site.university} · Expected ${site.graduation}`}
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="font-display text-2xl text-mist sm:text-3xl">{aboutStory.lead}</p>
          </Reveal>
          <div className="mt-8 space-y-5">
            {aboutStory.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 24)} delay={0.08 * (i + 1)}>
                <p className="prose-brand">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            {aboutStory.whys.map((item, i) => (
              <Reveal key={item.q} delay={0.05 * i}>
                <div className="glass rounded-2xl p-5 sm:p-6">
                  <h3 className="font-display text-lg text-cyan-electric">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {sideImages.map((m, i) => (
            <Reveal key={m.src} delay={0.1 * i}>
              <MediaImage
                src={m.src}
                alt={m.originalName}
                className={`rounded-2xl border border-white/10 ${
                  i === 0 ? "aspect-[4/5] sm:col-span-2 lg:col-span-1" : "aspect-[16/11]"
                }`}
              />
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Focus</p>
              <p className="mt-3 font-display text-xl text-mist">
                AI + Robotics + Agriculture + Healthcare
              </p>
              <p className="mt-3 text-sm text-ink-400">
                Based between {site.hometown} and {site.location}.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
