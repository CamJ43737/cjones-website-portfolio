/**
 * Ask Cameron — Phase 1 knowledge base.
 *
 * Canonical professional facts for a future AI assistant.
 * Derived from `@/data/content` so the site remains the source of truth.
 *
 * Phase 2 UI (`AskCameron`) reads this for local mock answers.
 * Still no external AI APIs — keyword matching only.
 */

import {
  aboutStory,
  awards,
  beyondHobbies,
  experiences,
  hero,
  leadership,
  publications,
  researchProjects,
  site,
  skillCategories,
  timeline,
} from "@/data/content";

// ---------------------------------------------------------------------------
// Types (retrieval-friendly shapes)
// ---------------------------------------------------------------------------

export type CameronIdentity = {
  name: string;
  title: string;
  university: string;
  major: string;
  graduation: string;
  location: string;
  hometown: string;
  researchFocus: string[];
  tagline: string;
  statement: string;
};

export type CameronStory = {
  headline: string;
  builderOrigin: string;
  legoStory: string;
  pcBuildingStory: string;
  tuskegeeStory: string;
  whys: { question: string; answer: string }[];
};

export type CameronResearchEntry = {
  slug: string;
  project: string;
  institution: string[];
  role: string;
  problem: string[];
  technologies: string[];
  impact: string[];
  description: string;
  award?: string;
  domain: string;
};

export type CameronExperienceEntry = {
  organization: string;
  role: string;
  dates: string;
  responsibilities: string;
  technologies: string[];
};

export type CameronEducation = {
  university: string;
  major: string;
  expectedGraduation: string;
  location: string;
};

export type CameronAwardEntry = {
  name: string;
  category: string;
  description: string;
};

export type CameronLeadershipEntry = {
  organization: string;
  role: string;
  description: string;
};

export type CameronPublicationEntry = {
  title: string;
  type: string;
  description: string;
};

export type CameronTechnicalSkills = {
  languages: string[];
  frameworks: string[];
  robotics: string[];
  ai: string[];
  tools: string[];
  /** Full categorized list preserved from the site. */
  categories: { name: string; skills: string[] }[];
};

export type CameronContact = {
  email: string;
  linkedin: string;
  github: string;
  photography?: string;
  resumePath: string;
};

export type CameronBeyondEntry = {
  id: string;
  title: string;
  theme: string;
  description: string;
};

export type CameronJourneyChapter = {
  id: string;
  year: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];
};

/** Personal perspective + graduate direction for Ask Cameron (Phase 2.75). */
export type CameronPerspective = {
  whyCameronBuilds: string;
  whyAiAndRobotics: string;
  whyTuskegeeMatters: string;
  futureResearchInterests: string[];
  graduateResearchDirection: string;
  aiRoboticsVision: string;
  researchInterestsSummary: string;
};

/** Internal site paths for assistant navigation hints. */
export const portfolioNav = {
  home: "/",
  research: "/research",
  journey: "/journey",
  resume: "/resume",
  publications: "/publications",
  experience: "/experience",
  connect: "/#connect",
  researchProject: (slug: string) => `/research/${slug}`,
} as const;

/** Flat document ready for future embedding / RAG ingestion. */
export type CameronKnowledgeDocument = {
  id: string;
  category: string;
  title: string;
  text: string;
  metadata: Record<string, string | string[] | undefined>;
};

export type CameronKnowledge = {
  identity: CameronIdentity;
  story: CameronStory;
  research: CameronResearchEntry[];
  experience: CameronExperienceEntry[];
  education: CameronEducation;
  awardsAndRecognition: CameronAwardEntry[];
  leadership: CameronLeadershipEntry[];
  publications: CameronPublicationEntry[];
  technicalSkills: CameronTechnicalSkills;
  contact: CameronContact;
  beyondTheLab: CameronBeyondEntry[];
  journey: CameronJourneyChapter[];
  perspective: CameronPerspective;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function skillsIn(...categoryNames: string[]): string[] {
  const wanted = new Set(categoryNames.map((n) => n.toLowerCase()));
  return skillCategories
    .filter((c) => wanted.has(c.name.toLowerCase()))
    .flatMap((c) => c.skills);
}

function categorizeAward(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("ambassador")) return "Ambassador Role";
  if (n.includes("scholar")) return "Scholarship";
  if (n.includes("gamma") || n.includes("honor")) return "Honors Society";
  if (n.includes("hack") || n.includes("winner") || n.includes("manrrs")) {
    return "Competition / Program";
  }
  return "Recognition";
}

function timelineById(id: string) {
  return timeline.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Knowledge object (transformed from site content)
// ---------------------------------------------------------------------------

export const cameronKnowledge: CameronKnowledge = {
  identity: {
    name: site.name,
    title: site.title,
    university: site.university,
    major: site.major,
    graduation: site.graduation,
    location: site.location,
    hometown: site.hometown,
    researchFocus: hero.domains,
    tagline: site.tagline,
    statement: hero.statement,
  },

  story: {
    headline: aboutStory.homepageLead,
    builderOrigin: [aboutStory.lead, ...aboutStory.paragraphs].join("\n\n"),
    legoStory: aboutStory.homepageParagraphs[0] ?? aboutStory.paragraphs[0] ?? "",
    pcBuildingStory: [
      aboutStory.homepageParagraphs[1],
      timelineById("2018-building")?.description,
    ]
      .filter(Boolean)
      .join("\n\n"),
    tuskegeeStory: [
      aboutStory.homepageParagraphs[2],
      timelineById("2022-tuskegee")?.description,
    ]
      .filter(Boolean)
      .join("\n\n"),
    whys: aboutStory.whys.map((w) => ({ question: w.q, answer: w.a })),
  },

  research: researchProjects.map((p) => ({
    slug: p.slug,
    project: p.title,
    institution: p.institutions ?? [],
    role: p.role,
    problem: p.problem,
    technologies: p.technologies,
    impact: p.achievements.map((a) => `${a.value} — ${a.label}`),
    description: [p.subtitle, ...p.narrative].join("\n\n"),
    award: p.award,
    domain: p.eyebrow,
  })),

  experience: experiences.map((e) => ({
    organization: e.org,
    role: e.role,
    dates: e.timeline,
    responsibilities: e.impact,
    technologies: e.technologies,
  })),

  education: {
    university: site.university,
    major: site.major,
    expectedGraduation: site.graduation,
    location: site.location,
  },

  awardsAndRecognition: awards.map((a) => ({
    name: a.name,
    category: categorizeAward(a.name),
    description: a.detail,
  })),

  leadership: leadership.map((l) => ({
    organization: l.name,
    role: l.name,
    description: l.detail,
  })),

  publications: publications.map((p) => ({
    title: p.title,
    type: p.type,
    description: p.venue,
  })),

  technicalSkills: {
    languages: [
      ...skillsIn("Software"),
      ...skillsIn("Artificial Intelligence").filter((s) =>
        ["Python"].includes(s),
      ),
    ],
    frameworks: skillsIn("Artificial Intelligence").filter(
      (s) => s !== "Python" && s !== "Machine Learning",
    ),
    robotics: skillsIn("Robotics"),
    ai: [
      ...skillsIn("Artificial Intelligence"),
      ...skillsIn("Research"),
    ].filter((v, i, arr) => arr.indexOf(v) === i),
    tools: skillsIn("Tools"),
    categories: skillCategories.map((c) => ({
      name: c.name,
      skills: [...c.skills],
    })),
  },

  contact: {
    email: site.email,
    linkedin: site.linkedin,
    github: site.github,
    photography: site.photography,
    resumePath: site.resumePath,
  },

  beyondTheLab: beyondHobbies.map((h) => ({
    id: h.id,
    title: h.title,
    theme: h.theme,
    description: h.description,
  })),

  journey: timeline.map((c) => ({
    id: c.id,
    year: c.year,
    title: c.title,
    summary: c.detail,
    description: c.description,
    technologies: c.technologies,
  })),

  perspective: (() => {
    const whyAi = aboutStory.whys.find((w) => w.q.toLowerCase().includes("why ai"));
    const whyRobotics = aboutStory.whys.find((w) =>
      w.q.toLowerCase().includes("why robotics"),
    );
    const whyCs = aboutStory.whys.find((w) =>
      w.q.toLowerCase().includes("computer science"),
    );
    const whyAg = aboutStory.whys.find((w) =>
      w.q.toLowerCase().includes("agriculture"),
    );
    const whyHealth = aboutStory.whys.find((w) =>
      w.q.toLowerCase().includes("healthcare"),
    );
    const futureChapter = timelineById("future");
    const tuskegeeChapter = timelineById("2022-tuskegee");

    return {
      whyCameronBuilds: [
        aboutStory.lead,
        whyCs?.a,
        aboutStory.homepageParagraphs[aboutStory.homepageParagraphs.length - 1],
        site.tagline,
      ]
        .filter(Boolean)
        .join("\n\n"),
      whyAiAndRobotics: [whyAi?.a, whyRobotics?.a, whyAg?.a, whyHealth?.a]
        .filter(Boolean)
        .join("\n\n"),
      whyTuskegeeMatters: [
        tuskegeeChapter?.detail,
        tuskegeeChapter?.description,
        aboutStory.homepageParagraphs[2],
      ]
        .filter(Boolean)
        .join("\n\n"),
      futureResearchInterests: [
        ...hero.domains,
        "Physical AI — intelligence embodied in machines and environments",
        "Precision agriculture robotics and sensing",
        "Healthcare digital twins and aging-in-place systems",
        "Human-centered autonomous systems",
        "AI research infrastructure and knowledge systems",
      ],
      graduateResearchDirection: [
        futureChapter?.title,
        futureChapter?.detail,
        futureChapter?.description,
        `Building toward graduate research (PhD path) at the intersection of ${hero.domains.join(", ")}.`,
      ]
        .filter(Boolean)
        .join("\n\n"),
      aiRoboticsVision: [
        hero.statement,
        aboutStory.paragraphs[2],
        "Cameron’s vision is AI that lives in soil, clinics, homes, and infrastructure — not only in slides.",
      ]
        .filter(Boolean)
        .join("\n\n"),
      researchInterestsSummary: [
        `Current focus: ${hero.domains.join(", ")}.`,
        `Active projects include ${researchProjects.map((p) => p.title).join(", ")}.`,
        whyAg?.a,
        whyHealth?.a,
      ]
        .filter(Boolean)
        .join("\n\n"),
    } satisfies CameronPerspective;
  })(),
};

// ---------------------------------------------------------------------------
// Retrieval documents — flatten knowledge for future embeddings / RAG
// ---------------------------------------------------------------------------

function joinList(items: string[]): string {
  return items.length ? items.join(", ") : "None listed";
}

/**
 * Flatten `cameronKnowledge` into retrieval-ready text documents.
 * Each document is a self-contained chunk a future vector store can embed.
 */
export function getCameronKnowledgeDocuments(): CameronKnowledgeDocument[] {
  const k = cameronKnowledge;
  const docs: CameronKnowledgeDocument[] = [];

  docs.push({
    id: "identity",
    category: "identity",
    title: `${k.identity.name} — Identity`,
    text: [
      `${k.identity.name} is ${k.identity.title}.`,
      `University: ${k.identity.university}. Major: ${k.identity.major}. Expected graduation: ${k.identity.graduation}.`,
      `Location: ${k.identity.location}. Hometown: ${k.identity.hometown}.`,
      `Research focus: ${joinList(k.identity.researchFocus)}.`,
      `Statement: ${k.identity.statement}`,
      `Tagline: ${k.identity.tagline}`,
    ].join("\n"),
    metadata: {
      name: k.identity.name,
      university: k.identity.university,
      topics: k.identity.researchFocus,
    },
  });

  docs.push({
    id: "story",
    category: "story",
    title: "Background and personal story",
    text: [
      k.story.headline,
      "",
      "Builder origin:",
      k.story.builderOrigin,
      "",
      "LEGO beginnings:",
      k.story.legoStory,
      "",
      "PC building:",
      k.story.pcBuildingStory,
      "",
      "Tuskegee:",
      k.story.tuskegeeStory,
      "",
      "Motivations:",
      ...k.story.whys.map((w) => `${w.question} ${w.answer}`),
    ].join("\n"),
    metadata: { topics: ["background", "story", "builder", "LEGO", "Tuskegee"] },
  });

  docs.push({
    id: "education",
    category: "education",
    title: "Education",
    text: `${k.identity.name} studies ${k.education.major} at ${k.education.university}. Expected graduation: ${k.education.expectedGraduation}. Campus location: ${k.education.location}.`,
    metadata: {
      university: k.education.university,
      major: k.education.major,
    },
  });

  for (const r of k.research) {
    docs.push({
      id: `research-${r.slug}`,
      category: "research",
      title: r.project,
      text: [
        `${r.project} (${r.domain}).`,
        `Role: ${r.role}.`,
        `Institutions: ${joinList(r.institution)}.`,
        r.award ? `Award: ${r.award}.` : "",
        "",
        "Problem:",
        ...r.problem.map((p) => `- ${p}`),
        "",
        "Description:",
        r.description,
        "",
        `Technologies: ${joinList(r.technologies)}.`,
        `Impact: ${joinList(r.impact)}.`,
      ]
        .filter(Boolean)
        .join("\n"),
      metadata: {
        slug: r.slug,
        project: r.project,
        technologies: r.technologies,
        institutions: r.institution,
      },
    });
  }

  for (const [i, e] of k.experience.entries()) {
    docs.push({
      id: `experience-${i}-${e.role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category: "experience",
      title: `${e.role} @ ${e.organization}`,
      text: [
        `Role: ${e.role}`,
        `Organization: ${e.organization}`,
        `Dates: ${e.dates}`,
        `Responsibilities / impact: ${e.responsibilities}`,
        `Technologies: ${joinList(e.technologies)}.`,
      ].join("\n"),
      metadata: {
        organization: e.organization,
        role: e.role,
        technologies: e.technologies,
      },
    });
  }

  docs.push({
    id: "awards",
    category: "awards",
    title: "Awards and recognition",
    text: k.awardsAndRecognition
      .map((a) => `- ${a.name} (${a.category}): ${a.description}`)
      .join("\n"),
    metadata: {
      topics: k.awardsAndRecognition.map((a) => a.name),
    },
  });

  docs.push({
    id: "leadership",
    category: "leadership",
    title: "Leadership and community",
    text: k.leadership
      .map((l) => `- ${l.organization}: ${l.description}`)
      .join("\n"),
    metadata: {
      topics: k.leadership.map((l) => l.organization),
    },
  });

  docs.push({
    id: "publications",
    category: "publications",
    title: "Publications and scholarship",
    text: k.publications
      .map((p) => `- ${p.title} [${p.type}]: ${p.description}`)
      .join("\n"),
    metadata: {
      topics: k.publications.map((p) => p.title),
    },
  });

  docs.push({
    id: "skills",
    category: "skills",
    title: "Technical skills",
    text: [
      `Languages: ${joinList(k.technicalSkills.languages)}.`,
      `Frameworks: ${joinList(k.technicalSkills.frameworks)}.`,
      `Robotics: ${joinList(k.technicalSkills.robotics)}.`,
      `AI / research: ${joinList(k.technicalSkills.ai)}.`,
      `Tools: ${joinList(k.technicalSkills.tools)}.`,
      "",
      "By category:",
      ...k.technicalSkills.categories.map(
        (c) => `${c.name}: ${joinList(c.skills)}.`,
      ),
    ].join("\n"),
    metadata: {
      languages: k.technicalSkills.languages,
      robotics: k.technicalSkills.robotics,
      ai: k.technicalSkills.ai,
      tools: k.technicalSkills.tools,
    },
  });

  docs.push({
    id: "contact",
    category: "contact",
    title: "Contact information",
    text: [
      `Email: ${k.contact.email}`,
      `LinkedIn: ${k.contact.linkedin}`,
      `GitHub: ${k.contact.github}`,
      k.contact.photography ? `Photography: ${k.contact.photography}` : "",
      `Resume path on site: ${k.contact.resumePath}`,
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      email: k.contact.email,
      linkedin: k.contact.linkedin,
      github: k.contact.github,
    },
  });

  for (const b of k.beyondTheLab) {
    docs.push({
      id: `beyond-${b.id}`,
      category: "beyond",
      title: `Beyond the Lab — ${b.title}`,
      text: `${b.title}. Theme: ${b.theme}. ${b.description}`,
      metadata: { id: b.id, title: b.title },
    });
  }

  for (const c of k.journey) {
    docs.push({
      id: `journey-${c.id}`,
      category: "journey",
      title: `${c.year} — ${c.title}`,
      text: [
        `${c.year}: ${c.title}.`,
        c.summary,
        c.description,
        `Technologies / themes: ${joinList(c.technologies)}.`,
      ].join("\n"),
      metadata: {
        year: c.year,
        title: c.title,
        technologies: c.technologies,
      },
    });
  }

  const p = k.perspective;
  docs.push(
    {
      id: "perspective-why-builds",
      category: "perspective",
      title: "Why Cameron builds",
      text: p.whyCameronBuilds,
      metadata: { topics: ["builder", "purpose", "motivation"] },
    },
    {
      id: "perspective-why-ai-robotics",
      category: "perspective",
      title: "Why AI and robotics",
      text: p.whyAiAndRobotics,
      metadata: { topics: ["AI", "robotics", "vision"] },
    },
    {
      id: "perspective-why-tuskegee",
      category: "perspective",
      title: "Why Tuskegee matters",
      text: p.whyTuskegeeMatters,
      metadata: { topics: ["Tuskegee", "HBCU", "legacy"] },
    },
    {
      id: "perspective-future-interests",
      category: "perspective",
      title: "Future research interests",
      text: [
        p.researchInterestsSummary,
        "",
        "Future research interests:",
        ...p.futureResearchInterests.map((i) => `- ${i}`),
      ].join("\n"),
      metadata: { topics: p.futureResearchInterests },
    },
    {
      id: "perspective-graduate-direction",
      category: "perspective",
      title: "Graduate research direction",
      text: [
        p.graduateResearchDirection,
        "",
        "AI + robotics vision:",
        p.aiRoboticsVision,
      ].join("\n"),
      metadata: {
        topics: ["graduate school", "PhD", "future goals", "research direction"],
      },
    },
  );

  return docs;
}
