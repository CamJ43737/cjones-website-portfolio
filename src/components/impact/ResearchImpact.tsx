"use client";

import { videoAssignments } from "@/data/video-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CinematicVideo } from "@/components/ui/CinematicVideo";

export function ResearchImpact() {
  const video = videoAssignments.testimonial;

  return (
    <Section
      id="impact"
      eyebrow="Research Impact"
      title="What others say."
      subtitle="A peer perspective from the MANRRS Smart AG Tech Cohort — authentic voices from the research community."
      tight
    >
      <Reveal>
        <CinematicVideo
          src={video.src}
          title={video.title}
          caption={video.caption}
          poster={video.poster}
          autoPlayWhenVisible={false}
        />
      </Reveal>
    </Section>
  );
}
