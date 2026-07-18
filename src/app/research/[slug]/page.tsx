import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { researchProjects, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { imagesOnly, mediaByCategory } from "@/lib/media";
import { videoAssignments } from "@/data/video-assignments";
import { asset } from "@/lib/asset";
import { CinematicVideo } from "@/components/ui/CinematicVideo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return researchProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = researchProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.subtitle,
  };
}

export default async function ResearchProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = researchProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  const cover =
    mediaAssignments.researchCovers[
      project.slug as keyof typeof mediaAssignments.researchCovers
    ];
  const pool = mediaByCategory(project.mediaCategory);
  const curatedAccess =
    project.slug === "access-ci" ? mediaAssignments.accessIndustryGallery : null;
  const gallery = curatedAccess
    ? curatedAccess.map((m) => ({
        src: m.src,
        originalName: m.alt,
      }))
    : imagesOnly(pool)
        .filter((m) => m.src !== cover?.src)
        .slice(0, 12);
  const videos =
    videoAssignments.research[
      project.slug as keyof typeof videoAssignments.research
    ] ?? [];

  return (
    <main className="section-pad pb-24 pt-28">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/#research"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Back to Research Lab
        </Link>

        <p className="chapter-label mt-10">{project.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.05] text-mist sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="prose-brand mt-5">{project.subtitle}</p>

        {project.award && (
          <p className="mt-4 font-mono text-sm text-tuskegee-gold">{project.award}</p>
        )}
        {project.institutions && (
          <p className="mt-2 text-sm text-ink-400">{project.institutions.join(" · ")}</p>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/#connect">Collaborate</Button>
          <Button href={asset(site.resumePath)} variant="ghost" download>
            Download Resume
          </Button>
        </div>

        {cover && (
          <MediaImage
            src={cover.src}
            alt={cover.alt}
            priority
            fit={cover.fit}
            objectPosition={cover.objectPosition}
            className={
              cover.fit === "contain"
                ? "mt-12 aspect-[4/5] sm:aspect-[16/10]"
                : "mt-12 aspect-[16/9] sm:aspect-[21/9]"
            }
          />
        )}

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-10 lg:col-span-7">
            <section>
              <h2 className="font-display text-2xl text-mist">Problem</h2>
              <ul className="mt-4 space-y-3">
                {project.problem.map((p) => (
                  <li
                    key={p}
                    className="glass rounded-xl px-4 py-3 text-sm text-ink-300 sm:text-base"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-mist">Research narrative</h2>
              <div className="mt-4 space-y-4">
                {project.narrative.map((p) => (
                  <p key={p.slice(0, 32)} className="prose-brand">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {videos.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-mist">Field video</h2>
                <div className="mt-4 grid gap-5">
                  {videos.map((v) => (
                    <CinematicVideo
                      key={v.src}
                      src={v.src}
                      title={v.title}
                      caption={v.caption}
                      poster={v.poster}
                      autoPlayWhenVisible={v.autoPlayWhenVisible ?? true}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5 lg:col-span-5">
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Role</p>
              <p className="mt-3 font-display text-xl text-mist">{project.role}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Impact</p>
              <dl className="mt-4 space-y-4">
                {project.achievements.map((a) => (
                  <div key={a.label}>
                    <dt className="font-display text-2xl text-tuskegee-gold">{a.value}</dt>
                    <dd className="text-sm text-ink-400">{a.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Technologies</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {gallery.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl text-mist">Gallery</h2>
            <div className="mt-6 columns-1 gap-3 sm:columns-2 lg:columns-3">
              {gallery.map((m) => (
                <MediaImage
                  key={m.src}
                  src={m.src}
                  alt={m.originalName}
                  className="mb-3 min-h-[180px] break-inside-avoid"
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
