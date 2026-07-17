import { experiences } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { firstMatch, imagesOnly, mediaByCategory, mediaByPathPrefix } from "@/lib/media";

function poolFor(category: string, role: string) {
  if (role.toLowerCase().includes("coca")) {
    return mediaByPathPrefix("/images/05_Internships/coca-cola");
  }
  return mediaByCategory(category);
}

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Chapter 05 — Experience"
      title="Where the work happened."
      subtitle="Roles with impact — not job titles alone."
    >
      <div className="space-y-6">
        {experiences.map((exp, i) => {
          const pool = poolFor(exp.mediaCategory, exp.role);
          const photo =
            firstMatch(pool, exp.photoKeywords, { type: "image" }) ||
            imagesOnly(pool)[0] ||
            imagesOnly(mediaByCategory("11_Industry"))[i % 5];

          return (
            <Reveal key={exp.role} delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass overflow-hidden rounded-[1.5rem]">
                <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                  {photo && (
                    <MediaImage
                      src={photo.src}
                      alt={`${exp.org} — ${exp.role}`}
                      className="aspect-[16/11] md:aspect-auto md:min-h-full"
                    />
                  )}
                  <div className="p-6 sm:p-8">
                    <p className="font-mono text-xs text-cyan-electric">{exp.timeline}</p>
                    <h3 className="mt-2 font-display text-2xl text-mist">{exp.role}</h3>
                    <p className="mt-1 text-sm text-tuskegee-gold/90">{exp.org}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink-300 sm:text-base">
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
