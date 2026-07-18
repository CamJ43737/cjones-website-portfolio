import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Journey } from "@/components/timeline/Journey";
import { aboutStory, site } from "@/data/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Journey — ${site.name}`,
  description:
    "The full documentary timeline — from building computers to AI research, Tuskegee legacy, and future goals.",
};

export default function JourneyPage() {
  return (
    <main className="relative min-h-screen pb-8 pt-28">
      <div className="section-pad relative z-[1] mx-auto w-full max-w-6xl">
        <Link
          href="/#milestones"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <header className="mt-10 max-w-3xl text-left">
          <p className="chapter-label mb-3 sm:mb-4">Documentary archive</p>
          <h1 className="display-title">Journey</h1>
          <p className="mt-6 font-display text-2xl leading-snug text-mist sm:text-3xl">
            {aboutStory.lead}
          </p>
          <div className="mt-6 space-y-4">
            {aboutStory.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="prose-brand text-pretty">
                {p}
              </p>
            ))}
          </div>
        </header>
      </div>
      <Journey />
    </main>
  );
}
