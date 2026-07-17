import { awards } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByCategory, pickFeatured } from "@/lib/media";

export function Awards() {
  const photos = pickFeatured(mediaByCategory("07_Awards"), 6, [
    "nsf",
    "hackathon",
    "gsd",
    "winner",
    "auburn",
  ]);
  const gallery = photos.length ? photos : imagesOnly(mediaByCategory("07_Awards")).slice(0, 6);

  return (
    <Section
      id="awards"
      eyebrow="Chapter 06 — Recognition"
      title="Awards & distinctions."
      subtitle="Markers along the path — earned in labs, hackathons, and community."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((m, i) => (
            <Reveal key={m.src} delay={i * 0.04}>
              <MediaImage
                src={m.src}
                alt={m.originalName}
                className={`rounded-2xl border border-white/10 ${
                  i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                }`}
              />
            </Reveal>
          ))}
        </div>

        <ul className="space-y-3">
          {awards.map((a, i) => (
            <Reveal key={a.name} delay={0.04 * i}>
              <li className="glass flex items-start justify-between gap-4 rounded-2xl px-5 py-4">
                <div>
                  <p className="font-display text-lg text-mist">{a.name}</p>
                  <p className="mt-1 text-sm text-ink-400">{a.detail}</p>
                </div>
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-tuskegee-gold shadow-gold" />
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
