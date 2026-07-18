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
    src: "/images/01_Hero/tuskege-u-headhsot.jpeg",
    alt: "Cameron Jones at Tuskegee University",
    objectPosition: "50% 18%",
    fit: "cover" as const,
  },
  contact: {
    src: "/images/01_Hero/hero-headshot.jpg",
    alt: "Cameron Jones professional headshot",
    objectPosition: "50% 50%",
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
      src: "/images/07_Awards/hackathon-winners.jpeg",
      alt: "Precision & Digital Agriculture Hackathon first-place team",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
  },
  experience: {
    "AI Farms Research Assistant / Coordinator": {
      src: "/images/02_AI_Farms/ai-farms-team-at-hooks-farm.jpg",
      alt: "AI Farms team at Hooks Farm",
      objectPosition: "50% 32%",
      fit: "contain" as const,
    },
    "MS-CC Research Intern": {
      src: "/images/03_Project_AEGIS/screenshot-98.png",
      alt: "Project AEGIS simulation environment",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    "ACCESS-CI Software Engineering Intern": {
      src: "/images/05_Internships/industry/ai-farms-team-in-ithica-new-york-collaborating-with-our-cornell-partners.jpeg",
      alt: "AI Farms team collaborating with Cornell partners in Ithaca",
      objectPosition: "50% 32%",
      fit: "contain" as const,
    },
    "Robotics Intern": {
      src: "/images/05_Internships/industry/pvamu-internship.jpg",
      alt: "Prairie View A&M robotics internship",
      objectPosition: "50% 32%",
      fit: "contain" as const,
    },
    Intern: {
      src: "/images/05_Internships/coca-cola/img-2159.jpg",
      alt: "Coca-Cola internship",
      objectPosition: "50% 28%",
      fit: "contain" as const,
    },
  },
  awards: [
    {
      src: "/images/07_Awards/nsf-stem-scholars.jpg",
      alt: "NSF S-STEM Scholars",
      objectPosition: "50% 28%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
      alt: "NSF STEM Scholars celebration",
      objectPosition: "50% 32%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/gsd-honors-society-of-ag.jpg",
      alt: "Gamma Sigma Delta honors",
      objectPosition: "50% 38%",
      fit: "contain" as const,
    },
    {
      src: "/images/07_Awards/hackathon-winners-for-auburn-hacks.jpg",
      alt: "Auburn Hacks winners",
      objectPosition: "50% 28%",
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
      objectPosition: "50% 26%",
      fit: "contain" as const,
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
      objectPosition: "50% 38%",
      fit: "cover" as const,
    },
    {
      src: "/images/06_Leadership/img-6583.jpeg",
      alt: "Friends with Slim & Husky's pizza after a community event",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/cameron-giving-robot-demo-to-president-of-tuskegee-university-and-dean-of-caens-college.jpg",
      alt: "Robot demo for Tuskegee University leadership",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/cameron-giving-robot-demo-to-senator-shomari-foster.jpg",
      alt: "Robot demo for Senator Shomari Foster",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/cameron-meeting-rapper-killer-mike-after-giving-speech-for-presidential-innaguration.jpg",
      alt: "Meeting Killer Mike after presidential inauguration speech",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/cameron-at-the-tmcf-leadership-institute.jpeg",
      alt: "TMCF Leadership Institute",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/tmcf-leadership-institute-tuskegee-group.jpg",
      alt: "Tuskegee cohort at TMCF Leadership Institute",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/loren-lorosa-meeting-cameron-jones-after-speaking-at-the-tmcf-leadership-institute.jpeg",
      alt: "Meeting Loren Lorosa at TMCF Leadership Institute",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/mannrrs-smart-ag-cohort-tech-track.jpeg",
      alt: "MANRRS Smart AG Tech Track cohort",
      objectPosition: "50% 50%",
      fit: "contain" as const,
    },
    {
      src: "/images/05_Internships/industry/arriving-for-the-tech-e-summit.jpg",
      alt: "Arriving for the Tech-E Summit",
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
      fit: "contain" as const,
    },
  ],
  /** Homepage teaser frames for Beyond the Lab photography card. */
  beyondPhotography: [
    {
      src: "/images/08_Photography/general/cameron-the-photographer1.jpg",
      alt: "Cameron photographing on location",
      objectPosition: "50% 40%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/behind-the-lenscapturing-every-moment.jpg",
      alt: "Behind the lens — capturing every moment",
      objectPosition: "50% 45%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/cameron-the-photographer2.jpg",
      alt: "Actively shooting with camera in hand",
      objectPosition: "50% 40%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/reflections-of-tuskegeethe-calm-of-the-lake.jpeg",
      alt: "Reflections of Tuskegee — lake",
      objectPosition: "50% 50%",
      fit: "cover" as const,
    },
    {
      src: "/images/08_Photography/general/cameron-the-photographer3.jpg",
      alt: "Photographing campus and community",
      objectPosition: "50% 40%",
      fit: "contain" as const,
    },
    {
      src: "/images/08_Photography/general/roots-of-progresssweet-potatoes-sweet-future.jpg",
      alt: "Roots of progress — sweet potatoes",
      objectPosition: "50% 50%",
      fit: "cover" as const,
    },
  ],

  /**
   * Industry stills featured on the homepage (Leadership).
   * Remaining industry frames go to /resume archive — no duplicates.
   */
  homepageIndustrySrcs: [
    "/images/05_Internships/industry/ai-farms-team-in-ithica-new-york-collaborating-with-our-cornell-partners.jpeg",
    "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
    "/images/05_Internships/industry/cameron-giving-robot-demo-to-president-of-tuskegee-university-and-dean-of-caens-college.jpg",
    "/images/05_Internships/industry/cameron-giving-robot-demo-to-senator-shomari-foster.jpg",
    "/images/05_Internships/industry/cameron-meeting-rapper-killer-mike-after-giving-speech-for-presidential-innaguration.jpg",
    "/images/05_Internships/industry/cameron-at-the-tmcf-leadership-institute.jpeg",
    "/images/05_Internships/industry/tmcf-leadership-institute-tuskegee-group.jpg",
    "/images/05_Internships/industry/loren-lorosa-meeting-cameron-jones-after-speaking-at-the-tmcf-leadership-institute.jpeg",
    "/images/05_Internships/industry/mannrrs-smart-ag-cohort-tech-track.jpeg",
    "/images/05_Internships/industry/arriving-for-the-tech-e-summit.jpg",
  ] as string[],

  /** Cornell presentation variants for ACCESS research dossier gallery. */
  accessIndustryGallery: [
    {
      src: "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university2.jpeg",
      alt: "Cornell partner presentation",
      objectPosition: "50% 30%",
      fit: "cover" as const,
    },
    {
      src: "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university5.jpeg",
      alt: "Cornell research collaboration moment",
      objectPosition: "50% 32%",
      fit: "cover" as const,
    },
  ],
} as const;
