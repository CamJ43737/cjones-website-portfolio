import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experiences, selectedExperienceRoles } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function SelectedExperience() {
  const selected = experiences.filter((exp) =>
    (selectedExperienceRoles as readonly string[]).includes(exp.role),
  );

  return (
    <Section
      id="experience"
      eyebrow="Selected Experience"
      title="Where the work happened."
      subtitle="Selected experiences where research, engineering, and innovation came to life."
    >
      <div className="space-y-5">
        {selected.map((exp, i) => {
          const photo =
            mediaAssignments.experience[
              exp.role as keyof typeof mediaAssignments.experience
            ];
          const caption =
            exp.role === "AI Farms Research Assistant / Coordinator"
              ? "AI Farms field research and team collaboration in precision agriculture."
              : exp.role === "MS-CC Research Intern"
                ? "Project AEGIS digital twin simulation for aging-in-place research."
                : exp.role === "ACCESS-CI Software Engineering Intern"
                  ? "ACCESS-CI NSF internship — research cyberinfrastructure collaboration."
                  : undefined;

          return (
            <Reveal key={exp.role} delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass overflow-hidden rounded-[1.35rem]">
                <div className="grid md:grid-cols-12">
                  {photo && (
                    <figure className="flex h-full flex-col md:col-span-5">
                      <MediaImage
                        src={photo.src}
                        alt={photo.alt}
                        fit={photo.fit}
                        objectPosition={photo.objectPosition}
                        className="aspect-[16/11] w-full md:aspect-auto md:min-h-[240px] md:flex-1"
                      />
                      {caption && (
                        <figcaption className="border-t border-white/[0.06] bg-obsidian/30 px-4 py-2.5 text-[11px] leading-snug text-ink-400 sm:text-xs">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  <div className="flex flex-col justify-center px-6 py-7 sm:px-8 md:col-span-7">
                    <p className="font-mono text-xs tracking-wide text-tuskegee-gold">
                      {exp.timeline}
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-snug text-mist sm:text-2xl">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-sm text-tuskegee-muted">{exp.org}</p>
                    <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink-300 sm:text-base">
                      {exp.impact}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {exp.technologies.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-300"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-10">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/30 px-6 py-3 text-sm text-mist backdrop-blur-sm transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
          >
            View full experience
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
