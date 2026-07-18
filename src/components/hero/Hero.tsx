"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import { hero, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Particles } from "@/components/motion/Particles";
import { TuskegeeSealWatermark } from "@/components/brand/TuskegeeAtmosphere";
import { HeroVideo } from "@/components/hero/HeroVideo";

export function Hero() {
  const reduce = useReducedMotion();
  const portrait = mediaAssignments.hero;

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-lab-grid bg-grid opacity-15" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian/50"
        aria-hidden
      />
      <Particles />
      <TuskegeeSealWatermark
        size="lg"
        className="bottom-[-2rem] right-[-1rem] opacity-80 sm:bottom-8 sm:right-8 lg:right-[8%]"
      />

      <div className="section-pad relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end pb-14 pt-28 sm:pb-16 lg:justify-center lg:pb-20 lg:pt-24">
        <div className="grid items-end gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="text-left lg:col-span-7">
            <motion.p
              className="chapter-label mb-4 sm:mb-5"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {site.university} · Class of {site.graduation.split(" ").pop()}
            </motion.p>

            <motion.h1
              className="font-display text-[clamp(2.75rem,8.5vw,6.1rem)] font-semibold leading-[0.95] tracking-tight text-mist"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 }}
            >
              {hero.name}
            </motion.h1>

            <motion.div
              className="mt-5 space-y-1 font-display text-xl text-ink-200 sm:mt-6 sm:text-2xl md:text-3xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
            >
              {hero.roles.map((role) => (
                <p key={role} className="text-balance">
                  <span className="text-tuskegee-gold">{role.split(".")[0]}</span>
                  <span className="text-ink-400">.</span>
                </p>
              ))}
            </motion.div>

            <motion.p
              className="prose-brand mt-6 text-pretty sm:mt-8"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
            >
              {hero.statement}
            </motion.p>

            <motion.p
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400 sm:mt-5 sm:text-xs sm:tracking-[0.22em]"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.36 }}
            >
              {hero.domains.join("  ·  ")}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
            >
              <Button href="/#research">
                Explore Research
                <ArrowDownRight size={16} />
              </Button>
              <Button href={asset(site.resumePath)} variant="ghost" download>
                <Download size={16} />
                Download Resume
              </Button>
            </motion.div>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-tuskegee-gold/75 sm:mt-10">
              {site.tagline}
            </p>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-sm sm:max-w-md lg:col-span-5 lg:mx-0 lg:max-w-none"
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div
              className="absolute -inset-4 rounded-[2rem] bg-tuskegee-gold/10 blur-3xl sm:-inset-5"
              aria-hidden
            />
            <MediaImage
              src={portrait.src}
              alt={portrait.alt}
              priority
              fit={portrait.fit}
              objectPosition={portrait.objectPosition}
              className="relative aspect-[4/5] rounded-[1.25rem] border border-white/10 shadow-gold sm:rounded-[1.35rem]"
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.5 }}
        >
          <HeroVideo />
        </motion.div>
      </div>
    </section>
  );
}
