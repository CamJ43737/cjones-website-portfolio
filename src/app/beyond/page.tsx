import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { beyondHobbies, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByCategory, mediaByPathPrefix } from "@/lib/media";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Beyond the Lab — ${site.name}`,
  description:
    "PC building, photography, and fishing — Cameron Jones beyond research and academia.",
};

function HobbyGallery({
  id,
  title,
  theme,
  description,
  images,
}: {
  id: string;
  title: string;
  theme: string;
  description: string;
  images: { src: string; alt: string; objectPosition?: string; fit?: "cover" | "contain" }[];
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/10 pt-14 sm:pt-16">
      <p className="chapter-label">{theme}</p>
      <h2 className="mt-3 font-display text-3xl text-mist sm:text-4xl">{title}</h2>
      <p className="prose-brand mt-4">{description}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((m) => (
          <MediaImage
            key={m.src}
            src={m.src}
            alt={m.alt}
            fit={m.fit}
            objectPosition={m.objectPosition}
            className="aspect-[4/5] rounded-2xl border border-white/[0.08] sm:aspect-[3/4]"
          />
        ))}
      </div>
    </section>
  );
}

export default function BeyondPage() {
  const pcImages = imagesOnly(mediaByCategory("12_PC_Build")).map((m) => ({
    src: m.src,
    alt: m.originalName || "PC build",
    objectPosition: "50% 40%",
    fit: "cover" as const,
  }));

  const photoImages = mediaAssignments.beyondPhotography.map((m) => ({
    src: m.src,
    alt: m.alt,
    objectPosition: m.objectPosition,
    fit: m.fit,
  }));

  const fishingImages = imagesOnly(mediaByPathPrefix("/images/14_Fishing")).map((m) => ({
    src: m.src,
    alt: m.originalName || "Fishing",
    objectPosition: "50% 40%",
    fit: "cover" as const,
  }));


  const galleries = {
    "pc-building": pcImages,
    photography: photoImages,
    fishing: fishingImages,
  } as const;

  return (
    <main className="relative min-h-screen pb-24 pt-28">
      <div className="section-pad relative z-[1] mx-auto w-full max-w-6xl">
        <Link
          href="/#beyond"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <header className="mt-10 max-w-3xl text-left">
          <p className="chapter-label mb-3 sm:mb-4">Life outside academia</p>
          <h1 className="display-title">Beyond the Lab</h1>
          <p className="prose-brand mt-4 text-pretty sm:mt-5">
            Hardware builds, visual storytelling, and time outdoors — the crafts that balance
            research with curiosity in the physical world.
          </p>
        </header>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="Hobby galleries">
          {beyondHobbies.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className="rounded-full border border-white/10 bg-charcoal/30 px-4 py-2 text-sm text-ink-200 backdrop-blur-sm transition hover:border-tuskegee-gold/40 hover:text-tuskegee-gold"
            >
              {h.title}
            </a>
          ))}
        </nav>

        {beyondHobbies.map((hobby) => (
          <HobbyGallery
            key={hobby.id}
            id={hobby.id}
            title={hobby.title}
            theme={hobby.theme}
            description={hobby.description}
            images={galleries[hobby.id as keyof typeof galleries]}
          />
        ))}
      </div>
    </main>
  );
}
