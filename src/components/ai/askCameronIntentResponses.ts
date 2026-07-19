/**
 * Ask Cameron — intent-aware composed responses (Phase 3D–3F.1).
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
  | "career-internships"
  | "future-direction"
  | "motivation-origin"
  | "education"
  | "collaboration-services"
  | "research-comparison"
  | "project-simple";

/** Voice for composed answers (Phase 3G). Personal/story = first-person; factual = third-person. */
export type AskCameronAnswerVoice = "first-person" | "third-person";

export function voiceForIntent(intent: AskCameronResponseIntent): AskCameronAnswerVoice {
  switch (intent) {
    case "identity-intro":
    case "motivation-origin":
    case "future-direction":
      return "first-person";
    default:
      return "third-person";
  }
}

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

function whyAnswer(topic: "ai" | "robotics" | "technology" | "tuskegee" | "general"): string {
  const whys = cameronKnowledge.story.whys;
  const find = (needle: string) =>
    whys.find((w) => w.question.toLowerCase().includes(needle))?.answer;

  if (topic === "ai") return find("why ai") ?? cameronKnowledge.perspective.whyAiAndRobotics;
  if (topic === "robotics")
    return find("why robotics") ?? cameronKnowledge.perspective.whyAiAndRobotics;
  if (topic === "tuskegee") return cameronKnowledge.perspective.whyTuskegeeMatters;
  if (topic === "technology") {
    return [
      find("computer science"),
      cameronKnowledge.perspective.whyCameronBuilds,
    ]
      .filter(Boolean)
      .join("\n\n");
  }
  return cameronKnowledge.perspective.whyCameronBuilds;
}

/**
 * Detect high-level response intents before keyword document ranking.
 * Returns null to fall through to existing retrieval modes.
 */
export function detectResponseIntent(question: string): AskCameronResponseIntent | null {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q) return null;

  // Simple / non-technical project explainers
  if (
    (q.includes("simple") || q.includes("non-technical") || q.includes("non technical") || q.includes("layman")) &&
    (q.includes("aegis") || q.includes("ai farms") || q.includes("farm"))
  ) {
    return "project-simple";
  }

  // Recruiter value / differentiation → first-person identity
  if (
    q.includes("why should someone hire") ||
    q.includes("why hire cameron") ||
    q.includes("should someone hire") ||
    q.includes("makes cameron different") ||
    q.includes("different from other")
  ) {
    return "identity-intro";
  }

  // 1) Research comparison / connecting themes
  if (
    q.includes("compare") ||
    q.includes(" vs ") ||
    q.includes("versus") ||
    q.includes("difference between") ||
    (q.includes("connected") && (q.includes("project") || q.includes("research"))) ||
    (q.includes("themes") && q.includes("research")) ||
    (q.includes("how are") && q.includes("project")) ||
    ((q.includes("agriculture") || q.includes("farm")) &&
      (q.includes("healthcare") || q.includes("health") || q.includes("aging")) &&
      (q.includes("connect") || q.includes("related") || q.includes("link")))
  ) {
    return "research-comparison";
  }

  // 2) Collaboration / services / contact
  if (
    q.includes("contact") ||
    q.includes("reach cameron") ||
    q.includes("email cameron") ||
    q.includes("work with cameron") ||
    q.includes("collaborate") ||
    q.includes("collaboration") ||
    q.includes("can cameron collaborate") ||
    q.includes("can cameron build") ||
    q.includes("build website") ||
    q.includes("build websites") ||
    q.includes("web development") ||
    q.includes("photography") ||
    q.includes("photographer") ||
    (q.includes("how can") &&
      (q.includes("work with") || q.includes("contact") || q.includes("reach") || q.includes("hire")))
  ) {
    return "collaboration-services";
  }

  // 3) Motivation / origin (before robotics/skills so "why robotics" is not experience)
  if (
    q.includes("why did cameron") ||
    q.includes("why does cameron") ||
    q.includes("what inspired") ||
    q.includes("inspired cameron") ||
    q.includes("interested in technology") ||
    q.includes("never stopped building") ||
    q.includes("building mean") ||
    q.includes("research philosophy") ||
    /^why (ai|robotics|technology|tech|tuskegee)\b/.test(q) ||
    (q.includes("why") &&
      (q.includes("choose ai") ||
        q.includes("choose robotics") ||
        q.includes("into ai") ||
        q.includes("into robotics") ||
        q.includes("tuskegee") ||
        q.includes("technology") ||
        (q.includes("robot") && !q.includes("experience")) ||
        (q.includes("ai") && !q.includes("farms") && !q.includes("technolog"))))
  ) {
    // Avoid stealing "why does cameron want graduate research" → future
    if (
      (q.includes("graduate") || q.includes("phd") || q.includes("after graduation")) &&
      !q.includes("philosophy")
    ) {
      return "future-direction";
    }
    return "motivation-origin";
  }

  // 4) Future direction / career goals / graduate plans
  if (
    q.includes("future goal") ||
    q.includes("future goals") ||
    q.includes("career goal") ||
    q.includes("career goals") ||
    q.includes("after graduation") ||
    q.includes("planning to do") ||
    q.includes("plan to do") ||
    q.includes("planning graduate") ||
    q.includes("graduate school") ||
    q.includes("phd") ||
    q.includes("research problems") ||
    q.includes("problems is cameron interested") ||
    (q.includes("interested in") &&
      q.includes("research") &&
      (q.includes("problem") || q.includes("area"))) ||
    (q.includes("future") &&
      (q.includes("plan") || q.includes("direction") || q.includes("interest") || q.includes("research"))) ||
    (q.includes("graduate") &&
      (q.includes("research") ||
        q.includes("goal") ||
        q.includes("plan") ||
        q.includes("want") ||
        q.includes("pursue")))
  ) {
    return "future-direction";
  }

  // 5) Education
  if (
    q.includes("where does cameron study") ||
    q.includes("where does cameron go to school") ||
    q.includes("what university") ||
    q.includes("which university") ||
    q.includes("majoring") ||
    q.includes("major in") ||
    q.includes("what is cameron majoring") ||
    q.includes("what does cameron study") ||
    q.includes("when does cameron graduate") ||
    q.includes("graduation date") ||
    q.includes("expected graduation") ||
    (q.includes("graduate") && q.includes("when") && !q.includes("school") && !q.includes("phd"))
  ) {
    return "education";
  }

  // Skills / models / tools
  if (
    q.includes("dataset") ||
    q.includes("datasets") ||
    q.includes("models has cameron") ||
    q.includes("models cameron") ||
    ((q.includes("skill") ||
      q.includes("technolog") ||
      q.includes("tech stack") ||
      q.includes("tools does") ||
      q.includes("tools cameron") ||
      (q.includes("technologies") && q.includes("use"))) &&
      !q.includes("aegis") &&
      !q.includes("farm"))
  ) {
    if (
      q.includes("skill") ||
      q.includes("technolog") ||
      q.includes("tools") ||
      q.includes("languages") ||
      q.includes("stack") ||
      q.includes("dataset") ||
      q.includes("model")
    ) {
      return "skills";
    }
  }

  // Robotics experience (not motivation)
  if (
    q.includes("robot") &&
    !q.startsWith("why") &&
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
    q.includes("industry experience") ||
    (q.includes("industry") && q.includes("experience")) ||
    (q.includes("where") && (q.includes("work") || q.includes("intern"))) ||
    (q.includes("experience") &&
      !q.includes("robot") &&
      !q.includes("goal") &&
      (q.includes("what experience") ||
        q.includes("professional experience") ||
        q.includes("work experience") ||
        q.includes("industry") ||
        (q.includes("career") && !q.includes("goal"))))
  ) {
    return "career-internships";
  }

  // Research overview (not a single named project)
  if (!mentionsSpecificProject(q) || q.includes("software project")) {
    if (
      (q.includes("research") &&
        (q.includes("what") ||
          q.includes("explain") ||
          q.includes("tell") ||
          q.includes("project") ||
          q.includes("does cameron"))) ||
      q.includes("what projects has cameron") ||
      q.includes("what projects did cameron") ||
      q.includes("software projects") ||
      q.includes("cameron's research") ||
      q.includes("camerons research")
    ) {
      if (q.includes("appointment")) return "career-internships";
      if (q.includes("graduate") || q.includes("phd") || q.includes("future")) {
        return "future-direction";
      }
      if (q.includes("why") || q.includes("philosophy")) return "motivation-origin";
      return "research-overview";
    }
  }

  // Identity / introduction
  if (mentionsSpecificProject(q)) return null;
  if (q.includes("robot") || q.includes("intern") || q.includes("skill")) return null;
  if (q.includes("award") || q.includes("publication")) return null;

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
      return ["skills", "research"];
    case "career-internships":
      return ["experience"];
    case "future-direction":
      return ["perspective", "education", "journey"];
    case "motivation-origin":
      return ["perspective", "story", "journey"];
    case "education":
      return ["education", "identity"];
    case "collaboration-services":
      return ["contact", "beyond"];
    case "research-comparison":
      return ["research"];
    case "project-simple":
      return ["research"];
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
    `I'm **${i.name}** — a ${i.major} student at ${i.university} (expected graduation ${i.graduation}), AI researcher, and robotics engineer.`,
    `I build intelligent systems where artificial intelligence meets the physical world, with focus areas in ${joinList(i.researchFocus)}.`,
  ].join(" ");

  const body = [
    overview,
    "",
    "**My journey**",
    "I started with LEGO — learning how small pieces become complex systems. Then I opened computer cases, rebuilt hardware, and taught myself how machines work from the inside out. That curiosity became software, robotics, and AI research.",
    "",
    k.story.legoStory,
    "",
    "**What I'm working on**",
    farms
      ? `• **AI Farms** — I serve as ${farms.role}, integrating robotics and sensing for precision agriculture.`
      : null,
    aegis
      ? `• **Project AEGIS** — as ${aegis.role}, I help build healthcare digital twin environments for aging-in-place research.`
      : null,
    access
      ? `• **ACCESS-CI** — I contributed as ${access.role}, building NLP and knowledge systems for research cyberinfrastructure.`
      : null,
    "",
    "**What sets my path apart**",
    "I don't separate building from research. I started in hardware, moved into software, and now put AI into fields, robots, and simulated homes — with a clear aim toward graduate research in physical AI.",
    "",
    "**Where I'm headed**",
    "I plan to pursue graduate research (PhD path) so I can deepen AI + robotics systems for agriculture, healthcare, and autonomous environments.",
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
  const overview = `Cameron Jones works across AI research software, robotics/embedded systems, and research tooling for physical-world applications.`;

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
    "",
    "**Models & data (evidenced in his stack)**",
    "Cameron’s public portfolio emphasizes applied AI methods — machine learning, computer vision, NLP/LLMs, and simulation (including Unity digital twins) — used across agriculture robotics and healthcare research contexts. Specific proprietary dataset names are not listed as public portfolio facts.",
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

export function formatFutureDirectionIntent(): string {
  const p = cameronKnowledge.perspective;
  const overview =
    "I plan to pursue graduate research that advances AI and robotics as intelligent systems for the physical world — especially agriculture, healthcare, and autonomous environments.";

  const body = [
    overview,
    "",
    "**Graduate research direction**",
    "The next chapter for me is graduate school and a PhD-oriented research path. I want AI that lives in soil, clinics, homes, and infrastructure — not only in slides.",
    "",
    "**What I want to research**",
    ...p.futureResearchInterests.map((i) => `• ${i}`),
    "",
    "**My vision**",
    p.aiRoboticsVision,
    "",
    "**Career goal**",
    "I want to grow as an AI scientist and robotics researcher who builds intelligent systems that serve people, land, and communities.",
  ].join("\n");

  return withNav(body, [
    `Journey (future chapter) → ${portfolioNav.journey}`,
    `Research → ${portfolioNav.research}`,
    `Resume → ${portfolioNav.resume}`,
    `Connect → ${portfolioNav.connect}`,
  ]);
}

export function formatMotivationOriginIntent(question: string): string {
  const q = question.toLowerCase();
  const k = cameronKnowledge;

  let focus = "general" as "ai" | "robotics" | "technology" | "tuskegee" | "general";
  if (q.includes("tuskegee")) focus = "tuskegee";
  else if (q.includes("robot")) focus = "robotics";
  else if (q.includes("ai") || q.includes("artificial intelligence")) focus = "ai";
  else if (q.includes("technolog") || q.includes("computer science") || q.includes("tech"))
    focus = "technology";

  const taglineNote =
    q.includes("never stopped") || q.includes("building mean") || q.includes("does building mean")
      ? [
          "",
          q.includes("never stopped")
            ? '**Why I say “Never stopped building”**'
            : "**What building means to me**",
          "Building is how I learn and how I serve. The tools changed — LEGO, PCs, robots, AI — but the purpose stayed the same. I never stopped building; I expanded what I build.",
        ]
      : [];

  const philosophyNote = q.includes("philosophy")
    ? [
        "",
        "**My research philosophy**",
        "I believe intelligence should be embodied. Research matters when it touches soil, clinics, homes, and real constraints — when AI helps people and systems in the physical world.",
      ]
    : [];

  const body = [
    "My journey started with things I could hold, then systems I could rebuild, then machines that can act in the world.",
    "",
    "**LEGO → computers → robotics → AI**",
    k.story.legoStory,
    "",
    "I began taking computers apart and rebuilding them. That curiosity became programming, then robotics and artificial intelligence.",
    "",
    "**Why this path**",
    whyAnswer(focus),
    ...taglineNote,
    ...philosophyNote,
    "",
    focus === "tuskegee" ? null : "**Why Tuskegee matters to me**",
    focus === "tuskegee"
      ? k.perspective.whyTuskegeeMatters
      : k.perspective.whyTuskegeeMatters.split("\n\n")[0],
  ]
    .filter((line) => line !== null)
    .join("\n");

  return withNav(body, [
    `Journey → ${portfolioNav.journey}`,
    `Research → ${portfolioNav.research}`,
  ]);
}

export function formatProjectSimpleIntent(question: string): string {
  const q = question.toLowerCase();
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");

  if (q.includes("aegis")) {
    const overview =
      "Project AEGIS is research on helping older adults stay safer and more independent at home — using digital twins (virtual home models) and robotics ideas before those systems are used in real homes.";
    const body = [
      overview,
      "",
      "**In plain language**",
      "Imagine a detailed virtual apartment where researchers can test how AI and assistive robots might support aging-in-place. Cameron helps lead the apartment / simulation framework side of that work.",
      "",
      "**Why it matters**",
      "It is about dignity and safety — technology that supports people living longer, more independently.",
      "",
      "**Relevant technologies**",
      joinList(aegis?.technologies ?? ["Unity 6", "Digital Twins", "Robotics"]),
    ].join("\n");
    return withNav(body, [
      `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}`,
      `All research → ${portfolioNav.research}`,
    ]);
  }

  const overview =
    "AI Farms is research that helps farms work smarter — using AI, robots, drones, and sensors to monitor crops and use water and labor more carefully.";
  const body = [
    overview,
    "",
    "**In plain language**",
    "Instead of relying only on human eyes across large fields, AI Farms explores machines that can sense plant health and support precision agriculture decisions.",
    "",
    "**Why it matters**",
    "Better planting efficiency and water conservation mean research that can translate into real agricultural impact.",
    "",
    "**Relevant technologies**",
    joinList(farms?.technologies ?? ["Python", "Computer Vision", "Robotics", "Drones"]),
  ].join("\n");
  return withNav(body, [
    `AI Farms → ${portfolioNav.researchProject("ai-farms")}`,
    `All research → ${portfolioNav.research}`,
  ]);
}

export function formatEducationIntent(): string {
  const e = cameronKnowledge.education;
  const i = cameronKnowledge.identity;
  const overview = `${i.name} studies ${e.major} at ${e.university}.`;

  const body = [
    overview,
    "",
    "**Education**",
    `• University: ${e.university}`,
    `• Major: ${e.major}`,
    `• Expected graduation: ${e.expectedGraduation}`,
    `• Location: ${e.location}`,
    `• Hometown: ${i.hometown}`,
  ].join("\n");

  return withNav(body, [
    `Resume → ${portfolioNav.resume}`,
    `Journey → ${portfolioNav.journey}`,
  ]);
}

export function formatCollaborationServicesIntent(question: string): string {
  const q = question.toLowerCase();
  const c = cameronKnowledge.contact;
  const beyond = cameronKnowledge.beyondTheLab;
  const photo = beyond.find((b) => b.id === "photography");
  const pc = beyond.find((b) => b.id === "pc-building");

  const overview = `${cameronKnowledge.identity.name} welcomes research collaboration, professional opportunities, creative projects, and thoughtful outreach related to AI, robotics, and building in the real world.`;

  const services: string[] = [];
  if (q.includes("website") || q.includes("web")) {
    services.push(
      "• **Websites / digital projects** — Cameron builds software and systems; for web or product work, the best next step is to email a short brief of what you need.",
    );
  }
  if (q.includes("photo")) {
    services.push(
      `• **Photography** — ${photo?.description ?? "Cameron practices photography as a creative craft."} Theme: ${photo?.theme ?? "creativity and perspective"}.`,
    );
  }
  if (q.includes("pc") || q.includes("computer build") || q.includes("hardware")) {
    services.push(
      `• **PC building / hardware** — ${pc?.description ?? "Cameron builds systems from the hardware up."}`,
    );
  }
  if (!services.length) {
    services.push(
      "• Research collaboration (AI, robotics, agriculture, healthcare digital twins)",
      "• Professional / recruiting conversations",
      "• Creative and technical projects (including photography and hardware interests)",
    );
  }

  const body = [
    overview,
    "",
    "**Ways to work together**",
    ...services,
    "",
    "**Beyond the Lab**",
    ...beyond.map((b) => `• **${b.title}** — ${b.description}`),
    "",
    "**Contact**",
    `• Email: ${c.email}`,
    `• LinkedIn: ${c.linkedin}`,
    `• GitHub: ${c.github}`,
  ].join("\n");

  return withNav(body, [
    `Connect → ${portfolioNav.connect}`,
    `Beyond the Lab → /beyond`,
    `Resume → ${portfolioNav.resume}`,
  ]);
}

export function formatResearchComparisonIntent(question: string): string {
  const q = question.toLowerCase();
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const access = projectBySlug("access-ci");

  const wantsThemes =
    q.includes("theme") || q.includes("connected") || q.includes("connect");

  const overview = wantsThemes
    ? "Cameron’s projects are connected by one idea: intelligent systems that act in the physical world — sensing, deciding, and supporting people and land."
    : "AI Farms and Project AEGIS show two faces of Cameron’s research: field robotics for agriculture, and healthcare digital twins for aging-in-place.";

  const body = [
    overview,
    "",
    farms && aegis
      ? [
          "**AI Farms vs Project AEGIS**",
          `• **AI Farms** (${farms.domain}) — Role: ${farms.role}. Focus: ${farms.problem.slice(0, 2).join("; ")}. Technologies: ${joinList(farms.technologies)}. Impact: ${joinList(farms.impact)}.`,
          `• **Project AEGIS** (${aegis.domain}) — Role: ${aegis.role}. Focus: ${aegis.problem.slice(0, 2).join("; ")}. Technologies: ${joinList(aegis.technologies)}. Impact: ${joinList(aegis.impact)}.`,
        ].join("\n")
      : null,
    "",
    "**Connecting themes**",
    "• Embodied / physical AI — intelligence that must work outside slides",
    "• Sensing + autonomy — drones, robots, digital twins, and simulation",
    "• Human impact — food systems, aging-in-place dignity, research velocity",
    access
      ? `• Infrastructure & knowledge systems — ACCESS-CI (${access.role}) complements the applied research stack`
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
  ]
    .filter((line) => line !== null)
    .join("\n");

  return withNav(body, [
    farms ? `AI Farms → ${portfolioNav.researchProject("ai-farms")}` : "",
    aegis ? `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}` : "",
    `All research → ${portfolioNav.research}`,
  ]);
}

export function generateIntentResponse(
  intent: AskCameronResponseIntent,
  question = "",
): string {
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
    case "future-direction":
      return formatFutureDirectionIntent();
    case "motivation-origin":
      return formatMotivationOriginIntent(question);
    case "education":
      return formatEducationIntent();
    case "collaboration-services":
      return formatCollaborationServicesIntent(question);
    case "research-comparison":
      return formatResearchComparisonIntent(question);
    case "project-simple":
      return formatProjectSimpleIntent(question);
    default:
      return formatIdentityIntroduction();
  }
}
