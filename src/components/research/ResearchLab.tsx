import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { researchProjects } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { firstMatch, mediaByCategory, imagesOnly } from "@/lib/media";

export function ResearchLab() {
  return (
    <Section
      id="research"
      eyebrow="Chapter 03 — Research Lab"
      title="Enter the laboratory."
      subtitle="Each project is a chapter in building intelligent systems for the physical world."
    >
      <div className="space-y-8">
        {researchProjects.map((project, index) => {
          const pool = mediaByCategory(project.mediaCategory);
          const cover =
            firstMatch(pool, project.featuredKeywords, { type: "image" }) ||
            imagesOnly(pool)[0];

          return (
            <Reveal key={project.slug} delay={Math.min(index * 0.05, 0.2)}>
              <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-graphite/50 shadow-glass backdrop-blur-xl transition hover:border-cyan-electric/30 hover:shadow-glow">
                <Link
                  href={`/research/${project.slug}`}
                  className="grid lg:grid-cols-[1.05fr_0.95fr]"
                >
                  <div className="relative min-h-[240px] overflow-hidden lg:min-h-[360px]">
                    {cover ? (
                      <MediaImage
                        src={cover.src}
                        alt={`${project.title} research visual`}
                        className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-obsidian" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent lg:bg-gradient-to-r" />
                  </div>

                  <div className="relative flex flex-col justify-center p-7 sm:p-10">
                    <p className="chapter-label">{project.eyebrow}</p>
                    <h3 className="mt-3 font-display text-3xl text-mist sm:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-base">
                      {project.subtitle}
                    </p>

                    <dl className="mt-8 grid grid-cols-3 gap-3">
                      {project.achievements.slice(0, 3).map((a) => (
                        <div key={a.label}>
                          <dt className="font-display text-xl text-cyan-electric sm:text-2xl">
                            {a.value}
                          </dt>
                          <dd className="mt-1 text-[11px] leading-snug text-ink-400">
                            {a.label}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-8 inline-flex items-center gap-2 text-sm text-mist transition group-hover:text-cyan-electric">
                      Open project dossier
                      <ArrowUpRight size={16} />
                    </p>
                  </div>
                </Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
