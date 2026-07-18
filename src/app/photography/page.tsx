"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { photoCategories, site } from "@/data/content";
import { photographyExclusions } from "@/data/media-assignments";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByPathPrefix, mediaSearch } from "@/lib/media";
import { fitForPath } from "@/lib/image-rules";
import { cn } from "@/lib/cn";

export default function PhotographyPage() {
  const all = useMemo(
    () =>
      imagesOnly(mediaByPathPrefix("/images/08_Photography")).filter(
        (m) => !photographyExclusions.some((ex) => m.src.toLowerCase().includes(ex)),
      ),
    [],
  );
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return all;
    const cat = photoCategories.find((c) => c.id === active);
    if (!cat) return all;
    const byFolder = all.filter((m) => m.src.toLowerCase().includes(`/${cat.id}/`));
    if (byFolder.length) return byFolder;
    return mediaSearch(all, cat.keywords, { type: "image" });
  }, [active, all]);

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 pt-28">
      <div className="section-pad relative z-[1] mx-auto w-full max-w-6xl">
        <Link
          href="/#photography"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <header className="mt-10 max-w-3xl text-left">
          <p className="chapter-label mb-3 sm:mb-4">Visual Journal</p>
          <h1 className="display-title">Photography</h1>
          <p className="prose-brand mt-4 text-pretty sm:mt-5">
            Not a grid of thumbnails — a journal of light, land, machines, and people.{" "}
            {site.name} behind the lens.
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition backdrop-blur-sm",
              active === "all"
                ? "border-tuskegee-gold/45 bg-tuskegee-gold/12 text-tuskegee-gold"
                : "border-white/10 bg-charcoal/25 text-ink-300 hover:text-mist",
            )}
          >
            All
          </button>
          {photoCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition backdrop-blur-sm",
                active === c.id
                  ? "border-tuskegee-gold/45 bg-tuskegee-gold/12 text-tuskegee-gold"
                  : "border-white/10 bg-charcoal/25 text-ink-300 hover:text-mist",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-3 sm:columns-2 lg:columns-3">
          {filtered.map((m) => (
            <MediaImage
              key={m.src}
              src={m.src}
              alt={m.originalName}
              fit={fitForPath(m.src)}
              className="mb-3 min-h-[200px] break-inside-avoid rounded-2xl border border-white/[0.08]"
              imgClassName="w-full"
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-ink-400">No images in this category yet — more frames coming.</p>
        )}
      </div>
    </main>
  );
}
