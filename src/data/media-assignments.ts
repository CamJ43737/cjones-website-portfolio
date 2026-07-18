/**
 * Curated, unique image assignments.
 * Each homepage src appears once. Prefer fit:"contain" for posters/docs/screens;
 * fit:"cover" + objectPosition for cinematic portraits/field frames.
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
    src: "/images/01_Hero/hero-headshot.jpg",
    alt: "Cameron Jones professional headshot",
    objectPosition: "50% 16%",
    fit: "cover" as const,
  },
  contact: {
    src: "/images/01_Hero/tuskege-u-headhsot.jpeg",
    alt: "Cameron Jones at Tuskegee University",
    objectPosition: "50% 18%",
    fit: "cover" as const,
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
      objectPosition: "50% 45%",
      fit: "cover" as const,
      aspect: "portrait" as const,
    },
    {
      src: "/images/12_PC_Build/6902.jpg",
      alt: "Hardware build in progress",
      objectPosition: "50% 40%",
      fit: "cover" as const,
      aspect: "landscape" as const,
    },
    {
      src: "/images/10_Family/family-unitedtuskegee-traditions.jpg",
      alt: "Family and Tuskegee traditions",
      objectPosition: "50% 28%",
      fit: "cover" as const,
      aspect: "landscape" as const,
    },
  ],
  researchCovers: {
    "ai-farms": {
      src: "/images/02_AI_Farms/hero-drone-field.jpg",
      alt: "Drone mission over agricultural field",
      objectPosition: "50% 42%",
      fit: "cover" as const,
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
      objectPosition: "50% 22%",
      fit: "cover" as const,
    },
    "prairie-view-robotics": {
      src: "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
      alt: "Robotics testing at Prairie View A&M",
      objectPosition: "50% 38%",
      fit: "cover" as const,
    },
    "cagi-hackathons": {
      src: "/images/07_Awards/uiuc-2026-cda-hackathon-winners.jpeg",
      alt: "Hackathon winning team",
      objectPosition: "50% 28%",
      fit: "cover" as const,
    },
  },
  experience: {
    "AI Farms Research Assistant / Coordinator": {
      src: "/images/02_AI_Farms/ai-farms-team-at-hooks-farm.jpg",
      alt: "AI Farms team at Hooks Farm",
      objectPosition: "50% 32%",
      fit: "cover" as const,
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
      objectPosition: "50% 22%",
      fit: "cover" as const,
    },
    "Robotics Intern": {
      src: "/images/05_Internships/industry/pvamu-internship.jpg",
      alt: "Prairie View A&M robotics internship",
      objectPosition: "50% 32%",
      fit: "cover" as const,
    },
    Intern: {
      src: "/images/05_Internships/coca-cola/img-2159.jpg",
      alt: "Coca-Cola internship",
      objectPosition: "50% 28%",
      fit: "cover" as const,
    },
  },
  awards: [
    {
      src: "/images/07_Awards/nsf-stem-scholars.jpg",
      alt: "NSF S-STEM Scholars",
      objectPosition: "50% 28%",
      fit: "cover" as const,
    },
    {
      src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
      alt: "NSF STEM Scholars celebration",
      objectPosition: "50% 32%",
      fit: "cover" as const,
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
      alt: "Gamma Sigma Delta honors",
      objectPosition: "50% 38%",
      fit: "cover" as const,
    },
    {
      src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
      alt: "Auburn Hacks winners",
      objectPosition: "50% 28%",
      fit: "cover" as const,
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
      objectPosition: "50% 26%",
      fit: "cover" as const,
    },
  ],
  leadership: [
    {
      src: "/images/06_Leadership/smart-ag-workshop-cameron-facilitated-for-teachers-on-tuskegee-campus.jpg",
      alt: "Smart agriculture workshop on Tuskegee campus",
      objectPosition: "50% 22%",
      fit: "cover" as const,
    },
    {
      src: "/images/06_Leadership/cameron-teaching-a-workshop-on-robotics-and-coding.jpg",
      alt: "Teaching robotics and coding workshop",
      objectPosition: "50% 20%",
      fit: "cover" as const,
    },
    {
      src: "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
      alt: "Mayor's Youth Council symposium",
      objectPosition: "50% 22%",
      fit: "cover" as const,
    },
    {
      src: "/images/06_Leadership/volunteering-at-local-farmer-s-bee-farm.jpg",
      alt: "Volunteering at local farm",
      objectPosition: "50% 38%",
      fit: "cover" as const,
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
      objectPosition: "50% 40%",
      fit: "contain" as const,
    },
    {
      src: "/images/04_Research/ai-farms-research-poster-presentation.jpeg",
      alt: "AI Farms poster presentation",
      objectPosition: "50% 35%",
      fit: "contain" as const,
    },
    {
      src: "/images/04_Research/img-2848.jpg",
      alt: "Research poster session",
      objectPosition: "50% 30%",
      fit: "cover" as const,
    },
  ],
  /**
   * Photography teaser — unique frames only.
   * One camera still: behind-the-lens.
   * One lake: reflections (serenity excluded as near-duplicate).
   */
  photographyTeaser: [
    {
      src: "/images/08_Photography/general/behind-the-lenscapturing-every-moment.jpg",
      alt: "Behind the lens — capturing every moment",
      objectPosition: "50% 45%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/reflections-of-tuskegeethe-calm-of-the-lake.jpeg",
      alt: "Reflections of Tuskegee — lake",
      objectPosition: "50% 50%",
      fit: "cover" as const,
    },
    {
      src: "/images/08_Photography/nature/img-2945.jpg",
      alt: "Nature study",
      objectPosition: "50% 40%",
      fit: "cover" as const,
    },
    {
      src: "/images/08_Photography/general/roots-of-progresssweet-potatoes-sweet-future.jpg",
      alt: "Roots of progress — sweet potatoes",
      objectPosition: "50% 50%",
      fit: "cover" as const,
    },
    {
      src: "/images/08_Photography/general/img-5162.jpeg",
      alt: "Visual journal frame",
      objectPosition: "50% 40%",
      fit: "cover" as const,
    },
    {
      src: "/images/08_Photography/nature/img-6209.jpeg",
      alt: "Nature frame",
      objectPosition: "50% 40%",
      fit: "cover" as const,
    },
  ],
} as const;

/**
 * Photography page exclusions — duplicate/near-duplicate camera & lake frames,
 * plus unused Canva mockups.
 */
export const photographyExclusions = [
  "untitled-design",
  "growth-in-motionthe-heart-of-innovation", // duplicate camera companion
  "serenity-in-stillnessthe-lake-s-quiet-beauty", // near-dup of reflections lake
  "img-9255", // near-dup camera pair
  "img-9256",
];
