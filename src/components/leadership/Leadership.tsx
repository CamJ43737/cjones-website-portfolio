import { leadership } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function Leadership() {
  const gallery = mediaAssignments.leadership;

  return (
    <Section
      id="leadership"
      eyebrow="Chapter 07 — Leadership"
      title="Community is part of the research."
      subtitle="Ambassadorship, teaching, and civic work — documenting impact beyond the lab."
      className="section-wash"
    >
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gallery.map((m, i) => (
          <Reveal key={m.src} delay={Math.min(i * 0.03, 0.24)}>
            <MediaImage
              src={m.src}
              alt={m.alt}
              fit={m.fit}
              objectPosition={m.objectPosition}
              className="aspect-[4/5] h-full"
            />
          </Reveal>
        ))}
      </div>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leadership.map((item, i) => (
          <Reveal key={item.name} delay={0.04 * i} className="h-full">
            <article className="glass flex h-full flex-col rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-tuskegee-gold/80">
                Role
              </p>
              <h3 className="mt-3 font-display text-xl text-mist">{item.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-300">{item.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
