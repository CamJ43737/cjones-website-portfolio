import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { researchProjects } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function ResearchLab() {
  return (
    <Section
      id="research"
      eyebrow="Chapter 03 — Research Lab"
      title="Enter the laboratory."
      subtitle="Each project is a chapter in building intelligent systems for the physical world."
    >
      <div className="space-y-7">
        {researchProjects.map((project, index) => {
          const cover =
            mediaAssignments.researchCovers[
              project.slug as keyof typeof mediaAssignments.researchCovers
            ];

          return (
            <Reveal key={project.slug} delay={Math.min(index * 0.05, 0.2)}>
              <article className="group overflow-hidden rounded-[1.5rem] border border-white/[0.1] bg-charcoal/35 shadow-glass backdrop-blur-xl transition duration-500 hover:border-tuskegee-gold/35 hover:shadow-gold">
                <Link
                  href={`/research/${project.slug}`}
                  className="grid lg:grid-cols-12"
                >
                  <div className="relative min-h-[220px] overflow-hidden lg:col-span-6 lg:min-h-[340px]">
                    {cover ? (
                      cover.fit === "contain" ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/70 p-3 sm:p-4">
                          <MediaImage
                            src={cover.src}
                            alt={cover.alt}
                            fit="contain"
                            objectPosition={cover.objectPosition}
                            className="h-full w-full"
                          />
                        </div>
                      ) : (
                        <MediaImage
                          src={cover.src}
                          alt={cover.alt}
                          fit={cover.fit}
                          objectPosition={cover.objectPosition}
                          className="absolute inset-0 h-full w-full transition duration-700 ease-out group-hover:scale-[1.015]"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 bg-charcoal" />
                    )}
                    {cover?.fit !== "contain" && (
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-obsidian/20 lg:to-obsidian/70"
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className="relative flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:col-span-6 lg:px-10">
                    <p className="chapter-label">{project.eyebrow}</p>
                    <h3 className="mt-3 font-display text-2xl leading-tight text-mist sm:text-3xl lg:text-[2.15rem]">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-300 sm:text-base">
                      {project.subtitle}
                    </p>

                    <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-6">
                      {project.achievements.slice(0, 3).map((a) => (
                        <div key={a.label}>
                          <dt className="font-display text-xl text-tuskegee-gold sm:text-2xl">
                            {a.value}
                          </dt>
                          <dd className="mt-1 text-[11px] leading-snug text-ink-400">
                            {a.label}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-8 inline-flex items-center gap-2 text-sm text-mist transition group-hover:text-tuskegee-gold">
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
