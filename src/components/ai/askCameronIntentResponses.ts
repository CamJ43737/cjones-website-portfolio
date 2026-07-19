/**
 * Ask Cameron — intent-aware composed responses (Phase 3D).
 * Local only. Used before keyword ranking so intro questions don't latch onto a single timeline doc.
 */

import {
  cameronKnowledge,
  portfolioNav,
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

  // Career / internships
  if (
    q.includes("intern") ||
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
      // Avoid stealing graduate/perspective questions
      if (
        q.includes("graduate") ||
        q.includes("phd") ||
        q.includes("future research interest") ||
        q.includes("why")
      ) {
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
      return ["experience", "research"];
    default:
      return [];
  }
}

function withNav(body: string, links: string[]): string {
  const unique = [...new Set(links.filter(Boolean))];
  if (!unique.length) return body;
  return [body, "", "**Explore on this site**", ...unique.map((l) => `• ${l}`)].join("\n");
}

export function formatIdentityIntroduction(): string {
  const k = cameronKnowledge;
  const i = k.identity;
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const access = projectBySlug("access-ci");

  const intro = [
    `**${i.name}** is a ${i.major} student at ${i.university} (expected graduation ${i.graduation}), working as an AI researcher and robotics engineer.`,
    `His research focuses on ${joinList(i.researchFocus)} — building intelligent systems where artificial intelligence meets the physical world.`,
  ].join(" ");

  const origin = [
    "**Origin story**",
    k.story.legoStory,
    "",
    k.story.pcBuildingStory.split("\n\n")[0] ?? k.story.pcBuildingStory,
    "",
    "That path grew into software, robotics, and AI research — curiosity that never stopped building.",
  ].join("\n");

  const current = [
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
  ]
    .filter(Boolean)
    .join("\n");

  const future = [
    "**Future direction**",
    k.perspective.aiRoboticsVision,
    "",
    k.perspective.graduateResearchDirection.split("\n\n")[0] ??
      k.perspective.graduateResearchDirection,
  ].join("\n");

  return withNav([intro, "", origin, "", current, "", future].join("\n"), [
    `Research dossiers → ${portfolioNav.research}`,
    `Journey → ${portfolioNav.journey}`,
    `Resume → ${portfolioNav.resume}`,
    farms ? `AI Farms → ${portfolioNav.researchProject("ai-farms")}` : "",
    aegis ? `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}` : "",
    access ? `ACCESS-CI → ${portfolioNav.researchProject("access-ci")}` : "",
  ]);
}

export function formatResearchOverviewIntent(): string {
  const k = cameronKnowledge;
  const featured = ["ai-farms", "project-aegis", "access-ci"]
    .map((slug) => projectBySlug(slug))
    .filter(Boolean) as CameronResearchEntry[];

  const body = [
    "**Research focus**",
    `${k.identity.name} researches ${joinList(k.identity.researchFocus)}.`,
    k.perspective.researchInterestsSummary,
    "",
    "**Projects**",
    ...featured.map(
      (r) =>
        `• **${r.project}** (${r.domain})\n  Role: ${r.role}\n  ${r.description.split("\n\n")[0]}\n  Impact: ${joinList(r.impact)}\n  Dossier: ${portfolioNav.researchProject(r.slug)}`,
    ),
    "",
    "**Technologies**",
    joinList([
      ...new Set(featured.flatMap((r) => r.technologies)),
    ]),
    "",
    "**Impact themes**",
    "Precision agriculture efficiency and conservation; healthcare digital twins for aging-in-place; AI-powered research cyberinfrastructure that reduces manual knowledge work.",
  ].join("\n");

  return withNav(body, [
    `All research → ${portfolioNav.research}`,
    `Publications → ${portfolioNav.publications}`,
    `Journey → ${portfolioNav.journey}`,
  ]);
}

export function formatRoboticsExperienceIntent(): string {
  const k = cameronKnowledge;
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const prairie = projectBySlug("prairie-view-robotics");

  const body = [
    "**Robotics experience**",
    k.perspective.aiRoboticsVision,
    "",
    "**Experience**",
    farms
      ? `• **AI Farms** — field robotics with drones, rovers, vision, and autonomous platforms for precision agriculture (${farms.role}).`
      : null,
    prairie
      ? `• **Prairie View Robotics** — ${prairie.role}: hands-on autonomous systems, embedded sensing, and prototyping.`
      : null,
    aegis
      ? `• **Project AEGIS** — ${aegis.role}: digital twin environments with assistive robotics integration (including RoboDog concepts in the aging-in-place ecosystem).`
      : null,
    ...k.experience
      .filter(
        (e) =>
          /robot/i.test(e.role) ||
          e.technologies.some((t) => /robot/i.test(t)) ||
          /robot|drone|rover/i.test(e.responsibilities),
      )
      .map(
        (e) =>
          `• **${e.role}** @ ${e.organization} (${e.dates}) — ${e.responsibilities}`,
      ),
    "",
    "**Hardware & software**",
    `Robotics stack: ${joinList(k.technicalSkills.robotics)}.`,
    `Also used across projects: ${joinList(
      [
        ...new Set(
          [farms, aegis, prairie]
            .filter(Boolean)
            .flatMap((r) => r!.technologies),
        ),
      ],
    )}.`,
    "",
    "**Applications**",
    "Precision agriculture (sensing, autonomy, field demos), embedded robotics prototypes, and healthcare-oriented digital twin / assistive robotics research.",
  ]
    .filter(Boolean)
    .join("\n");

  return withNav(body, [
    `AI Farms → ${portfolioNav.researchProject("ai-farms")}`,
    `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}`,
    `Experience → ${portfolioNav.experience}`,
    `Resume → ${portfolioNav.resume}`,
  ]);
}

export function formatSkillsIntent(): string {
  const s = cameronKnowledge.technicalSkills;
  const body = [
    `**Technical skills — ${cameronKnowledge.identity.name}**`,
    "",
    "**Programming languages**",
    joinList(s.languages),
    "",
    "**AI tools & methods**",
    joinList(s.ai),
    "",
    "**Robotics tools**",
    joinList(s.robotics),
    "",
    "**Frameworks**",
    joinList(s.frameworks),
    "",
    "**Research methods & tools**",
    joinList([
      ...s.categories.find((c) => c.name === "Research")?.skills ?? [],
      ...s.tools,
    ]),
    "",
    "By category:",
    ...s.categories.map((c) => `• ${c.name}: ${joinList(c.skills)}`),
  ].join("\n");

  return withNav(body, [
    `Resume → ${portfolioNav.resume}`,
    `Research → ${portfolioNav.research}`,
  ]);
}

export function formatCareerInternshipsIntent(): string {
  const body = [
    `**Experience & internships — ${cameronKnowledge.identity.name}**`,
    "",
    ...cameronKnowledge.experience.map(
      (e) =>
        [
          `**${e.role}**`,
          `Organization: ${e.organization}`,
          `Dates: ${e.dates}`,
          `Impact: ${e.responsibilities}`,
          `Technologies: ${joinList(e.technologies)}`,
        ].join("\n"),
    ),
  ].join("\n\n");

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
