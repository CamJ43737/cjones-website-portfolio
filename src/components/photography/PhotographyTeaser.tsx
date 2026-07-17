import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByPathPrefix } from "@/lib/media";

export function PhotographyTeaser() {
  const photos = imagesOnly(mediaByPathPrefix("/images/08_Photography")).slice(0, 6);

  return (
    <Section
      id="photography"
      eyebrow="Chapter 09 — Visual Journal"
      title="Seeing like a researcher."
      subtitle="A separate immersive gallery — campus light, field systems, quiet frames."
    >
      <div className="mb-8 columns-1 gap-3 sm:columns-2 lg:columns-3">
        {photos.map((m, i) => (
          <Reveal key={m.src} delay={0.04 * i} className="mb-3 break-inside-avoid">
            <MediaImage
              src={m.src}
              alt={m.originalName}
              className="rounded-2xl border border-white/10"
              imgClassName="w-full"
            />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Link
          href="/photography"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-mist transition hover:border-cyan-electric/50 hover:text-cyan-electric"
        >
          Enter the photography experience
          <ArrowUpRight size={16} />
        </Link>
      </Reveal>
    </Section>
  );
}
