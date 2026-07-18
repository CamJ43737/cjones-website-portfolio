import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function PublicationsCTA() {
  const posters = mediaAssignments.publications.slice(0, 3);

  return (
    <Section
      id="publications"
      eyebrow="Scholarship"
      title="Academic archive."
      subtitle="Posters, manuscripts, certificates, and presentations — curated for research review."
      tight
    >
      <Reveal>
        <Link
          href="/publications"
          className="glass group grid overflow-hidden rounded-[1.5rem] transition hover:border-tuskegee-gold/40 hover:shadow-gold sm:grid-cols-12"
        >
          <div className="grid grid-cols-3 gap-2 p-4 sm:col-span-5 sm:gap-3 sm:p-5">
            {posters.map((m) => (
              <MediaImage
                key={m.src}
                src={m.src}
                alt={m.alt}
                fit={m.fit ?? "contain"}
                objectPosition={m.objectPosition}
                className="aspect-[3/4]"
              />
            ))}
          </div>
          <div className="flex flex-col justify-center border-t border-white/[0.06] px-6 py-7 sm:col-span-7 sm:border-l sm:border-t-0 sm:px-9 sm:py-8">
            <p className="chapter-label">Publications · Posters · Certificates</p>
            <p className="mt-3 font-display text-xl leading-snug text-mist sm:text-2xl">
              Research publications, posters, and presentations.
            </p>
            <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-300">
              Open the scholarship archive for manuscripts in progress, conference posters, and
              supporting credentials.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-tuskegee-gold transition group-hover:gap-3">
              View publications
              <ArrowUpRight size={16} />
            </p>
          </div>
        </Link>
      </Reveal>
    </Section>
  );
}
