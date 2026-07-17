import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { site } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/asset";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Resume — ${site.name}`,
  description: `Download or view ${site.name}'s CV and resume.`,
};

export default function ResumePage() {
  const resume = asset(site.resumePath);

  return (
    <main className="section-pad pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-cyan-electric"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <p className="chapter-label mt-10">Credentials</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-mist sm:text-5xl">
          Resume
        </h1>
        <p className="prose-brand mt-4 max-w-2xl">
          A concise record of research, internships, and impact. Download the PDF or preview
          below.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={resume} download>
            <Download size={16} /> Download Resume
          </Button>
          <Button href={resume} variant="ghost" external>
            Open in new tab
          </Button>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-white/10 bg-graphite shadow-glass">
          <iframe
            title={`${site.name} resume PDF`}
            src={resume}
            className="h-[80vh] w-full bg-mist"
          />
        </div>
      </div>
    </main>
  );
}
