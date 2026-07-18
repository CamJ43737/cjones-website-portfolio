import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { beyondHobbies } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { imagesOnly, mediaByCategory, mediaByPathPrefix } from "@/lib/media";
import { mediaAssignments } from "@/data/media-assignments";

function countForHobby(id: string): number {
  if (id === "pc-building") {
    return imagesOnly(mediaByCategory("12_PC_Build")).length;
  }
  if (id === "fishing") {
    return imagesOnly(mediaByPathPrefix("/images/14_Fishing")).length;
  }
  return mediaAssignments.beyondPhotography.length;
}

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
        {beyondHobbies.map((hobby, index) => {
          const count = countForHobby(hobby.id);
          return (
            <Reveal key={hobby.id} delay={Math.min(index * 0.05, 0.2)}>
              <article className="group overflow-hidden rounded-[1.5rem] border border-white/[0.1] bg-charcoal/35 shadow-glass backdrop-blur-xl transition duration-500 hover:border-tuskegee-gold/35 hover:shadow-gold">
                <Link href={`/beyond#${hobby.id}`} className="grid lg:grid-cols-12">
                  <div className="relative min-h-[220px] overflow-hidden lg:col-span-6 lg:min-h-[320px]">
                    <MediaImage
                      src={hobby.coverSrc}
                      alt={hobby.title}
                      fit={hobby.coverFit ?? "contain"}
                      objectPosition={hobby.coverPosition ?? "50% 50%"}
                      className="absolute inset-0 h-full w-full transition duration-700 ease-out group-hover:scale-[1.015]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-obsidian/20 lg:to-obsidian/70"
                      aria-hidden
                    />
                  </div>

                  <div className="relative flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:col-span-6 lg:px-10">
                    <p className="chapter-label">{hobby.eyebrow}</p>
                    <h3 className="mt-3 font-display text-2xl leading-tight text-mist sm:text-3xl lg:text-[2.15rem]">
                      {hobby.title}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-tuskegee-gold/80">
                      {hobby.theme}
                    </p>
                    <p className="mt-4 max-w-measure text-sm leading-relaxed text-ink-200 sm:text-base">
                      {hobby.description}
                    </p>

                    <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
                      <div>
                        <dt className="font-display text-xl text-tuskegee-gold sm:text-2xl">
                          {count}
                        </dt>
                        <dd className="mt-1 text-[11px] leading-snug text-ink-400">
                          Frames in gallery
                        </dd>
                      </div>
                      <div>
                        <dt className="font-display text-xl text-tuskegee-gold sm:text-2xl">
                          Life
                        </dt>
                        <dd className="mt-1 text-[11px] leading-snug text-ink-400">
                          Outside the lab
                        </dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="font-display text-xl text-tuskegee-gold sm:text-2xl">
                          Craft
                        </dt>
                        <dd className="mt-1 text-[11px] leading-snug text-ink-400">
                          Hands-on practice
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-8 inline-flex items-center gap-2 text-sm text-mist transition group-hover:text-tuskegee-gold">
                      Open gallery
                      <ArrowUpRight size={16} />
                    </p>
                  </div>
                </Link>
              </article>
            </Reveal>
          );
        })}
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
