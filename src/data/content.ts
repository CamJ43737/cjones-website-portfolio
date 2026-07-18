export const site = {
  name: "Cameron Jones",
  title: "Cameron Jones — AI Researcher & Robotics Engineer",
  description:
    "Computer Science student at Tuskegee University researching AI, robotics, precision agriculture, and healthcare digital twins. Never stopped building.",
  tagline: "Never stopped building.",
  email: "cameron.kalon@gmail.com",
  location: "Tuskegee University · Tuskegee, Alabama",
  hometown: "Nashville, Tennessee",
  university: "Tuskegee University",
  major: "Computer Science",
  graduation: "December 2026",
  linkedin: "https://linkedin.com/in/cameron-jones-5855311b9",
  github: "https://github.com/CamJ43737",
  photography: "https://www.canva.com",
  resumePath: "/resume/Cameron_Jones_Resume.pdf",
  resumeAlt: "/resume/cjones-cv-resume.pdf",
};

export const hero = {
  name: "Cameron Jones",
  roles: ["AI Researcher.", "Robotics Engineer.", "Builder."],
  statement:
    "Building intelligent systems that improve how people live, work, and heal.",
  domains: ["AI", "Robotics", "Healthcare", "Agriculture"],
};

export const aboutStory = {
  lead: "I never stopped building.",
  /** Full origin narrative — preserved for Journey / archives. */
  paragraphs: [
    "It started with Legos — systems you could hold, break, and rebuild until they worked. Then came computers: opening cases, tracing cables, learning that intelligence is something you assemble piece by piece.",
    "Programming turned curiosity into language. Artificial intelligence turned language into possibility. I chose Computer Science not for a degree — for a laboratory where ideas become machines that touch the physical world.",
    "Today I research at the intersection of AI, robotics, agriculture, and healthcare — building systems that don't just compute, but care for land, labor, and people aging in place.",
  ],
  /** Concise homepage About. */
  homepageParagraphs: [
    "I started by taking computers apart. Today I build intelligent systems that connect AI with the physical world — from precision agriculture to healthcare digital twins.",
    "At Tuskegee University, that builder instinct became research: robotics in the field, software that serves scientists, and systems meant to help people and land.",
  ],
  whys: [
    {
      q: "Why Computer Science?",
      a: "Because code is the most flexible material I know — a way to invent tools that didn't exist yesterday.",
    },
    {
      q: "Why AI?",
      a: "AI lets machines perceive, decide, and adapt — the missing layer between sensors in the field and decisions that save crops, water, and time.",
    },
    {
      q: "Why Robotics?",
      a: "Intelligence without embodiment stays theoretical. Robotics puts AI into soil, clinics, and homes.",
    },
    {
      q: "Why Agriculture?",
      a: "Food systems feed everyone. Precision agriculture is where AI research becomes measurable human impact.",
    },
    {
      q: "Why Healthcare?",
      a: "Aging-in-place and digital twins are about dignity — technology that helps people live longer, safer, and more independently.",
    },
  ],
};

export type TimelineLink = { label: string; href: string; external?: boolean };

export type TimelineMedia = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
};

export type TimelineVideo = {
  src: string;
  title: string;
  poster?: string;
  fit?: "cover" | "contain";
  objectPosition?: string;
  /** Mild cover zoom — keep near 1 so speakers/frames stay visible. */
  coverScale?: number;
};

export type TimelineChapter = {
  id: string;
  year: string;
  title: string;
  detail: string;
  description: string;
  technologies: string[];
  links?: TimelineLink[];
  images?: TimelineMedia[];
  videos?: TimelineVideo[];
  /** Soft chapter-cover backdrop behind the story panel (desktop). */
  coverImage?: string;
};

export const timeline: TimelineChapter[] = [
  {
    id: "2018-building",
    year: "2018",
    title: "Building computers",
    detail: "Exploring technology from the inside out — hardware first.",
    description:
      "Before research titles, there were open cases and cable routes — curiosity that treated every machine as a puzzle worth solving by hand.",
    technologies: ["Hardware", "PC Building", "Systems"],
    coverImage: "/images/12_PC_Build/img-2727.jpeg",
    images: [
      {
        src: "/images/12_PC_Build/img-2727.jpeg",
        alt: "Pyramid PC build",
        fit: "contain",
        objectPosition: "50% 45%",
      },
      {
        src: "/images/12_PC_Build/img-2730.jpg",
        alt: "Custom dual-chamber PC build with RGB",
        fit: "contain",
      },
      {
        src: "/images/12_PC_Build/img-2713.jpg",
        alt: "RTX 3090 Ti Founders Edition",
        fit: "contain",
      },
    ],
    links: [{ label: "Beyond the Lab — PC Building", href: "/beyond#pc-building" }],
  },
  {
    id: "2019-programming",
    year: "2019",
    title: "Programming fundamentals",
    detail: "Learning to speak to machines and shape software.",
    description:
      "Hardware intuition met software language — the first scripts that made systems respond, iterate, and teach discipline.",
    technologies: ["Python", "Logic", "Software Fundamentals"],
    coverImage: "/images/12_PC_Build/6902.jpg",
    images: [
      {
        src: "/images/12_PC_Build/6902.jpg",
        alt: "Hands-on hardware and software build session",
        fit: "contain",
      },
    ],
  },
  {
    id: "2020-fisk-myc",
    year: "2020",
    title: "Fisk University · Mayor's Youth Council",
    detail: "Leadership and civic voice in Nashville.",
    description:
      "Civic work and youth leadership in Nashville — speaking, serving, and learning how community voice shapes systems beyond campus.",
    technologies: ["Leadership", "Civic Engagement", "Public Speaking"],
    coverImage: "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
    images: [
      {
        src: "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
        alt: "Mayor's Youth Council symposium",
        fit: "contain",
      },
      {
        src: "/images/06_Leadership/img-6583.jpeg",
        alt: "Community moment with Slim & Husky's pizza",
        fit: "contain",
      },
      {
        src: "/images/06_Leadership/mayor-s-youth-council-volunteering-with-friends.jpg",
        alt: "Mayor's Youth Council volunteering",
        fit: "contain",
      },
    ],
    videos: [
      {
        src: "/videos/mayor-youth-symposium.mov",
        title: "Cameron speaking at the Mayor's Youth Symposium",
        poster:
          "/images/06_Leadership/post-speech-at-the-mayor-s-youth-council-youth-symposium.jpg",
        fit: "cover",
        objectPosition: "50% 42%",
        coverScale: 1.04,
      },
    ],
    links: [{ label: "Leadership", href: "/#leadership" }],
  },
  {
    id: "2022-tuskegee",
    year: "2022",
    title: "Tuskegee University",
    detail: "Returned to the same institution my parents once walked — Computer Science at an HBCU legacy campus.",
    description:
      "Tuskegee is more than my university — it is family ground. My parents are alumni, and returning here meant stepping into a legacy I grew up watching. I am an identical twin, my sisters are twins, and there are eight of us. Campus was already home: study nights, family dinners, game nights, walking the grounds together, Homecoming, and a community that shaped who I became long before I enrolled.",
    technologies: ["Family", "Legacy", "Community", "Computer Science", "HBCU"],
    coverImage: "/images/13_Logos/tuskegee-university-tigers-steven-parker.jpg",
    images: [
      {
        src: "/images/10_Family/family-unitedtuskegee-traditions.jpg",
        alt: "Family united in Tuskegee traditions",
        fit: "contain",
      },
      {
        src: "/images/10_Family/family-strollsteps-of-legacy.jpeg",
        alt: "Family stroll on campus — steps of legacy",
        fit: "contain",
      },
      {
        src: "/images/10_Family/twin-ambitionexpo-edition.jpg",
        alt: "Identical twin ambition — expo edition",
        fit: "contain",
      },
      {
        src: "/images/10_Family/sister-spotlightexpo-excellence.jpg",
        alt: "Twin sisters at expo",
        fit: "contain",
      },
      {
        src: "/images/10_Family/sibling-weekendhome-away-from-home.jpeg",
        alt: "Sibling weekend — home away from home",
        fit: "contain",
      },
      {
        src: "/images/10_Family/seasonal-sischristmas-memories-in-the-making.jpeg",
        alt: "Family dinner season — Christmas memories",
        fit: "contain",
      },
      {
        src: "/images/10_Family/uno-eyesthe-ultimate-poker-face.jpeg",
        alt: "Game night with family",
        fit: "contain",
      },
      {
        src: "/images/10_Family/expo-prepbuilding-the-vision-together.jpg",
        alt: "Study night and expo prep together",
        fit: "contain",
      },
      {
        src: "/images/10_Family/black-expo-hustlefamily-business-in-action.jpg",
        alt: "Family event — Black Expo hustle",
        fit: "contain",
      },
      {
        src: "/images/10_Family/tradition-and-triumphthegreek-experience.jpg",
        alt: "Homecoming and Greek traditions",
        fit: "contain",
      },
      {
        src: "/images/10_Family/bonded-by-brotherhood-sisterhoodmy-sister-sgreek-journey.jpg",
        alt: "Brotherhood and sisterhood on campus",
        fit: "contain",
      },
      {
        src: "/images/10_Family/scholarship-in-actionalpha-kappa-induction.jpg",
        alt: "Celebration — Alpha Kappa induction",
        fit: "contain",
      },
      {
        src: "/images/10_Family/rising-to-the-topalpha-kappa-honors.jpg",
        alt: "Celebration — Alpha Kappa honors",
        fit: "contain",
      },
      {
        src: "/images/10_Family/honor-and-prestigealpha-kappa-moments.jpg",
        alt: "Family celebration — honor and prestige",
        fit: "contain",
      },
      {
        src: "/images/10_Family/cameron-and-sister-kaiya-on-school-trip-representing-tuskegee-at-the-tmcf-leadership-institute.jpg",
        alt: "Representing Tuskegee with family",
        fit: "contain",
      },
      {
        src: "/images/10_Family/hbcu-heroes-founder-meeting-cameron-and-his-family-after-conference-in-nashville-amazon-office.jpeg",
        alt: "Family and HBCU community in Nashville",
        fit: "contain",
      },
      {
        src: "/images/10_Family/cameron-and-sister-kaiya-at-fiu-miami-internship-for-access.jpeg",
        alt: "With sister Kaiya — family on the journey",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-5413.jpeg",
        alt: "Family campus memory",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-5420.jpeg",
        alt: "Candid family moment on campus",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-5528.jpeg",
        alt: "Family gathering",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-5538.jpeg",
        alt: "Campus family candid",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-6038.jpg",
        alt: "Family of eight — together",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-6069.jpeg",
        alt: "Family portrait moment",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-6078.jpeg",
        alt: "Family celebration",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-6081.jpeg",
        alt: "Siblings on campus",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-6096.jpeg",
        alt: "Family tradition",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-2402.jpg",
        alt: "Family memory",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-3391.jpg",
        alt: "Campus family moment",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-4112.jpeg",
        alt: "Family on campus grounds",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-4831.jpg",
        alt: "Family event",
        fit: "contain",
      },
      {
        src: "/images/10_Family/img-8854.jpg",
        alt: "Homecoming community",
        fit: "contain",
      },
    ],
    links: [{ label: "About", href: "/#about" }],
  },
  {
    id: "2022-ai-farms",
    year: "2022",
    title: "AI Farms Research",
    detail: "Joined the AI Farms Research Initiative — robotics meets precision agriculture.",
    description:
      "Field robotics, drones, and vision systems where mud and batteries matter as much as models — research that has to work outdoors.",
    technologies: ["Robotics", "Computer Vision", "Drones", "Precision Agriculture"],
    coverImage: "/images/02_AI_Farms/hero-drone-field.jpg",
    images: [
      {
        src: "/images/02_AI_Farms/hero-drone-field.jpg",
        alt: "Drone mission over agricultural field",
        fit: "contain",
      },
      {
        src: "/images/02_AI_Farms/ai-farms-team-at-hooks-farm.jpg",
        alt: "AI Farms team at Hooks Farm",
        fit: "contain",
      },
      {
        src: "/images/02_AI_Farms/giving-ai-robot-dog-demo-at-ard-research-symposium.jpg",
        alt: "Robot dog demonstration at research symposium",
        fit: "contain",
      },
    ],
    videos: [
      {
        src: "/videos/ai-farms-robot-dog.mp4",
        title: "Robot dog field training",
        poster: "/images/02_AI_Farms/robot-dog-coding.jpg",
      },
    ],
    links: [
      { label: "AI Farms dossier", href: "/research/ai-farms" },
      { label: "Research Lab", href: "/#research" },
    ],
  },
  {
    id: "2023-nsf",
    year: "2023",
    title: "NSF S-STEM Scholar",
    detail: "Recognized for academic excellence and STEM commitment.",
    description:
      "National recognition that reinforced the path — excellence in STEM paired with responsibility to lift community.",
    technologies: ["NSF S-STEM", "Scholarship", "STEM Leadership"],
    coverImage: "/images/07_Awards/nsf-stem-scholars.jpg",
    images: [
      {
        src: "/images/07_Awards/nsf-stem-scholars.jpg",
        alt: "NSF S-STEM Scholars",
        fit: "contain",
      },
      {
        src: "/images/07_Awards/celebrating-graduation-with-the-corrdinators-of-the-nsf-stem-scholars-scholarship-committee.jpg",
        alt: "NSF STEM Scholars celebration",
        fit: "contain",
      },
    ],
    links: [{ label: "Awards", href: "/#awards" }],
  },
  {
    id: "2024-prairie-cagi",
    year: "2024",
    title: "Prairie View · Google CSSI · CAGI",
    detail: "Robotics internship, Google CSSI, and CAGI AI Bootcamp.",
    description:
      "A year of acceleration — embedded robotics at Prairie View, Google CSSI, and CAGI cohorts where agriculture met AI under pressure.",
    technologies: ["Robotics", "Arduino", "Sensors", "IoT", "CAGI", "Google CSSI"],
    coverImage:
      "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
    images: [
      {
        src: "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
        alt: "Handmade robotics platform testing at Prairie View",
        fit: "contain",
      },
      {
        src: "/images/05_Internships/prairie-view/img-4699.jpeg",
        alt: "Arduino IoT robot car — Prairie View engineering",
        fit: "contain",
      },
    ],
    videos: [
      {
        src: "/videos/prairie-view-smart-transport.mov",
        title: "PVAMU smart transportation",
        poster:
          "/images/02_AI_Farms/robotics-testing-with-handmade-car-at-internship-at-pvamu.jpeg",
      },
    ],
    links: [
      { label: "Prairie View Robotics", href: "/research/prairie-view-robotics" },
      { label: "CAGI & Hackathons", href: "/research/cagi-hackathons" },
    ],
  },
  {
    id: "2025-access",
    year: "2025",
    title: "ACCESS-CI NSF Internship",
    detail: "Software engineering & NLP automation at UIUC / ACCESS-CI.",
    description:
      "NLP and automation for research cyberinfrastructure — turning dense systems knowledge into tools researchers can actually use.",
    technologies: ["Python", "LLMs", "NLP", "REST APIs", "Jira"],
    coverImage:
      "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
    images: [
      {
        src: "/images/05_Internships/industry/ai-farms-team-in-ithica-new-york-collaborating-with-our-cornell-partners.jpeg",
        alt: "Collaborating with Cornell partners in Ithaca",
        fit: "contain",
      },
      {
        src: "/images/05_Internships/industry/cameron-giving-a-presentation-in-ithica-new-york-to-partners-at-cornell-university.jpeg",
        alt: "Presentation to Cornell partners",
        fit: "contain",
      },
      {
        src: "/images/05_Internships/access-ci/img-5295.jpg",
        alt: "UIUC visitor badge — 2025 CI NSF Internship",
        fit: "contain",
      },
    ],
    links: [
      { label: "ACCESS-CI dossier", href: "/research/access-ci" },
      { label: "Experience", href: "/#experience" },
    ],
  },
  {
    id: "2026-aegis",
    year: "2026",
    title: "MS-CC · Project AEGIS · Hackathon Wins",
    detail: "Healthcare AI digital twins, aging-in-place research, competition wins.",
    description:
      "Apartment Framework Lead for Project AEGIS — digital twins and robotics for aging-in-place, alongside competition wins that prove speed and clarity under constraint.",
    technologies: ["Unity 6", "C#", "Digital Twins", "Healthcare AI", "NavMesh"],
    coverImage: "/images/03_Project_AEGIS/screenshot-92.png",
    images: [
      {
        src: "/images/03_Project_AEGIS/screenshot-92.png",
        alt: "Project AEGIS apartment digital twin",
        fit: "contain",
      },
      {
        src: "/images/03_Project_AEGIS/screenshot-98.png",
        alt: "Project AEGIS simulation environment",
        fit: "contain",
      },
    ],
    links: [
      { label: "Project AEGIS", href: "/research/project-aegis" },
      { label: "Resume", href: "/resume" },
    ],
  },
  {
    id: "future",
    year: "Future",
    title: "Graduate School · PhD · AI Innovation",
    detail: "Building toward a career as an AI scientist shaping the physical world.",
    description:
      "The next chapter is graduate research — AI that lives in soil, clinics, homes, and infrastructure, not only in slides.",
    technologies: ["PhD Path", "AI Research", "Physical AI", "Innovation"],
    coverImage: "/images/05_Internships/industry/img-7838.jpeg",
    images: [
      {
        src: "/images/05_Internships/industry/img-7838.jpeg",
        alt: "Research mural at NCSA Illinois",
        fit: "contain",
      },
    ],
    links: [{ label: "Let's connect", href: "/#connect" }],
  },
];

export type ResearchProject = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  problem: string[];
  role: string;
  institutions?: string[];
  award?: string;
  technologies: string[];
  achievements: { label: string; value: string }[];
  narrative: string[];
  mediaCategory: string;
  featuredKeywords: string[];
};

export const researchProjects: ResearchProject[] = [
  {
    slug: "ai-farms",
    eyebrow: "Precision Agriculture",
    title: "AI Farms",
    subtitle:
      "Integrating Artificial Intelligence and Robotics for Precision Agriculture",
    problem: [
      "Resource waste across water, nutrients, and labor",
      "Labor shortages in field operations",
      "Crop monitoring that can't scale with human eyes alone",
    ],
    role: "AI Research Assistant / Coordinator",
    institutions: ["Tuskegee University", "Cornell / CROPPS partners"],
    technologies: [
      "Python",
      "Computer Vision",
      "Robotics",
      "Drones",
      "NDVI Sensors",
      "Arduino",
    ],
    achievements: [
      { value: "30%", label: "Planting efficiency improvement" },
      { value: "20%", label: "Water conservation improvement" },
      { value: "15+", label: "Acres monitored" },
    ],
    narrative: [
      "AI Farms is where I learned that research isn't slides — it's mud on boots, drone batteries at dawn, and robots that have to work when the field doesn't forgive mistakes.",
      "We integrate computer vision, autonomous platforms, and sensing to help farmers see earlier, act smarter, and waste less.",
    ],
    mediaCategory: "02_AI_Farms",
    featuredKeywords: ["hero-drone", "farmbot", "robot-dog", "team", "rover", "drone"],
  },
  {
    slug: "project-aegis",
    eyebrow: "Healthcare AI · Digital Twins",
    title: "Project AEGIS",
    subtitle: "AI-Enabled Aging-in-Place Digital Twin Ecosystem",
    problem: [
      "Aging populations need safer independence at home",
      "Clinical insight is hard to simulate before deployment",
      "Robotics and environments must cooperate in real time",
    ],
    role: "Apartment Framework Lead",
    institutions: ["Fisk University", "Meharry Medical College"],
    award: "NSF Award No. 2401928",
    technologies: ["Unity 6", "C#", "Python", "Digital Twins", "Robotics", "NavMesh"],
    achievements: [
      { value: "Unity 6", label: "Apartment digital twin" },
      { value: "RoboDog", label: "Assistive robotics integration" },
      { value: "NSF", label: "Funded research ecosystem" },
    ],
    narrative: [
      "Project AEGIS explores how digital twins and robotics can support aging-in-place — simulating apartments, agents, and care workflows before they reach real homes.",
      "As Apartment Framework Lead, I shape the spatial and simulation foundation that healthcare AI and robotic systems plug into.",
    ],
    mediaCategory: "03_Project_AEGIS",
    featuredKeywords: ["screenshot"],
  },
  {
    slug: "access-ci",
    eyebrow: "NLP · Research Infrastructure",
    title: "ACCESS-CI",
    subtitle: "AI-Powered Knowledge Retrieval and NLP Automation",
    problem: [
      "Research cyberinfrastructure knowledge scattered across systems",
      "Manual documentation and ticket workflows don't scale",
      "API responses need human-readable structure",
    ],
    role: "Software Engineering Intern (NSF)",
    institutions: ["University of Illinois Urbana-Champaign", "ACCESS-CI"],
    technologies: ["Python", "REST APIs", "LLMs", "NLP", "Jira", "Markdown"],
    achievements: [
      { value: "50+", label: "Resources integrated" },
      { value: "300+", label: "API responses converted" },
      { value: "70%", label: "Reduction in manual work" },
    ],
    narrative: [
      "At ACCESS-CI I built NLP and automation pipelines that turn dense cyberinfrastructure knowledge into usable answers — less copy-paste, more research velocity.",
    ],
    mediaCategory: "05_Internships",
    featuredKeywords: ["uiuc", "access", "fiu", "miami", "internship"],
  },
  {
    slug: "prairie-view-robotics",
    eyebrow: "Robotics Internship",
    title: "Prairie View Robotics",
    subtitle: "Hands-on autonomous systems and embedded robotics",
    problem: [
      "Bridging classroom robotics with field-ready prototypes",
      "Sensor fusion and control under real constraints",
    ],
    role: "Robotics Intern",
    institutions: ["Prairie View A&M University"],
    technologies: ["Arduino", "Sensors", "Embedded Systems", "Prototyping"],
    achievements: [
      { value: "PVAMU", label: "Robotics internship" },
      { value: "Build", label: "Handmade autonomous platforms" },
    ],
    narrative: [
      "Prairie View sharpened my robotics instincts — testing handmade platforms, iterating fast, and treating every failure as sensor data.",
    ],
    mediaCategory: "02_AI_Farms",
    featuredKeywords: ["pvamu", "handmade", "robotics-testing"],
  },
  {
    slug: "cagi-hackathons",
    eyebrow: "Innovation Sprints",
    title: "CAGI & Hackathons",
    subtitle: "Rapid research, smart agriculture, and competition wins",
    problem: [
      "Compressing research ideas into working demos under pressure",
      "Translating AI into agricultural and community impact",
    ],
    role: "Competitor · Researcher · Collaborator",
    institutions: ["CAGI", "Auburn Hacks", "Precision Agriculture Hackathon"],
    technologies: ["Python", "ML", "Full-stack", "Hardware"],
    achievements: [
      { value: "1st", label: "Auburn Hacks Winner" },
      { value: "1st", label: "Precision Ag Hackathon" },
      { value: "CAGI", label: "AI Bootcamp research" },
    ],
    narrative: [
      "Hackathons and CAGI taught me to ship under constraint — clarity of problem, speed of prototype, and storytelling that earns trust.",
    ],
    mediaCategory: "07_Awards",
    featuredKeywords: ["hackathon", "auburn", "winner"],
  },
];

export const skillCategories = [
  {
    name: "Artificial Intelligence",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
  },
  {
    name: "Robotics",
    skills: ["ROS", "Arduino", "Sensors", "Autonomous Systems"],
  },
  {
    name: "Software",
    skills: ["Java", "C++", "Swift", "JavaScript"],
  },
  {
    name: "Research",
    skills: ["Computer Vision", "NLP", "LLMs", "Data Analysis"],
  },
  {
    name: "Tools",
    skills: ["GitHub", "Docker", "Unity", "Linux"],
  },
];

export const experiences = [
  {
    role: "AI Farms Research Assistant / Coordinator",
    org: "Tuskegee University — AI Farms Research Initiative",
    timeline: "Oct 2022 — Present",
    impact:
      "Lead and coordinate AI + robotics research for precision agriculture across drones, rovers, vision, and field demos.",
    technologies: ["Python", "CV", "Drones", "Robotics", "Arduino"],
    photoKeywords: ["ai-farms-team", "hooks-farm", "drone"],
    mediaCategory: "02_AI_Farms",
  },
  {
    role: "MS-CC Research Intern",
    org: "Fisk University · Meharry Medical College",
    timeline: "2026",
    impact:
      "Apartment Framework Lead for Project AEGIS — aging-in-place digital twin ecosystem (NSF 2401928).",
    technologies: ["Unity 6", "C#", "Digital Twins", "NavMesh"],
    photoKeywords: ["screenshot"],
    mediaCategory: "03_Project_AEGIS",
  },
  {
    role: "ACCESS-CI Software Engineering Intern",
    org: "University of Illinois Urbana-Champaign / NSF",
    timeline: "2025",
    impact:
      "Built AI-powered knowledge retrieval and NLP automation — 50+ resources, 300+ API conversions, ~70% less manual work.",
    technologies: ["Python", "LLMs", "REST", "NLP", "Jira"],
    photoKeywords: ["uiuc", "access", "internship"],
    mediaCategory: "05_Internships",
  },
  {
    role: "Robotics Demo",
    org: "Tuskegee University",
    timeline: "2025",
    impact:
      "Remote sensing with the AI Farms team — arm-bot demonstration for precision agriculture outreach.",
    technologies: ["Robotics", "Remote Sensing", "AI Farms", "Demo"],
    photoKeywords: ["arm", "demo", "ai-farms"],
    mediaCategory: "02_AI_Farms",
  },
  {
    role: "Robotics Intern",
    org: "Prairie View A&M University",
    timeline: "2024",
    impact:
      "Prototyped and tested autonomous robotics platforms with embedded sensing and control.",
    technologies: ["Arduino", "Sensors", "Prototyping"],
    photoKeywords: ["pvamu", "handmade", "robotics"],
    mediaCategory: "02_AI_Farms",
  },
  {
    role: "Intern",
    org: "Coca-Cola",
    timeline: "Internship",
    impact:
      "Industry experience in operations and professional systems — discipline that transfers to research labs.",
    technologies: ["Operations", "Professional Systems"],
    photoKeywords: ["img-21", "img-22", "img-23"],
    mediaCategory: "05_Internships",
  },
];

export const awards = [
  { name: "NSF S-STEM Scholar", detail: "National Science Foundation" },
  { name: "TMCF Scholar", detail: "Thurgood Marshall College Fund" },
  { name: "UNCF Ambassador", detail: "United Negro College Fund" },
  { name: "HBCUniverse Ambassador", detail: "HBCU community leadership" },
  { name: "Gamma Sigma Delta", detail: "Honor Society of Agriculture" },
  { name: "MANRRS SMART Ag Tech", detail: "Smart agriculture technology cohort" },
  { name: "Auburn Hacks Winner", detail: "1st Place" },
  { name: "Precision Agriculture Hackathon Winner", detail: "1st Place" },
];

export const leadership = [
  {
    name: "UNCF Ambassador",
    detail: "Representing scholarship, storytelling, and HBCU excellence.",
  },
  {
    name: "HBCUniverse Ambassador",
    detail: "Connecting HBCU talent with opportunity and community.",
  },
  {
    name: "NSBE",
    detail: "National Society of Black Engineers — engineering community.",
  },
  {
    name: "ACM",
    detail: "Association for Computing Machinery — computing scholarship.",
  },
  {
    name: "Global Fellows Organizer",
    detail: "Building programs that expand global and technical exposure.",
  },
  {
    name: "Mayor's Youth Council",
    detail: "Civic leadership, symposium speaking, and community service in Nashville.",
  },
];

export const publications = [
  {
    title: "Project AEGIS Manuscript",
    venue: "In progress · Aging-in-place digital twin research",
    type: "Manuscript",
  },
  {
    title: "CAGI Bootcamp Research",
    venue: "CAGI AI Bootcamp",
    type: "Research",
  },
  {
    title: "Integrating AI-Powered Robotic Systems for Precision Agriculture",
    venue: "AI Farms Research Poster · JARS / ARD presentations",
    type: "Poster",
  },
];

export const photoCategories = [
  { id: "campus", label: "Campus", keywords: ["campus", "tuskegee", "lake"] },
  { id: "technology", label: "Technology", keywords: ["technology", "innovation", "growth"] },
  { id: "nature", label: "Nature", keywords: ["nature", "lake", "serenity"] },
  { id: "agriculture", label: "Agriculture", keywords: ["agriculture", "sweet-potato", "roots", "farm"] },
  { id: "people", label: "People", keywords: ["portrait", "uno", "holiday", "puppy", "warm"] },
  { id: "travel", label: "Travel", keywords: ["travel"] },
];

export type BeyondHobby = {
  id: string;
  eyebrow: string;
  title: string;
  theme: string;
  description: string;
  coverSrc: string;
  coverPosition?: string;
  coverFit?: "cover" | "contain";
};

export const beyondHobbies: BeyondHobby[] = [
  {
    id: "pc-building",
    eyebrow: "Hardware · Engineering",
    title: "PC Building",
    theme: "Hardware, engineering, building, curiosity",
    description: "Building systems from the hardware up.",
    coverSrc: "/images/12_PC_Build/img-2727.jpeg",
    coverPosition: "50% 45%",
    coverFit: "contain",
  },
  {
    id: "photography",
    eyebrow: "Creativity · Perspective",
    title: "Photography",
    theme: "Creativity, storytelling, perspective",
    description: "Capturing technology, people, and moments through my lens.",
    coverSrc: "/images/08_Photography/general/cameron-the-photographer1.jpg",
    coverPosition: "50% 40%",
    coverFit: "contain",
  },
  {
    id: "fishing",
    eyebrow: "Outdoors · Balance",
    title: "Fishing",
    theme: "Outdoors, patience, balance",
    description: "Time outdoors, patience, and perspective.",
    coverSrc: "/images/14_Fishing/img-2945.jpg",
    coverPosition: "50% 40%",
    coverFit: "cover",
  },
];


export const contactReasons = [
  "Research Collaboration",
  "Job Opportunity",
  "Speaking Engagement",
  "Media",
  "General Inquiry",
] as const;

/** Homepage Research preview — full archive remains on /research. */
export const featuredResearchSlugs = ["ai-farms", "project-aegis", "access-ci"] as const;

/** Homepage Selected Experience — full archive remains on /experience. */
export const selectedExperienceRoles = [
  "AI Farms Research Assistant / Coordinator",
  "MS-CC Research Intern",
  "ACCESS-CI Software Engineering Intern",
] as const;

/** Homepage Recognition highlights — full awards/leadership data preserved. */
export const recognitionHighlights = [
  { name: "NSF S-STEM Scholar", detail: "National Science Foundation" },
  { name: "UNCF Ambassador", detail: "United Negro College Fund" },
  { name: "TMCF Scholar", detail: "Thurgood Marshall College Fund" },
  { name: "Gamma Sigma Delta", detail: "Honor Society of Agriculture" },
  { name: "Auburn Hacks Winner", detail: "1st Place" },
  { name: "Precision Agriculture Hackathon Winner", detail: "1st Place" },
] as const;

export const homepageMilestones = [
  { year: "2018", title: "Building Computers", href: "/journey" },
  { year: "2022", title: "Tuskegee University", href: "/journey" },
  { year: "2022", title: "AI Farms Research", href: "/journey" },
  { year: "2025", title: "ACCESS-CI NSF Internship", href: "/journey" },
  { year: "2026", title: "Project AEGIS", href: "/journey" },
  { year: "Future", title: "Graduate Research / AI Innovation", href: "/journey" },
] as const;

export const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/publications", label: "Publications" },
  { href: "/beyond", label: "Beyond" },
  { href: "/resume", label: "Resume" },
  { href: "/#connect", label: "Connect" },
];
