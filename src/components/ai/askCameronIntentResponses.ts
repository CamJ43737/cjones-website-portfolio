/**
 * Ask Cameron — intent-aware composed responses (Phase 3D/3E).
 * Local only. Used before keyword ranking so intro questions don't latch onto a single timeline doc.
 */

import {
  cameronKnowledge,
  portfolioNav,
  type CameronExperienceEntry,
  type CameronResearchEntry,
} from "@/data/cameronKnowledge";

export type AskCameronResponseIntent =
  | "identity-intro"
  | "research-overview"
  | "robotics-experience"
  | "skills"
  | "career-internships";

function joinList(items: string[]): string {
  return items.length ? items.join(", ") : "None listed";
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function projectBySlug(slug: string): CameronResearchEntry | undefined {
  return cameronKnowledge.research.find((r) => r.slug === slug);
}

function mentionsSpecificProject(q: string): boolean {
  return cameronKnowledge.research.some((r) => {
    const name = r.project.toLowerCase();
    const slug = r.slug.replace(/-/g, " ");
    return (
      q.includes(name) ||
      q.includes(slug) ||
      (r.slug === "project-aegis" && q.includes("aegis")) ||
      (r.slug === "ai-farms" && q.includes("ai farms")) ||
      (r.slug === "access-ci" && q.includes("access"))
    );
  });
}

/** Internships + research appointments — excludes demos and one-off project labels. */
export function getInternshipAppointments(): CameronExperienceEntry[] {
  return cameronKnowledge.experience.filter((e) => {
    const role = e.role.toLowerCase();
    if (role.includes("demo")) return false;
    if (role.includes("intern")) return true;
    if (role.includes("research assistant") || role.includes("coordinator")) return true;
    return false;
  });
}

/** Technologies evidenced in experience and/or research entries (not unverified skill labels). */
function evidencedTechnologies(): string[] {
  return unique([
    ...cameronKnowledge.experience.flatMap((e) => e.technologies),
    ...cameronKnowledge.research.flatMap((r) => r.technologies),
  ]);
}

function roboticsTechnologies(): string[] {
  const evidenced = evidencedTechnologies().map((t) => t.toLowerCase());
  const fromSkills = cameronKnowledge.technicalSkills.robotics.filter((skill) => {
    const s = skill.toLowerCase();
    // Never claim ROS unless it appears in experience/research tech lists
    if (s === "ros") {
      return evidenced.some((t) => t.includes("ros"));
    }
    return true;
  });
  const fromProjects = evidencedTechnologies().filter((t) =>
    /robot|arduino|sensor|drone|rover|navmesh|unity|autonomous|cv|vision/i.test(t),
  );
  return unique([...fromSkills, ...fromProjects]);
}

function withNav(body: string, links: string[]): string {
  const uniqueLinks = [...new Set(links.filter(Boolean))];
  if (!uniqueLinks.length) return body;
  return [body, "", "**Explore on this site**", ...uniqueLinks.map((l) => `• ${l}`)].join(
    "\n",
  );
}

/**
 * Detect high-level response intents before keyword document ranking.
 * Returns null to fall through to existing retrieval modes.
 */
export function detectResponseIntent(question: string): AskCameronResponseIntent | null {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q) return null;

  // Skills (before generic "what does cameron" paths)
  if (
    (q.includes("skill") ||
      q.includes("technolog") ||
      q.includes("tech stack") ||
      q.includes("tools does") ||
      q.includes("tools cameron") ||
      (q.includes("technologies") && q.includes("use"))) &&
    !q.includes("aegis") &&
    !q.includes("farm")
  ) {
    if (
      q.includes("skill") ||
      q.includes("technolog") ||
      q.includes("tools") ||
      q.includes("languages") ||
      q.includes("stack")
    ) {
      return "skills";
    }
  }

  // Robotics experience
  if (
    q.includes("robot") &&
    (q.includes("experience") ||
      q.includes("work") ||
      q.includes("background") ||
      q.includes("overview") ||
      q.includes("tell me") ||
      q.includes("what"))
  ) {
    return "robotics-experience";
  }

  // Career / internships / research appointments
  if (
    q.includes("intern") ||
    q.includes("appointment") ||
    (q.includes("where") && (q.includes("work") || q.includes("intern"))) ||
    (q.includes("experience") &&
      !q.includes("robot") &&
      (q.includes("what experience") ||
        q.includes("professional experience") ||
        q.includes("work experience") ||
        q.includes("career")))
  ) {
    return "career-internships";
  }

  // Research overview (not a single named project)
  if (!mentionsSpecificProject(q)) {
    if (
      (q.includes("research") &&
        (q.includes("what") ||
          q.includes("explain") ||
          q.includes("tell") ||
          q.includes("project") ||
          q.includes("does cameron"))) ||
      q.includes("what projects has cameron") ||
      q.includes("what projects did cameron") ||
      q.includes("cameron's research") ||
      q.includes("camerons research")
    ) {
      if (
        q.includes("graduate") ||
        q.includes("phd") ||
        q.includes("future research interest") ||
        q.includes("why") ||
        q.includes("appointment")
      ) {
        // "research appointments" → career intent (already handled above if appointment)
        if (q.includes("appointment")) return "career-internships";
        return null;
      }
      return "research-overview";
    }
  }

  // Identity / introduction — must be about Cameron holistically
  if (mentionsSpecificProject(q)) return null;
  if (q.includes("robot") || q.includes("intern") || q.includes("skill")) return null;
  if (q.includes("award") || q.includes("publication") || q.includes("contact")) return null;

  const identitySignals = [
    /^who is cameron/,
    /^who is cameron jones/,
    /^who'?s cameron/,
    /introduce cameron/,
    /give me an overview of cameron/,
    /overview of cameron/,
    /what does cameron do$/,
    /what does cameron do\b/,
    /^tell me about cameron$/,
    /^tell me about cameron jones$/,
    /tell me about cameron(?!.*(research|robot|intern|farm|aegis|access|skill|technolog|award|journey))/,
    /^about cameron$/,
    /^about cameron jones$/,
  ];

  if (identitySignals.some((re) => re.test(q))) {
    return "identity-intro";
  }

  if (
    (q.includes("who is") || q.includes("who's")) &&
    q.includes("cameron") &&
    !q.includes("research") &&
    !q.includes("advisor")
  ) {
    return "identity-intro";
  }

  return null;
}

export function categoriesForResponseIntent(
  intent: AskCameronResponseIntent,
): string[] {
  switch (intent) {
    case "identity-intro":
      return ["identity", "story", "research", "experience", "journey", "perspective"];
    case "research-overview":
      return ["research", "skills"];
    case "robotics-experience":
      return ["research", "experience", "skills"];
    case "skills":
      return ["skills"];
    case "career-internships":
      return ["experience"];
    default:
      return [];
  }
}

export function formatIdentityIntroduction(): string {
  const k = cameronKnowledge;
  const i = k.identity;
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const access = projectBySlug("access-ci");

  const overview = [
    `**${i.name}** is a ${i.major} student at ${i.university} (expected graduation ${i.graduation}), working as an AI researcher and robotics engineer.`,
    `His research focuses on ${joinList(i.researchFocus)} — building intelligent systems where artificial intelligence meets the physical world.`,
  ].join(" ");

  const body = [
    overview,
    "",
    "**Origin story**",
    k.story.legoStory,
    "",
    k.story.pcBuildingStory.split("\n\n")[0] ?? k.story.pcBuildingStory,
    "",
    "That path grew into software, robotics, and AI research — curiosity that never stopped building.",
    "",
    "**Current work**",
    farms
      ? `• **AI Farms** — ${farms.role}. ${farms.description.split("\n\n")[0]}`
      : null,
    aegis
      ? `• **Project AEGIS** — ${aegis.role}. ${aegis.description.split("\n\n")[0]}`
      : null,
    access
      ? `• **ACCESS-CI** — ${access.role}. ${access.description.split("\n\n")[0]}`
      : null,
    "",
    "**Relevant technologies**",
    joinList(
      unique([
        ...(farms?.technologies ?? []),
        ...(aegis?.technologies ?? []),
        ...(access?.technologies ?? []),
      ]),
    ),
    "",
    "**Future direction**",
    k.perspective.graduateResearchDirection.split("\n\n")[0] ??
      k.perspective.graduateResearchDirection,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return withNav(body, [
    `Research dossiers → ${portfolioNav.research}`,
    `Journey → ${portfolioNav.journey}`,
    `Resume → ${portfolioNav.resume}`,
  ]);
}

export function formatResearchOverviewIntent(): string {
  const k = cameronKnowledge;
  const featured = ["ai-farms", "project-aegis", "access-ci"]
    .map((slug) => projectBySlug(slug))
    .filter(Boolean) as CameronResearchEntry[];

  const overview = `${k.identity.name} researches ${joinList(k.identity.researchFocus)}, with flagship work in precision agriculture robotics, healthcare digital twins, and AI-powered research infrastructure.`;

  const body = [
    overview,
    "",
    "**Projects**",
    ...featured.map(
      (r) =>
        `• **${r.project}** (${r.domain}) — Role: ${r.role}. ${r.description.split("\n\n")[0]} Impact: ${joinList(r.impact)}.`,
    ),
    "",
    "**Relevant technologies**",
    joinList(unique(featured.flatMap((r) => r.technologies))),
    "",
    "**Impact**",
    "Field systems that conserve resources; digital twins that support aging-in-place research; NLP automation that speeds research cyberinfrastructure workflows.",
  ].join("\n");

  return withNav(body, [
    `All research → ${portfolioNav.research}`,
    `Publications → ${portfolioNav.publications}`,
    `Journey → ${portfolioNav.journey}`,
  ]);
}

export function formatRoboticsExperienceIntent(): string {
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const prairie = projectBySlug("prairie-view-robotics");
  const roboticsIntern = cameronKnowledge.experience.find((e) =>
    e.role.toLowerCase().includes("robotics intern"),
  );

  const overview =
    "Cameron’s robotics work centers on embodied AI in agriculture and healthcare contexts — drones, rovers, embedded prototypes, and assistive robotics inside digital twin environments — not classroom simulation alone.";

  // One entry per theme (no duplicate AI Farms project + AI Farms experience lines)
  const experienceLines = [
    farms
      ? `• **AI Farms** — ${farms.role}. Field robotics with drones, rovers, computer vision, and autonomous platforms for precision agriculture.`
      : null,
    roboticsIntern
      ? `• **Prairie View A&M Robotics Internship** (${roboticsIntern.dates}) — ${roboticsIntern.responsibilities}`
      : prairie
        ? `• **Prairie View Robotics** — ${prairie.role}: hands-on autonomous systems, embedded sensing, and prototyping.`
        : null,
    aegis
      ? `• **Project AEGIS** — ${aegis.role}. Digital twin apartment framework with assistive robotics integration (RoboDog concepts for aging-in-place research).`
      : null,
  ].filter(Boolean);

  const body = [
    overview,
    "",
    "**Experience**",
    ...experienceLines,
    "",
    "**Relevant technologies**",
    joinList(roboticsTechnologies()),
    "",
    "**Applications**",
    "Precision agriculture sensing and autonomy; embedded robotics prototypes; healthcare-oriented digital twin and assistive robotics research.",
  ].join("\n");

  return withNav(body, [
    `AI Farms → ${portfolioNav.researchProject("ai-farms")}`,
    `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}`,
    `Experience → ${portfolioNav.experience}`,
    `Resume → ${portfolioNav.resume}`,
  ]);
}

export function formatSkillsIntent(): string {
  const s = cameronKnowledge.technicalSkills;
  const robotics = roboticsTechnologies();
  const overview = `${cameronKnowledge.identity.name} works across AI research software, robotics/embedded systems, and research tooling for physical-world applications.`;

  const body = [
    overview,
    "",
    "**Programming languages**",
    joinList(s.languages),
    "",
    "**AI tools & methods**",
    joinList(s.ai.filter((t) => t.toLowerCase() !== "ros")),
    "",
    "**Robotics & embodied systems**",
    joinList(robotics),
    "",
    "**Frameworks & platforms**",
    joinList(s.frameworks),
    "",
    "**Research methods & tools**",
    joinList(
      unique([
        ...(s.categories.find((c) => c.name === "Research")?.skills ?? []),
        ...s.tools,
      ]),
    ),
  ].join("\n");

  return withNav(body, [
    `Resume → ${portfolioNav.resume}`,
    `Research → ${portfolioNav.research}`,
  ]);
}

export function formatCareerInternshipsIntent(): string {
  const appointments = getInternshipAppointments();
  const overview = `${cameronKnowledge.identity.name} has held research appointments and internships spanning precision agriculture AI, healthcare digital twins, research cyberinfrastructure, embedded robotics, and industry operations.`;

  const body = [
    overview,
    "",
    "**Internships & research appointments**",
    ...appointments.map(
      (e) =>
        `• **${e.role}** — ${e.organization} (${e.dates}). ${e.responsibilities}`,
    ),
    "",
    "**Relevant technologies**",
    joinList(unique(appointments.flatMap((e) => e.technologies))),
  ].join("\n");

  return withNav(body, [
    `Full experience → ${portfolioNav.experience}`,
    `Resume → ${portfolioNav.resume}`,
    `Research → ${portfolioNav.research}`,
  ]);
}

export function generateIntentResponse(intent: AskCameronResponseIntent): string {
  switch (intent) {
    case "identity-intro":
      return formatIdentityIntroduction();
    case "research-overview":
      return formatResearchOverviewIntent();
    case "robotics-experience":
      return formatRoboticsExperienceIntent();
    case "skills":
      return formatSkillsIntent();
    case "career-internships":
      return formatCareerInternshipsIntent();
    default:
      return formatIdentityIntroduction();
  }
}
