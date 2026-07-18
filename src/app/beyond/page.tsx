import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { beyondHobbies, site } from "@/data/content";
import { videoAssignments } from "@/data/video-assignments";
import { MediaImage } from "@/components/ui/MediaImage";
import { CinematicVideo } from "@/components/ui/CinematicVideo";
import { imagesOnly, mediaByCategory, mediaByPathPrefix } from "@/lib/media";
import {
  featuredPcBuildImages,
  photographyImages,
  toGalleryItem,
} from "@/lib/portfolio-media";
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
  videos,
}: {
  id: string;
  title: string;
  theme: string;
  description: string;
  images: { src: string; alt: string; objectPosition?: string; fit?: "cover" | "contain" }[];
  videos?: {
    src: string;
    title: string;
    caption?: string;
    poster?: string;
    autoPlayWhenVisible?: boolean;
  }[];
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/10 pt-14 sm:pt-16">
      <p className="chapter-label">{theme}</p>
      <h2 className="mt-3 font-display text-3xl text-mist sm:text-4xl">{title}</h2>
      <p className="prose-brand mt-4">{description}</p>

      {videos && videos.length > 0 && (
        <div className="mt-8 grid gap-5">
          {videos.map((v) => (
            <CinematicVideo
              key={v.src}
              src={v.src}
              title={v.title}
              caption={v.caption}
              poster={v.poster}
              autoPlayWhenVisible={v.autoPlayWhenVisible ?? true}
            />
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((m) => (
          <MediaImage
            key={m.src}
            src={m.src}
            alt={m.alt}
            fit={m.fit}
            objectPosition={m.objectPosition}
            className="aspect-[4/5] sm:aspect-[3/4]"
          />
        ))}
      </div>
    </section>
  );
}

export default function BeyondPage() {
  const featuredPcSrcs = new Set<string>(featuredPcBuildImages.map((m) => m.src));
  const pcImages = [
    ...featuredPcBuildImages.map((m) => ({
      src: m.src,
      alt: m.alt,
      fit: m.fit,
      objectPosition: m.objectPosition,
    })),
    ...imagesOnly(mediaByCategory("12_PC_Build"))
      .filter((m) => !featuredPcSrcs.has(m.src) && !m.src.includes("-1."))
      .map((m) => toGalleryItem(m, "contain")),
  ];

  const photoImages = photographyImages().map((m) => {
    const contain =
      m.src.includes("behind-the-lens") ||
      m.src.includes("photographer") ||
      m.src.endsWith(".png");
    return toGalleryItem(m, contain ? "contain" : "cover");
  });

  const fishingImages = imagesOnly(mediaByPathPrefix("/images/14_Fishing")).map((m) =>
    toGalleryItem(m, "cover"),
  );

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
            videos={
              videoAssignments.beyond[
                hobby.id as keyof typeof videoAssignments.beyond
              ]
            }
          />
        ))}
      </div>
    </main>
  );
}
