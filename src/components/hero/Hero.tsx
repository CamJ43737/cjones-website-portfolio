"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import { hero, site } from "@/data/content";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Particles } from "@/components/motion/Particles";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-lab-grid bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-radial-fade" aria-hidden />
      <Particles />

      <div className="section-pad relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end pb-16 pt-28 lg:justify-center lg:pb-24 lg:pt-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <div>
            <motion.p
              className="chapter-label mb-5"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {site.university} · Class of {site.graduation.split(" ").pop()}
            </motion.p>

            <motion.h1
              className="font-display text-[clamp(3.2rem,10vw,6.5rem)] font-semibold leading-[0.95] tracking-tight text-mist"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 }}
            >
              {hero.name}
            </motion.h1>

            <motion.div
              className="mt-6 space-y-1 font-display text-2xl text-ink-200 sm:text-3xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
            >
              {hero.roles.map((role) => (
                <p key={role} className="text-balance">
                  <span className="text-cyan-electric">{role.split(".")[0]}</span>
                  <span className="text-ink-400">.</span>
                </p>
              ))}
            </motion.div>

            <motion.p
              className="prose-brand mt-8 max-w-xl text-pretty"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
            >
              {hero.statement}
            </motion.p>

            <motion.p
              className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-ink-400"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.36 }}
            >
              {hero.domains.join("  ·  ")}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
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

            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.28em] text-tuskegee-gold/80">
              {site.tagline}
            </p>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-cyan-electric/10 blur-3xl" aria-hidden />
            <MediaImage
              src="/images/01_Hero/hero-headshot.jpg"
              alt="Cameron Jones professional headshot"
              priority
              className="relative aspect-[4/5] rounded-[1.5rem] border border-white/10 shadow-glow"
              imgClassName="object-cover object-top"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
