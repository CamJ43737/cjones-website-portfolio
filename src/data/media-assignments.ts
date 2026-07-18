/**
 * Curated, unique image assignments.
 * Each homepage src appears once. All content images use fit:"contain" (full uncropped frame).
 */

export type MediaFit = "cover" | "contain";

export type AssignedImage = {
  src: string;
  alt: string;
  objectPosition?: string;
  fit?: MediaFit;
};

export const mediaAssignments = {
  backdrop: {
    src: "/images/13_Logos/tuskegee-university-tigers-steven-parker.jpg",
    alt: "Tuskegee University campus atmosphere",
  },
  hero: {
    src: "/images/01_Hero/tuskege-u-headhsot.jpeg",
    alt: "Cameron Jones at Tuskegee University",
    objectPosition: "50% 50%",
    fit: "contain" as const,
  },
  contact: {
    src: "/images/01_Hero/hero-headshot.jpg",
    alt: "Cameron Jones professional headshot",
    objectPosition: "50% 50%",
    fit: "contain" as const,
  },
  logoSeal: {
    src: "/images/13_Logos/tuskegee-university-seal-svg.png",
    alt: "Tuskegee University seal",
    fit: "contain" as const,
  },
  about: [
    {
      src: "/images/12_PC_Build/img-2713.jpg",
      alt: "Custom PC build — engineering craft",
      objectPosition: "50% 50%",
      fit: "contain" as const,
      aspect: "portrait" as const,
    },
    {
      src: "/images/12_PC_Build/6902.jpg",
      alt: "Hardware build in progress",
      objectPosition: "50% 50%",
      fit: "contain" as const,
      aspect: "landscape" as const,
    },
    {
      src: "/images/10_Family/family-unitedtuskegee-traditions.jpg",
      alt: "Family and Tuskegee traditions",
      objectPosition: "50% 50%",
      fit: "contain" as const,
      aspect: "landscape" as const,
    },
  ],
  researchCovers: {
    "ai-farms": {
      src: "/images/02_AI_Farms/hero-drone-field.jpg",
      alt: "Drone mission over agricultural field",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "project-aegis": {
      src: "/images/03_Project_AEGIS/screenshot-92.png",
      alt: "Project AEGIS apartment digital twin",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "access-ci": {
      src: "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
      alt: "Research presentation at Cornell University",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "prairie-view-robotics": {
      src: "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
      alt: "Robotics testing at Prairie View A&M",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "cagi-hackathons": {
      src: "/images/07_Awards/uiuc-2026-cda-hackathon-winners.jpeg",
      alt: "Hackathon winning team",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  },
  experience: {
    "AI Farms Research Assistant / Coordinator": {
      src: "/images/02_AI_Farms/ai-farms-team-at-hooks-farm.jpg",
      alt: "AI Farms team at Hooks Farm",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "MS-CC Research Intern": {
      src: "/images/03_Project_AEGIS/screenshot-98.png",
      alt: "Project AEGIS simulation environment",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "ACCESS-CI Software Engineering Intern": {
      src: "/images/10_Family/cameron-and-sister-kaiya-at-fiu-miami-internship-for-access.jpeg",
      alt: "ACCESS internship — FIU Miami",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "Robotics Intern": {
      src: "/images/05_Internships/industry/pvamu-internship.jpg",
      alt: "Prairie View A&M robotics internship",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    Intern: {
      src: "/images/05_Internships/coca-cola/img-2159.jpg",
      alt: "Coca-Cola internship",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  },
  awards: [
    {
      src: "/images/07_Awards/nsf-stem-scholars.jpg",
      alt: "NSF S-STEM Scholars",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
      alt: "NSF STEM Scholars celebration",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
      alt: "Gamma Sigma Delta honors",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
      alt: "Auburn Hacks winners",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag-official-pin.jpeg",
      alt: "Gamma Sigma Delta pin",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/my-sister-and-i-presenting-our-hakcathon-for-auburn-hacks.jpeg",
      alt: "Auburn Hacks presentation",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  ],
  leadership: [
    {
      src: "/images/06_Leadership/smart-ag-workshop-cameron-facilitated-for-teachers-on-tuskegee-campus.jpg",
      alt: "Smart agriculture workshop on Tuskegee campus",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/06_Leadership/cameron-teaching-a-workshop-on-robotics-and-coding.jpg",
      alt: "Teaching robotics and coding workshop",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
      alt: "Mayor's Youth Council symposium",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/06_Leadership/volunteering-at-local-farmer-s-bee-farm.jpg",
      alt: "Volunteering at local farm",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  ],
  publications: [
    {
      src: "/images/04_Research/poster-presentation-for-ai-farms-research.jpeg",
      alt: "AI Farms research poster",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/04_Research/poster-presentation-for-the-jars-conference.jpg",
      alt: "JARS conference poster presentation",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/04_Research/ai-farms-research-poster-presentation.jpeg",
      alt: "AI Farms poster presentation",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/04_Research/img-2848.jpg",
      alt: "Research poster session",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  ],
  /** Strongest photography frames for Beyond the Lab (no fishing, no mockups). */
  beyondPhotography: [
    {
      src: "/images/08_Photography/general/behind-the-lenscapturing-every-moment.jpg",
      alt: "Behind the lens — capturing every moment",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/reflections-of-tuskegeethe-calm-of-the-lake.jpeg",
      alt: "Reflections of Tuskegee — lake",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/roots-of-progresssweet-potatoes-sweet-future.jpg",
      alt: "Roots of progress — sweet potatoes",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/img-5162.jpeg",
      alt: "Visual journal frame",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/img-9905.jpg",
      alt: "Photography study",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/warm-wishessipping-holiday-cheer.jpeg",
      alt: "Warm wishes — holiday frame",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/silent-nightpuppy-dreams-amidst-the-festivities.jpeg",
      alt: "Silent night — quiet moment",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/uno-shenanigansthe-mischief-maker.jpeg",
      alt: "UNO shenanigans",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  ],
} as const;

/** Exclude mockups / weak duplicates from photography hobby sets */
export const photographyExclusions = [
  "untitled-design",
  "growth-in-motionthe-heart-of-innovation",
  "serenity-in-stillnessthe-lake-s-quiet-beauty",
  "img-9255",
  "img-9256",
  "/nature/", // fishing frames live in 14_Fishing
];
