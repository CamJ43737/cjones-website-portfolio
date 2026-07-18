import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Experience } from "@/components/experience/Experience";
import { site } from "@/data/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Experience — ${site.name}`,
  description:
    "Professional experience archive — research roles, robotics internships, and industry work.",
};

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen pb-8 pt-28">
      <div className="section-pad relative z-[1] mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <header className="mt-10 max-w-3xl text-left">
          <p className="chapter-label mb-3 sm:mb-4">Professional archive</p>
          <h1 className="display-title">Experience</h1>
          <p className="prose-brand mt-4 text-pretty sm:mt-5">
            Full employment and research appointment history — roles, media, and technologies.
          </p>
        </header>
      </div>
      <Experience />
    </main>
  );
}
