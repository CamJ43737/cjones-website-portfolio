"use client";

import { videoAssignments } from "@/data/video-assignments";
import { CinematicVideo } from "@/components/ui/CinematicVideo";

export function HeroVideo() {
  const video = videoAssignments.hero;

  return (
    <div className="relative mt-10 w-full lg:mt-14">
      <CinematicVideo
        src={video.src}
        title="Field reel"
        caption={video.caption}
        poster={video.poster}
        autoPlayWhenVisible={video.autoPlayWhenVisible}
        eager
      />
    </div>
  );
}
