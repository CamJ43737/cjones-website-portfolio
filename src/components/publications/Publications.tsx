import { publications } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByPathPrefix, pickFeatured } from "@/lib/media";
import { asset } from "@/lib/asset";

export function Publications() {
  const posters = pickFeatured(
    [
      ...mediaByPathPrefix("/images/04_Research"),
      ...imagesOnly(mediaByPathPrefix("/images/04_Research")),
    ],
    4,
    ["poster", "jars", "ai-farms", "presentation"],
  );
  const gallery = posters.length
    ? posters
    : imagesOnly(mediaByPathPrefix("/images/04_Research")).slice(0, 4);

  return (
    <Section
      id="publications"
      eyebrow="Chapter 08 — Publications"
      title="Scholarship in progress."
      subtitle="Posters, manuscripts, and research artifacts — with room to grow."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <ul className="space-y-4">
          {publications.map((pub, i) => (
            <Reveal key={pub.title} delay={0.05 * i}>
              <li className="glass rounded-2xl p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tuskegee-gold">
                  {pub.type}
                </p>
                <h3 className="mt-2 font-display text-xl text-mist">{pub.title}</h3>
                <p className="mt-2 text-sm text-ink-400">{pub.venue}</p>
              </li>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <li className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-ink-400">
              Future publications, papers, and BibTeX entries will appear here as the research
              platform grows.
            </li>
          </Reveal>
        </ul>

        <div className="grid grid-cols-2 gap-3">
          {gallery.map((m, i) => (
            <Reveal key={m.src} delay={0.05 * i}>
              <a href={asset(m.src)} target="_blank" rel="noopener noreferrer" className="block">
                <MediaImage
                  src={m.src}
                  alt={m.originalName}
                  className="aspect-[3/4] rounded-2xl border border-white/10 transition hover:border-cyan-electric/40"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
