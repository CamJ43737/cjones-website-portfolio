import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";
import { publications, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { certificateImages, toGalleryItem } from "@/lib/portfolio-media";
import { mediaByPathPrefix } from "@/lib/media";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/motion/Reveal";
import { asset } from "@/lib/asset";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Publications — ${site.name}`,
  description:
    "Academic archive — manuscripts, research posters, certificates, and presentations.",
};

export default function PublicationsPage() {
  const posters = mediaAssignments.publications;
  const certificates = certificateImages().map((m) => toGalleryItem(m, "contain"));
  const presentationMedia = mediaByPathPrefix("/images/04_Research/presentations/");

  return (
    <main className="relative min-h-screen pb-24 pt-28">
      <div className="section-pad relative z-[1] mx-auto w-full max-w-6xl">
        <Link
          href="/#publications"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <header className="mt-10 max-w-3xl text-left">
          <p className="chapter-label mb-3 sm:mb-4">Academic archive</p>
          <h1 className="display-title">Publications</h1>
          <p className="prose-brand mt-4 text-pretty sm:mt-5">
            Manuscripts, posters, certificates, and presentations — the scholarship record in one
            place.
          </p>
        </header>

        {/* Publications (manuscripts / research entries) */}
        <section className="mt-14 scroll-mt-24 border-t border-white/10 pt-12" id="manuscripts">
          <p className="chapter-label">Publications</p>
          <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">Manuscripts & research</h2>
          <ul className="mt-8 space-y-4">
            {publications.map((pub, i) => (
              <Reveal key={pub.title} delay={0.05 * i}>
                <li className="glass rounded-2xl p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tuskegee-gold">
                    {pub.type}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-mist">{pub.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{pub.venue}</p>
                </li>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <li className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-ink-400">
                Future publications, papers, and BibTeX entries will appear here as the research
                platform grows.
              </li>
            </Reveal>
          </ul>
        </section>

        {/* Research Posters */}
        <section className="mt-16 scroll-mt-24 border-t border-white/10 pt-12" id="posters">
          <p className="chapter-label">Visual scholarship</p>
          <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">Research Posters</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {posters.map((m, i) => (
              <Reveal key={m.src} delay={0.05 * i}>
                <a
                  href={asset(m.src)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <MediaImage
                    src={m.src}
                    alt={m.alt}
                    fit={m.fit ?? "contain"}
                    objectPosition={m.objectPosition}
                    className="aspect-[3/4]"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mt-16 scroll-mt-24 border-t border-white/10 pt-12" id="certificates">
            <p className="chapter-label">Credentials</p>
            <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">Certificates</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((m, i) => (
                <Reveal key={m.src} delay={Math.min(i * 0.04, 0.2)}>
                  <a
                    href={asset(m.src)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <MediaImage
                      src={m.src}
                      alt={m.alt}
                      fit="contain"
                      objectPosition="50% 50%"
                      className="aspect-[4/5]"
                    />
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Presentations */}
        <section className="mt-16 scroll-mt-24 border-t border-white/10 pt-12" id="presentations">
          <p className="chapter-label">Talks & decks</p>
          <h2 className="mt-3 font-display text-2xl text-mist sm:text-3xl">Presentations</h2>
          {presentationMedia.length > 0 ? (
            <ul className="mt-8 space-y-3">
              {presentationMedia.map((m, i) => (
                <Reveal key={m.src} delay={Math.min(i * 0.04, 0.2)}>
                  <li>
                    <a
                      href={asset(m.src)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition hover:border-tuskegee-gold/35"
                    >
                      <span className="flex items-center gap-3 text-sm text-mist">
                        <FileText size={18} className="shrink-0 text-tuskegee-gold" />
                        {m.originalName.replace(/[-_]/g, " ").replace(/\.\w+$/, "")}
                      </span>
                      <ArrowUpRight size={16} className="shrink-0 text-ink-400" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="prose-brand mt-6 text-sm">Presentation materials will appear here.</p>
          )}
        </section>
      </div>
    </main>
  );
}
