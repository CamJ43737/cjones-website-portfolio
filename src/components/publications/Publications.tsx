import { publications } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { certificateImages, toGalleryItem } from "@/lib/portfolio-media";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { asset } from "@/lib/asset";

export function Publications() {
  const gallery = mediaAssignments.publications;
  const certificates = certificateImages().map((m) => toGalleryItem(m, "contain"));

  return (
    <Section
      id="publications"
      eyebrow="Chapter 08 — Publications"
      title="Scholarship in progress."
      subtitle="Posters, manuscripts, and research artifacts — with room to grow."
    >
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <ul className="space-y-4 lg:col-span-6">
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

        <div className="grid grid-cols-2 gap-3 lg:col-span-6">
          {gallery.map((m, i) => (
            <Reveal key={m.src} delay={0.05 * i}>
              <a href={asset(m.src)} target="_blank" rel="noopener noreferrer" className="group block">
                <MediaImage
                  src={m.src}
                  alt={m.alt}
                  fit={m.fit ?? "contain"}
                  objectPosition={m.objectPosition}
                  className="aspect-[3/4]"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-12">
          <p className="chapter-label">Credentials</p>
          <h3 className="mt-3 font-display text-2xl text-mist sm:text-3xl">Certificates</h3>
          <p className="prose-brand mt-3 max-w-2xl text-sm sm:text-base">
            Supporting credentials shown alongside the research record — kept clear of the poster
            gallery.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((m, i) => (
              <Reveal key={m.src} delay={Math.min(i * 0.04, 0.2)}>
                <a
                  href={asset(m.src)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <MediaImage
                    src={m.src}
                    alt={m.alt}
                    fit="contain"
                    objectPosition="50% 50%"
                    className="aspect-[4/5]"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
