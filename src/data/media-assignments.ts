/**
 * Curated, unique image assignments for the homepage + research covers.
 * Paths are canonical (no -1 duplicate copies). Each src appears once on the home experience.
 */

export const mediaAssignments = {
  hero: {
    src: "/images/01_Hero/hero-headshot.jpg",
    alt: "Cameron Jones professional headshot",
    objectPosition: "50% 18%",
  },
  contact: {
    src: "/images/01_Hero/tuskege-u-headhsot.jpeg",
    alt: "Cameron Jones at Tuskegee University",
    objectPosition: "50% 20%",
  },
  logoSeal: {
    src: "/images/13_Logos/tuskegee-university-seal-svg.png",
    alt: "Tuskegee University seal",
  },
  about: [
    {
      src: "/images/12_PC_Build/img-2713.jpg",
      alt: "Custom PC build — engineering craft",
      objectPosition: "50% 45%",
      aspect: "portrait" as const,
    },
    {
      src: "/images/12_PC_Build/6902.jpg",
      alt: "Hardware build in progress",
      objectPosition: "50% 40%",
      aspect: "landscape" as const,
    },
    {
      src: "/images/10_Family/family-unitedtuskegee-traditions.jpg",
      alt: "Family and Tuskegee traditions",
      objectPosition: "50% 30%",
      aspect: "landscape" as const,
    },
  ],
  researchCovers: {
    "ai-farms": {
      src: "/images/02_AI_Farms/hero-drone-field.jpg",
      alt: "Drone mission over agricultural field",
      objectPosition: "50% 45%",
    },
    "project-aegis": {
      src: "/images/03_Project_AEGIS/screenshot-92.png",
      alt: "Project AEGIS apartment digital twin",
      objectPosition: "50% 50%",
    },
    "access-ci": {
      src: "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
      alt: "Research presentation at Cornell University",
      objectPosition: "50% 25%",
    },
    "prairie-view-robotics": {
      src: "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
      alt: "Robotics testing at Prairie View A&M",
      objectPosition: "50% 40%",
    },
    "cagi-hackathons": {
      src: "/images/07_Awards/uiuc-2026-cda-hackathon-winners.jpeg",
      alt: "Hackathon winning team",
      objectPosition: "50% 30%",
    },
  },
  experience: {
    "AI Farms Research Assistant / Coordinator": {
      src: "/images/02_AI_Farms/ai-farms-team-at-hooks-farm.jpg",
      alt: "AI Farms team at Hooks Farm",
      objectPosition: "50% 35%",
    },
    "MS-CC Research Intern": {
      src: "/images/03_Project_AEGIS/screenshot-98.png",
      alt: "Project AEGIS simulation environment",
      objectPosition: "50% 50%",
    },
    "ACCESS-CI Software Engineering Intern": {
      src: "/images/10_Family/cameron-and-sister-kaiya-at-fiu-miami-internship-for-access.jpeg",
      alt: "ACCESS internship — FIU Miami",
      objectPosition: "50% 25%",
    },
    "Robotics Intern": {
      src: "/images/05_Internships/industry/pvamu-internship.jpg",
      alt: "Prairie View A&M robotics internship",
      objectPosition: "50% 35%",
    },
    Intern: {
      src: "/images/05_Internships/coca-cola/img-2159.jpg",
      alt: "Coca-Cola internship",
      objectPosition: "50% 30%",
    },
  },
  awards: [
    {
      src: "/images/07_Awards/nsf-stem-scholars.jpg",
      alt: "NSF S-STEM Scholars",
      objectPosition: "50% 30%",
    },
    {
      src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
      alt: "NSF STEM Scholars celebration",
      objectPosition: "50% 35%",
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
      alt: "Gamma Sigma Delta honors",
      objectPosition: "50% 40%",
    },
    {
      src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
      alt: "Auburn Hacks winners",
      objectPosition: "50% 30%",
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag-official-pin.jpeg",
      alt: "Gamma Sigma Delta pin",
      objectPosition: "50% 50%",
    },
    {
      src: "/images/07_Awards/my-sister-and-i-presenting-our-hakcathon-for-auburn-hacks.jpeg",
      alt: "Auburn Hacks presentation",
      objectPosition: "50% 28%",
    },
  ],
  leadership: [
    {
      src: "/images/06_Leadership/smart-ag-workshop-cameron-facilitated-for-teachers-on-tuskegee-campus.jpg",
      alt: "Smart agriculture workshop on Tuskegee campus",
      objectPosition: "50% 25%",
    },
    {
      src: "/images/06_Leadership/cameron-teaching-a-workshop-on-robotics-and-coding.jpg",
      alt: "Teaching robotics and coding workshop",
      objectPosition: "50% 22%",
    },
    {
      src: "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
      alt: "Mayor's Youth Council symposium",
      objectPosition: "50% 25%",
    },
    {
      src: "/images/06_Leadership/volunteering-at-local-farmer-s-bee-farm.jpg",
      alt: "Volunteering at local farm",
      objectPosition: "50% 40%",
    },
  ],
  publications: [
    {
      src: "/images/04_Research/poster-presentation-for-ai-farms-research.jpeg",
      alt: "AI Farms research poster",
      objectPosition: "50% 50%",
    },
    {
      src: "/images/04_Research/poster-presentation-for-the-jars-conference.jpg",
      alt: "JARS conference poster presentation",
      objectPosition: "50% 40%",
    },
    {
      src: "/images/04_Research/ai-farms-research-poster-presentation.jpeg",
      alt: "AI Farms poster presentation",
      objectPosition: "50% 35%",
    },
    {
      src: "/images/04_Research/img-2848.jpg",
      alt: "Research poster session",
      objectPosition: "50% 30%",
    },
  ],
  photographyTeaser: [
    {
      src: "/images/08_Photography/general/reflections-of-tuskegeethe-calm-of-the-lake.jpeg",
      alt: "Reflections of Tuskegee — lake",
      objectPosition: "50% 50%",
    },
    {
      src: "/images/08_Photography/general/growth-in-motionthe-heart-of-innovation.jpeg",
      alt: "Growth in motion",
      objectPosition: "50% 45%",
    },
    {
      src: "/images/08_Photography/nature/img-2945.jpg",
      alt: "Nature study",
      objectPosition: "50% 40%",
    },
    {
      src: "/images/08_Photography/general/roots-of-progresssweet-potatoes-sweet-future.jpg",
      alt: "Roots of progress — sweet potatoes",
      objectPosition: "50% 50%",
    },
    {
      src: "/images/08_Photography/general/serenity-in-stillnessthe-lake-s-quiet-beauty.jpg",
      alt: "Lake serenity",
      objectPosition: "50% 45%",
    },
    {
      src: "/images/08_Photography/nature/img-6209.jpeg",
      alt: "Nature frame",
      objectPosition: "50% 40%",
    },
  ],
} as const;

export type AssignedImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};
