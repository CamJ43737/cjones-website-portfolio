import { leadership } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByCategory, pickFeatured } from "@/lib/media";

export function Leadership() {
  const photos = pickFeatured(mediaByCategory("06_Leadership"), 4, [
    "workshop",
    "mayor",
    "speaking",
    "volunteer",
    "smart-ag",
  ]);
  const gallery =
    photos.length > 0 ? photos : imagesOnly(mediaByCategory("06_Leadership")).slice(0, 4);

  return (
    <Section
      id="leadership"
      eyebrow="Chapter 07 — Leadership"
      title="Community is part of the research."
      subtitle="Ambassadorship, teaching, and civic work — documenting impact beyond the lab."
      className="bg-gradient-to-b from-transparent via-graphite/30 to-transparent"
    >
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((m, i) => (
          <Reveal key={m.src} delay={i * 0.05}>
            <MediaImage
              src={m.src}
              alt={m.originalName}
              className="aspect-[4/5] rounded-2xl border border-white/10"
            />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leadership.map((item, i) => (
          <Reveal key={item.name} delay={0.04 * i}>
            <article className="glass h-full rounded-2xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-electric/80">
                Role
              </p>
              <h3 className="mt-3 font-display text-xl text-mist">{item.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-300">{item.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
