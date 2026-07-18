import { experiences } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Chapter 05 — Experience"
      title="Where the work happened."
      subtitle="Roles with impact — not job titles alone."
    >
      <div className="space-y-5">
        {experiences.map((exp, i) => {
          const photo =
            mediaAssignments.experience[
              exp.role as keyof typeof mediaAssignments.experience
            ];

          return (
            <Reveal key={exp.role} delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass overflow-hidden rounded-[1.35rem]">
                <div className="grid md:grid-cols-12">
                  {photo && (
                    <MediaImage
                      src={photo.src}
                      alt={photo.alt}
                      fit={photo.fit}
                      objectPosition={photo.objectPosition}
                      className="aspect-[16/11] md:col-span-5 md:aspect-auto md:min-h-[260px] md:h-full"
                    />
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
    </Section>
  );
}
