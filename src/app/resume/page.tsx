import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { asset } from "@/lib/asset";
import {
  certificateImages,
  industryImages,
  toGalleryItem,
} from "@/lib/portfolio-media";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Resume — ${site.name}`,
  description: `Download or view ${site.name}'s CV, resume, and supporting credentials.`,
};

export default function ResumePage() {
  const resume = asset(site.resumePath);
  const certificates = certificateImages().map((m) => toGalleryItem(m, "contain"));

  const claimed = new Set<string>([
    ...mediaAssignments.homepageIndustrySrcs,
    ...mediaAssignments.accessIndustryGallery.map((m) => m.src),
  ]);

  const industryArchive = industryImages()
    .filter((m) => !claimed.has(m.src))
    .map((m) => toGalleryItem(m, "cover"));

  return (
    <main className="section-pad pb-24 pt-28">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
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

        <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-white/10 bg-charcoal/50 shadow-glass backdrop-blur-xl">
          <iframe
            title={`${site.name} resume PDF`}
            src={resume}
            className="h-[80vh] w-full bg-mist"
          />
        </div>

        {certificates.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <p className="chapter-label">Supporting documents</p>
            <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">
              Certificates
            </h2>
            <p className="prose-brand mt-3 max-w-2xl text-sm sm:text-base">
              Supplemental credentials kept here for reference — out of the main research
              narrative.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((m) => (
                <MediaImage
                  key={m.src}
                  src={m.src}
                  alt={m.alt}
                  fit="contain"
                  objectPosition="50% 50%"
                  className="aspect-[4/5] rounded-2xl border border-tuskegee-gold/25 shadow-gold-sm"
                />
              ))}
            </div>
          </section>
        )}

        {industryArchive.length > 0 && (
          <section className="mt-20 border-t border-white/10 pt-12">
            <p className="chapter-label">Archive</p>
            <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">
              Industry & field notes
            </h2>
            <p className="prose-brand mt-3 max-w-2xl text-sm sm:text-base">
              Additional industry and collaboration frames from the road — a quieter gallery
              for the full portfolio record.
            </p>
            <div className="mt-8 columns-1 gap-3 sm:columns-2 lg:columns-3">
              {industryArchive.map((m) => (
                <MediaImage
                  key={m.src}
                  src={m.src}
                  alt={m.alt}
                  fit="cover"
                  objectPosition={m.objectPosition}
                  className="mb-3 break-inside-avoid rounded-2xl border border-white/[0.08]"
                  imgClassName="w-full"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
