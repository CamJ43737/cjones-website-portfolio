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
  paragraphs: [
    "It started with Legos — systems you could hold, break, and rebuild until they worked. Then came computers: opening cases, tracing cables, learning that intelligence is something you assemble piece by piece.",
    "Programming turned curiosity into language. Artificial intelligence turned language into possibility. I chose Computer Science not for a degree — for a laboratory where ideas become machines that touch the physical world.",
    "Today I research at the intersection of AI, robotics, agriculture, and healthcare — building systems that don't just compute, but care for land, labor, and people aging in place.",
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

export const timeline = [
  { year: "2018", title: "Building computers", detail: "Exploring technology from the inside out — hardware first." },
  { year: "2019", title: "Programming fundamentals", detail: "Learning to speak to machines and shape software." },
  { year: "2020", title: "Fisk University · Mayor's Youth Council", detail: "Leadership and civic voice in Nashville." },
  { year: "2022", title: "Tuskegee University", detail: "Transferred to pursue Computer Science at an HBCU legacy campus." },
  { year: "2022", title: "AI Farms Research", detail: "Joined the AI Farms Research Initiative — robotics meets precision agriculture." },
  { year: "2023", title: "NSF S-STEM Scholar", detail: "Recognized for academic excellence and STEM commitment." },
  { year: "2024", title: "Prairie View · Google CSSI · CAGI", detail: "Robotics internship, Google CSSI, and CAGI AI Bootcamp." },
  { year: "2025", title: "ACCESS-CI NSF Internship", detail: "Software engineering & NLP automation at UIUC / ACCESS-CI." },
  { year: "2026", title: "MS-CC · Project AEGIS · Hackathon Wins", detail: "Healthcare AI digital twins, aging-in-place research, competition wins." },
  { year: "Future", title: "Graduate School · PhD · AI Innovation", detail: "Building toward a career as an AI scientist shaping the physical world." },
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
  { id: "nature", label: "Nature", keywords: ["nature", "lake", "serenity", "img-2924", "img-2945", "img-6209"] },
  { id: "agriculture", label: "Agriculture", keywords: ["agriculture", "sweet-potato", "roots", "farm"] },
  { id: "people", label: "People", keywords: ["portrait", "uno", "holiday", "puppy", "warm"] },
  { id: "travel", label: "Travel", keywords: ["travel"] },
];

export const contactReasons = [
  "Research Collaboration",
  "Job Opportunity",
  "Speaking Engagement",
  "Media",
  "General Inquiry",
] as const;

export const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#journey", label: "Journey" },
  { href: "/#research", label: "Research" },
  { href: "/#experience", label: "Experience" },
  { href: "/photography", label: "Photography" },
  { href: "/resume", label: "Resume" },
  { href: "/#connect", label: "Connect" },
];
