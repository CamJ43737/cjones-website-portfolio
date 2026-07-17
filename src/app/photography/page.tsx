"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { photoCategories, site } from "@/data/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByPathPrefix, mediaSearch } from "@/lib/media";
import { cn } from "@/lib/cn";

export default function PhotographyPage() {
  const all = useMemo(
    () => imagesOnly(mediaByPathPrefix("/images/08_Photography")),
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
    <main className="min-h-screen pb-24 pt-28">
      <div className="section-pad mx-auto max-w-6xl">
        <Link
          href="/#photography"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-cyan-electric"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <p className="chapter-label mt-10">Visual Journal</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-mist sm:text-6xl">
          Photography
        </h1>
        <p className="prose-brand mt-5 max-w-2xl">
          Not a grid of thumbnails — a journal of light, land, machines, and people.{" "}
          {site.name} behind the lens.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              active === "all"
                ? "border-cyan-electric/50 bg-cyan-electric/15 text-cyan-electric"
                : "border-white/10 text-ink-300 hover:text-mist",
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
                "rounded-full border px-4 py-2 text-sm transition",
                active === c.id
                  ? "border-cyan-electric/50 bg-cyan-electric/15 text-cyan-electric"
                  : "border-white/10 text-ink-300 hover:text-mist",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section-pad mx-auto mt-12 max-w-6xl columns-1 gap-3 sm:columns-2 lg:columns-3">
        {filtered.map((m) => (
          <MediaImage
            key={m.src}
            src={m.src}
            alt={m.originalName}
            className="mb-3 break-inside-avoid rounded-2xl border border-white/10"
            imgClassName="w-full"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="section-pad mx-auto mt-10 max-w-6xl text-ink-400">
          No images in this category yet — more frames coming.
        </p>
      )}
    </main>
  );
}
