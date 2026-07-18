"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Volume2, VolumeX, X } from "lucide-react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

const VIDEO_SRC = "/videos/hero-research.mp4";
const POSTER_SRC = "/images/02_AI_Farms/hero-drone-field.jpg";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    el.muted = true;
    const play = el.play();
    if (play) play.catch(() => setReady(false));
  }, [reduceMotion]);

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

  return (
    <>
      <div className="relative mt-10 w-full lg:mt-14">
        <div
          className={cn(
            "group relative overflow-hidden rounded-[1.35rem] border border-tuskegee-gold/25",
            "bg-charcoal/40 shadow-gold-sm backdrop-blur-xl",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-obsidian/70 via-transparent to-obsidian/30"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-px z-[1] rounded-[1.35rem] ring-1 ring-inset ring-tuskegee-gold/15"
            aria-hidden
          />

          {reduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(POSTER_SRC)}
              alt="Research field documentary still"
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="aspect-[16/9] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={asset(POSTER_SRC)}
              onCanPlay={() => setReady(true)}
              aria-label="Cinematic research documentary reel"
            >
              <source src={asset(VIDEO_SRC)} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-4 sm:p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-tuskegee-gold/90">
                Field reel
              </p>
              <p className="mt-1 max-w-xs text-sm text-mist/90">
                Research in motion — tap for sound or expand.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/55 text-mist backdrop-blur-md transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
                aria-label={muted ? "Enable sound" : "Mute video"}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-obsidian/55 text-mist backdrop-blur-md transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
                aria-label="Expand video"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {!ready && !reduceMotion && (
            <div className="pointer-events-none absolute inset-0 z-[1] bg-charcoal/40" aria-hidden />
          )}
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-obsidian/90 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded research video"
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
              className="aspect-video w-full object-contain bg-obsidian"
              loop
              playsInline
              controls
              poster={asset(POSTER_SRC)}
            >
              <source src={asset(VIDEO_SRC)} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
