import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { researchProjects, site } from "@/data/content";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { imagesOnly, mediaByCategory, mediaSearch, videosOnly } from "@/lib/media";
import { asset } from "@/lib/asset";
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

  const pool = mediaByCategory(project.mediaCategory);
  const featured = mediaSearch(pool, project.featuredKeywords, { type: "image" });
  const gallery = [...featured, ...imagesOnly(pool).filter((m) => !featured.includes(m))].slice(
    0,
    12,
  );
  const videos = videosOnly(pool).slice(0, 3);

  return (
    <main className="section-pad pb-24 pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#research"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-cyan-electric"
        >
          <ArrowLeft size={16} /> Back to Research Lab
        </Link>

        <p className="chapter-label mt-10">{project.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold text-mist sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        <p className="prose-brand mt-5 max-w-3xl">{project.subtitle}</p>

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

        {gallery[0] && (
          <MediaImage
            src={gallery[0].src}
            alt={`${project.title} hero`}
            priority
            className="mt-12 aspect-[21/9] rounded-[1.75rem] border border-white/10 shadow-glow"
          />
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-10">
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
                <div className="mt-4 grid gap-4">
                  {videos.map((v) => (
                    <video
                      key={v.src}
                      controls
                      playsInline
                      className="w-full rounded-2xl border border-white/10"
                      src={asset(v.src)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Role</p>
              <p className="mt-3 font-display text-xl text-mist">{project.role}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="chapter-label">Impact</p>
              <dl className="mt-4 space-y-4">
                {project.achievements.map((a) => (
                  <div key={a.label}>
                    <dt className="font-display text-2xl text-cyan-electric">{a.value}</dt>
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

        {gallery.length > 1 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl text-mist">Gallery</h2>
            <div className="mt-6 columns-1 gap-3 sm:columns-2 lg:columns-3">
              {gallery.slice(1).map((m) => (
                <MediaImage
                  key={m.src}
                  src={m.src}
                  alt={m.originalName}
                  className="mb-3 break-inside-avoid rounded-2xl border border-white/10"
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
