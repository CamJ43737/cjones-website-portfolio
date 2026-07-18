import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { beyondHobbies } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";

export function BeyondTheLab() {
  return (
    <Section
      id="beyond"
      eyebrow="Chapter 09 — Beyond the Lab"
      title="Beyond the Lab."
      subtitle="Identity outside academia — building, seeing, and finding balance in the physical world."
      className="section-wash"
    >
      <div className="space-y-7">
        {beyondHobbies.map((hobby, index) => (
          <Reveal key={hobby.id} delay={Math.min(index * 0.05, 0.2)}>
            <article className="group overflow-hidden rounded-[1.5rem] border border-white/[0.1] bg-charcoal/35 shadow-glass backdrop-blur-xl transition duration-500 hover:border-tuskegee-gold/35 hover:shadow-gold">
              <Link href={`/beyond#${hobby.id}`} className="grid lg:grid-cols-12">
                <div className="relative min-h-[220px] overflow-hidden lg:col-span-6 lg:min-h-[320px]">
                  {hobby.coverFit === "contain" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-obsidian/70 p-3 sm:p-4">
                      <MediaImage
                        src={hobby.coverSrc}
                        alt={hobby.title}
                        fit="contain"
                        objectPosition={hobby.coverPosition}
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <>
                      <MediaImage
                        src={hobby.coverSrc}
                        alt={hobby.title}
                        fit={hobby.coverFit ?? "cover"}
                        objectPosition={hobby.coverPosition}
                        className="absolute inset-0 h-full w-full"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-obsidian/20 lg:to-obsidian/70"
                        aria-hidden
                      />
                    </>
                  )}
                </div>

                <div className="relative flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:col-span-6 lg:px-10">
                  <p className="chapter-label">{hobby.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-mist sm:text-3xl lg:text-[2.15rem]">
                    {hobby.title}
                  </h3>
                  <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink-200 sm:text-base">
                    {hobby.description}
                  </p>
                  <p className="mt-8 inline-flex items-center gap-2 text-sm text-mist transition group-hover:text-tuskegee-gold">
                    Open gallery
                    <ArrowUpRight size={16} />
                  </p>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-10">
          <Link
            href="/beyond"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/30 px-6 py-3 text-sm text-mist backdrop-blur-sm transition hover:border-tuskegee-gold/45 hover:text-tuskegee-gold"
          >
            Explore Beyond the Lab
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
