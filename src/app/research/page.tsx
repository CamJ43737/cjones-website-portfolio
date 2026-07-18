import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResearchLab } from "@/components/research/ResearchLab";
import { site } from "@/data/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Research — ${site.name}`,
  description:
    "Research archive — AI Farms, Project AEGIS, ACCESS-CI, Prairie View Robotics, and CAGI & Hackathons.",
};

export default function ResearchIndexPage() {
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
          <p className="chapter-label mb-3 sm:mb-4">Research archive</p>
          <h1 className="display-title">Research</h1>
          <p className="prose-brand mt-4 text-pretty sm:mt-5">
            All project dossiers — precision agriculture, healthcare digital twins, cyberinfrastructure,
            robotics, and innovation sprints.
          </p>
        </header>
      </div>
      <ResearchLab />
    </main>
  );
}
