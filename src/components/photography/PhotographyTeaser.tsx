import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function PhotographyTeaser() {
  const photos = mediaAssignments.photographyTeaser;

  return (
    <Section
      id="photography"
      eyebrow="Chapter 09 — Visual Journal"
      title="Seeing like a researcher."
      subtitle="A separate immersive gallery — campus light, field systems, quiet frames."
    >
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((m, i) => (
          <Reveal key={m.src} delay={0.04 * i} className="h-full">
            <MediaImage
              src={m.src}
              alt={m.alt}
              fit={m.fit}
              objectPosition={m.objectPosition}
              className="aspect-[4/5] h-full w-full rounded-2xl border border-white/[0.08] sm:aspect-[3/4]"
            />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Link
          href="/photography"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-mist transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
        >
          Enter the photography experience
          <ArrowUpRight size={16} />
        </Link>
      </Reveal>
    </Section>
  );
}
