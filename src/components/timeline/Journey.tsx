"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { timeline, type TimelineChapter } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { MediaImage } from "@/components/ui/MediaImage";
import { CinematicVideo } from "@/components/ui/CinematicVideo";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

function ChapterPanel({
  chapter,
  panelId,
  labelledBy,
  videoActive = true,
}: {
  chapter: TimelineChapter;
  panelId?: string;
  labelledBy: string;
  /** When false, timeline videos pause (chapter closed). */
  videoActive?: boolean;
}) {
  const imageCount = chapter.images?.length ?? 0;
  const imageGrid =
    imageCount <= 1
      ? "grid-cols-1 sm:max-w-xl"
      : imageCount === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      id={panelId}
      role={panelId ? "region" : undefined}
      aria-labelledby={labelledBy}
      className="relative overflow-hidden rounded-[1.35rem] border border-tuskegee-gold/25 bg-charcoal/55 p-5 shadow-gold-sm backdrop-blur-xl sm:p-7"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tuskegee-gold">
        {chapter.year}
      </p>
      <h3 className="mt-2 font-display text-2xl text-mist sm:text-3xl">{chapter.title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-200 sm:text-base">
        {chapter.description}
      </p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-400">{chapter.detail}</p>

      {chapter.images && chapter.images.length > 0 && (
        <div className={cn("mt-6 grid gap-3", imageGrid)}>
          {chapter.images.map((img) => (
            <MediaImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              fit={img.fit ?? "contain"}
              objectPosition={img.objectPosition ?? "50% 50%"}
              className="aspect-[4/3] w-full"
            />
          ))}
        </div>
      )}

      {chapter.videos && chapter.videos.length > 0 && videoActive && (
        <div className="mt-5 w-full">
          {chapter.videos.map((video) => (
            <CinematicVideo
              key={`${chapter.id}-${video.src}`}
              src={video.src}
              title={video.title}
              poster={video.poster}
              eager
              autoPlayWhenVisible
              fit={video.fit ?? "contain"}
              objectPosition={video.objectPosition ?? "50% 50%"}
              coverScale={video.coverScale ?? 1.06}
              className="w-full"
            />
          ))}
        </div>
      )}

      {chapter.technologies.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies and themes">
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

      {chapter.links && chapter.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopZoneRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverOpenTimer.current = null;
    hoverCloseTimer.current = null;
  }, []);

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const scheduleOpen = useCallback(
    (id: string) => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
      if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
      hoverOpenTimer.current = setTimeout(() => setOpenId(id), 180);
    },
    [],
  );

  const scheduleClose = useCallback(() => {
    if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
    hoverOpenTimer.current = null;
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => setOpenId(null), 220);
  }, []);

  const toggleMobile = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const scrollByPage = useCallback((dir: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.7, 360), behavior: "smooth" });
  }, []);

  const openChapter = timeline.find((c) => c.id === openId) ?? null;

  return (
    <Section
      id="journey"
      eyebrow="Chapter 02 — Trajectory"
      title="A timeline of becoming."
      subtitle="From opening computer cases to leading research that touches fields and homes. Hover a year on desktop — or tap on mobile — to open each chapter."
      className="section-wash"
    >
      {/* Desktop / tablet */}
      <div
        ref={desktopZoneRef}
        className="relative hidden md:block"
        onMouseLeave={scheduleClose}
      >
        <AnimatePresence mode="wait">
          {openChapter?.coverImage && (
            <motion.div
              key={openChapter.coverImage}
              className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 -z-0 overflow-hidden rounded-[1.75rem]"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(openChapter.coverImage)}
                alt=""
                className="h-full w-full object-cover opacity-[0.22]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/55 to-obsidian/85" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-[1]">
          <div className="relative">
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-[2] w-12 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent transition-opacity sm:w-16",
                canScrollLeft ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-[2] w-12 bg-gradient-to-l from-obsidian via-obsidian/80 to-transparent transition-opacity sm:w-16",
                canScrollRight ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            />

            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                className="absolute left-0 top-1/2 z-[3] -translate-y-1/2 rounded-full border border-tuskegee-gold/35 bg-obsidian/80 p-2 text-tuskegee-gold shadow-gold-sm backdrop-blur-md transition hover:border-tuskegee-gold/55"
                aria-label="Scroll timeline left"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                className="absolute right-0 top-1/2 z-[3] -translate-y-1/2 rounded-full border border-tuskegee-gold/35 bg-obsidian/80 p-2 text-tuskegee-gold shadow-gold-sm backdrop-blur-md transition hover:border-tuskegee-gold/55"
                aria-label="Scroll timeline right"
              >
                <ArrowRight size={16} />
              </button>
            )}

            <div
              ref={listRef}
              className="snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Journey years"
            >
              <div
                className="pointer-events-none absolute left-0 right-0 top-[1.35rem] h-px bg-gradient-to-r from-transparent via-tuskegee-gold/50 to-transparent"
                aria-hidden
              />
              <div className="relative flex min-w-max items-start gap-2 px-8 sm:px-10">
                {timeline.map((chapter) => {
                  const selected = openId === chapter.id;
                  const buttonId = `${baseId}-desktop-${chapter.id}`;
                  const panelId = `${baseId}-panel-${chapter.id}`;
                  return (
                    <div
                      key={chapter.id}
                      className="flex w-[9.5rem] shrink-0 snap-start flex-col items-center lg:w-[10.5rem]"
                    >
                      <button
                        type="button"
                        id={buttonId}
                        role="tab"
                        aria-selected={selected}
                        aria-expanded={selected}
                        aria-controls={panelId}
                        onMouseEnter={() => scheduleOpen(chapter.id)}
                        onFocus={() => scheduleOpen(chapter.id)}
                        onClick={() => setOpenId(chapter.id)}
                        className={cn(
                          "group relative flex w-full flex-col items-center rounded-2xl px-2 py-3 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold",
                          selected ? "bg-tuskegee-gold/10" : "hover:bg-white/[0.03]",
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="mt-6 min-h-[1px]"
            onMouseEnter={() => {
              if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
              hoverCloseTimer.current = null;
            }}
            onMouseLeave={scheduleClose}
          >
            <AnimatePresence mode="wait">
              {openChapter && (
                <motion.div
                  key={openChapter.id}
                  initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: 10, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
      </div>

      {/* Mobile accordion */}
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
                onClick={() => toggleMobile(chapter.id)}
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
