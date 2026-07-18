"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { timeline, type TimelineChapter } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { MediaImage } from "@/components/ui/MediaImage";
import { CinematicVideo } from "@/components/ui/CinematicVideo";
import { cn } from "@/lib/cn";

function ChapterPanel({
  chapter,
  panelId,
  labelledBy,
}: {
  chapter: TimelineChapter;
  panelId?: string;
  labelledBy: string;
}) {
  return (
    <div
      id={panelId}
      role={panelId ? "region" : undefined}
      aria-labelledby={labelledBy}
      className="glass overflow-hidden rounded-[1.35rem] border border-tuskegee-gold/25 p-5 shadow-gold-sm sm:p-7"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tuskegee-gold">
        {chapter.year}
      </p>
      <h3 className="mt-2 font-display text-2xl text-mist sm:text-3xl">{chapter.title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-200 sm:text-base">
        {chapter.description}
      </p>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-400">{chapter.detail}</p>

      {chapter.technologies.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies and themes">
          {chapter.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-tuskegee-gold/30 bg-tuskegee-gold/10 px-3 py-1 text-xs text-tuskegee-gold"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      {chapter.images && chapter.images.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapter.images.map((img) => (
            <MediaImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              fit={img.fit ?? "contain"}
              objectPosition={img.objectPosition ?? "50% 50%"}
              className="aspect-[4/3] rounded-2xl border border-tuskegee-gold/25"
            />
          ))}
        </div>
      )}

      {chapter.videos && chapter.videos.length > 0 && (
        <div className="mt-5 grid gap-4">
          {chapter.videos.map((video) => (
            <CinematicVideo
              key={video.src}
              src={video.src}
              title={video.title}
              poster={video.poster}
              autoPlayWhenVisible={false}
              fit="contain"
            />
          ))}
        </div>
      )}

      {chapter.links && chapter.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {chapter.links.map((link) =>
            link.external || link.href.startsWith("http") ? (
              <a
                key={link.href + link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-mist transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-mist transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function Journey() {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openChapter = timeline.find((c) => c.id === openId) ?? null;

  return (
    <Section
      id="journey"
      eyebrow="Chapter 02 — Trajectory"
      title="A timeline of becoming."
      subtitle="From opening computer cases to leading research that touches fields and homes. Select a year to open the chapter."
      className="section-wash"
    >
      {/* Desktop / tablet: horizontal timeline */}
      <div className="hidden md:block">
        <div
          ref={listRef}
          className="relative overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Journey years"
        >
          <div
            className="pointer-events-none absolute left-0 right-0 top-[1.35rem] h-px bg-gradient-to-r from-transparent via-tuskegee-gold/50 to-transparent"
            aria-hidden
          />
          <div className="relative flex min-w-max items-start gap-2 px-1">
            {timeline.map((chapter, index) => {
              const selected = openId === chapter.id;
              const buttonId = `${baseId}-desktop-${chapter.id}`;
              const panelId = `${baseId}-panel-${chapter.id}`;
              return (
                <div key={chapter.id} className="flex w-[9.5rem] flex-col items-center lg:w-[10.5rem]">
                  <button
                    type="button"
                    id={buttonId}
                    role="tab"
                    aria-selected={selected}
                    aria-expanded={selected}
                    aria-controls={panelId}
                    onClick={() => toggle(chapter.id)}
                    className={cn(
                      "group relative flex w-full flex-col items-center rounded-2xl px-2 py-3 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold",
                      selected
                        ? "bg-tuskegee-gold/10"
                        : "hover:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-[1] mb-3 h-3 w-3 rounded-full border-2 border-obsidian transition",
                        selected
                          ? "scale-110 bg-tuskegee-gold shadow-gold-sm"
                          : "bg-tuskegee-muted/80 group-hover:bg-tuskegee-gold",
                      )}
                      aria-hidden
                    />
                    <span className="font-mono text-xs tracking-[0.2em] text-tuskegee-gold">
                      {chapter.year}
                    </span>
                    <span className="mt-2 line-clamp-2 font-display text-sm leading-snug text-mist lg:text-base">
                      {chapter.title}
                    </span>
                  </button>
                  {index < timeline.length - 1 && (
                    <span className="sr-only">Next chapter</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 min-h-[1px]">
          <AnimatePresence mode="wait">
            {openChapter && (
              <motion.div
                key={openChapter.id}
                initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChapterPanel
                  chapter={openChapter}
                  panelId={`${baseId}-panel-${openChapter.id}`}
                  labelledBy={`${baseId}-desktop-${openChapter.id}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: vertical accordion */}
      <ol className="relative space-y-3 md:hidden">
        <div
          className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-gradient-to-b from-tuskegee-gold/55 via-white/10 to-tuskegee-muted/40"
          aria-hidden
        />
        {timeline.map((chapter) => {
          const selected = openId === chapter.id;
          const buttonId = `${baseId}-mobile-${chapter.id}`;
          const panelId = `${baseId}-mobile-panel-${chapter.id}`;
          return (
            <li key={chapter.id} className="relative pl-12">
              <span
                className={cn(
                  "absolute left-[0.85rem] top-5 h-2.5 w-2.5 rounded-full border-2 border-obsidian transition",
                  selected ? "bg-tuskegee-gold shadow-gold-sm" : "bg-tuskegee-muted",
                )}
                aria-hidden
              />
              <button
                type="button"
                id={buttonId}
                aria-expanded={selected}
                aria-controls={panelId}
                onClick={() => toggle(chapter.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold",
                  selected
                    ? "border-tuskegee-gold/35 bg-tuskegee-gold/10"
                    : "border-white/10 bg-charcoal/30 hover:border-tuskegee-gold/25",
                )}
              >
                <span>
                  <span className="font-mono text-xs tracking-[0.2em] text-tuskegee-gold">
                    {chapter.year}
                  </span>
                  <span className="mt-1 block font-display text-lg text-mist">
                    {chapter.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-400">{chapter.detail}</span>
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "mt-1 shrink-0 text-tuskegee-gold transition",
                    selected && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              <AnimatePresence initial={false}>
                {selected && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      <ChapterPanel chapter={chapter} labelledBy={buttonId} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
