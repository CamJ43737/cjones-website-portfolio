/**
 * Curated video placements — one source of truth.
 * Filenames map to the projects they represent. No random assignment.
 */

export type AssignedVideo = {
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  /** Autoplay when visible (muted). Default true for field reels. */
  autoPlayWhenVisible?: boolean;
  /** cover crops letterboxing; contain preserves full frame. */
  fit?: "cover" | "contain";
};

export const videoAssignments = {
  hero: {
    src: "/videos/testimonial-mannrs.mp4",
    title: "MANRRS Smart AG Tech Cohort",
    caption: "What peers say about the work — tap for sound or expand.",
    poster: "/images/02_AI_Farms/ai-farms-team.jpg",
    autoPlayWhenVisible: true,
  } as AssignedVideo,

  /** Field reel — paired with Robotics Intern experience. */
  fieldReel: {
    src: "/videos/hero-research.mp4",
    title: "Research in motion",
    caption: "Field robotics and systems capture.",
    poster: "/images/02_AI_Farms/hero-drone-field.jpg",
    autoPlayWhenVisible: true,
    fit: "cover",
  } as AssignedVideo,

  research: {
    "ai-farms": [
      {
        src: "/videos/ai-farms-1118.mp4",
        title: "AI Farms field operations",
        poster: "/images/02_AI_Farms/hero-drone-field.jpg",
      },
      {
        src: "/videos/ai-farms-robot-dog.mp4",
        title: "Robot dog field training",
        poster: "/images/02_AI_Farms/robot-dog-coding.jpg",
      },
      {
        src: "/videos/ai-farms-1111.mp4",
        title: "On-site research capture",
        poster: "/images/02_AI_Farms/ai-farms-team.jpg",
      },
      {
        src: "/videos/ai-farms-3112.mp4",
        title: "Systems demonstration",
        poster: "/images/02_AI_Farms/earthsense-rovers.jpg",
      },
    ],
    "prairie-view-robotics": [
      {
        src: "/videos/prairie-view-smart-transport.mov",
        title: "PVAMU robotic smart transportation",
        poster:
          "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
        autoPlayWhenVisible: true,
      },
    ],
    "access-ci": [
      {
        src: "/videos/access-industry-2853.mov",
        title: "Industry research collaboration",
        poster:
          "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
        autoPlayWhenVisible: false,
      },
      {
        src: "/videos/access-industry-2856.mov",
        title: "Partner engagement",
        poster:
          "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
        autoPlayWhenVisible: false,
      },
    ],
    "project-aegis": [] as AssignedVideo[],
    "cagi-hackathons": [] as AssignedVideo[],
  } as Record<string, AssignedVideo[]>,

  beyond: {
    "pc-building": [
      {
        src: "/videos/pc-build-timelapse.mp4",
        title: "PC build timelapse",
        poster: "/images/12_PC_Build/img-2713.jpg",
        autoPlayWhenVisible: true,
      },
    ],
  } as Record<string, AssignedVideo[]>,

};
