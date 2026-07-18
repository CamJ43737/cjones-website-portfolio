"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Play, Volume2, VolumeX, X } from "lucide-react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  /** Muted autoplay when the player enters the viewport. */
  autoPlayWhenVisible?: boolean;
  /** Start muted playback on mount (hero). Still pauses when leaving the viewport. */
  eager?: boolean;
  /** cover fills the frame (crops letterboxing); contain shows the full frame. */
  fit?: "cover" | "contain";
  objectPosition?: string;
  /** Slight zoom for cover mode; default trims mild letterboxing without clipping faces. */
  coverScale?: number;
  /** Flush into a parent card (no outer radius/border). */
  embedded?: boolean;
  className?: string;
  /** Show expand control. Default true. */
  expandable?: boolean;
};

export function CinematicVideo({
  src,
  title,
  caption,
  poster,
  autoPlayWhenVisible = true,
  eager = false,
  fit = "contain",
  objectPosition = "50% 50%",
  coverScale = 1.06,
  embedded = false,
  className,
  expandable = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !eager || reduceMotion) return;
    el.muted = true;
    setMuted(true);
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [eager, reduceMotion]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion || expanded) return;

    if (inView && autoPlayWhenVisible && !userPaused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else if (!inView) {
      el.pause();
      setPlaying(false);
    }
  }, [inView, autoPlayWhenVisible, reduceMotion, expanded, userPaused]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  useEffect(() => {
    const modal = modalVideoRef.current;
    if (!expanded || !modal) return;
    modal.currentTime = videoRef.current?.currentTime ?? 0;
    modal.muted = muted;
    modal.play().catch(() => undefined);
  }, [expanded, muted]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
    if (modalVideoRef.current) modalVideoRef.current.muted = next;
  }

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      el.muted = muted;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      el.pause();
      setPlaying(false);
    }
  }

  const videoSrc = asset(src);
  const posterSrc = poster ? asset(poster) : undefined;

  return (
    <>
      <div ref={rootRef} className={cn("relative w-full", className)}>
        <div
          className={cn(
            "group relative h-full overflow-hidden bg-obsidian/80 backdrop-blur-xl",
            embedded
              ? "rounded-none border-0 shadow-none"
              : "rounded-[1.35rem] border border-tuskegee-gold/25 shadow-gold-sm",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-obsidian/75 via-transparent to-obsidian/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-px z-[1] rounded-[1.35rem] ring-1 ring-inset ring-tuskegee-gold/15"
            aria-hidden
          />

          {reduceMotion && posterSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterSrc}
              alt={title}
              className={cn(
                "block w-full",
                fit === "cover"
                  ? "aspect-video object-cover"
                  : "mx-auto h-auto object-contain",
              )}
              style={fit === "cover" ? { objectPosition } : undefined}
            />
          ) : fit === "cover" ? (
            <div
              className={cn(
                "relative w-full overflow-hidden bg-obsidian",
                embedded ? "aspect-[16/11] h-full min-h-[220px] md:aspect-auto md:min-h-[260px]" : "aspect-video",
              )}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition,
                  transform: `scale(${coverScale})`,
                }}
                muted
                loop
                playsInline
                preload={inView || autoPlayWhenVisible ? "metadata" : "none"}
                poster={posterSrc}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                aria-label={title}
              >
                <source src={videoSrc} />
              </video>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="mx-auto block h-auto max-h-[min(70vh,40rem)] w-full object-contain"
              muted
              loop
              playsInline
              preload={inView || autoPlayWhenVisible ? "metadata" : "none"}
              poster={posterSrc}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              aria-label={title}
            >
              <source src={videoSrc} />
            </video>
          )}

          <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tuskegee-gold/90">
                {title}
              </p>
              {caption && (
                <p className="mt-1 max-w-sm text-sm text-mist/90">{caption}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {!autoPlayWhenVisible && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/55 text-mist backdrop-blur-md transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
                  aria-label={playing ? "Pause video" : "Play video"}
                >
                  <Play size={16} className={playing ? "opacity-50" : ""} />
                </button>
              )}
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/55 text-mist backdrop-blur-md transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
                aria-label={muted ? "Enable sound" : "Mute video"}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              {expandable && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/55 text-mist backdrop-blur-md transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
                  aria-label="Expand video"
                >
                  <Maximize2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-obsidian/90 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded: ${title}`}
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-tuskegee-gold/30 bg-charcoal shadow-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/70 text-mist backdrop-blur-md hover:text-tuskegee-gold"
              aria-label="Close expanded video"
            >
              <X size={16} />
            </button>
            <video
              ref={modalVideoRef}
              className="mx-auto block h-auto max-h-[85vh] w-full object-contain bg-obsidian"
              loop
              playsInline
              controls
              poster={posterSrc}
            >
              <source src={videoSrc} />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
