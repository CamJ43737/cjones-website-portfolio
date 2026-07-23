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
  | "project-simple"
  | "hobby-interest";

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

/** Beyond the Lab / hobbies — conversational interest questions (Phase 4A). */
export function isHobbyInterestQuestion(question: string): boolean {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q) return false;

  if (
    q.includes("hobby") ||
    q.includes("hobbies") ||
    q.includes("for fun") ||
    q.includes("free time") ||
    q.includes("passion") ||
    q.includes("passions")
  ) {
    return true;
  }

  if (
    q.includes("beyond the lab") ||
    q.includes("outside the lab") ||
    q.includes("outside research") ||
    q.includes("outside of research") ||
    q.includes("outside work") ||
    q.includes("outside of work") ||
    q.includes("outside ai") ||
    q.includes("outside of ai") ||
    q.includes("outside technology") ||
    q.includes("outside of technology")
  ) {
    return true;
  }

  if (
    q.includes("what does he like") ||
    q.includes("what does cameron like") ||
    q.includes("what does he enjoy") ||
    q.includes("what does cameron enjoy") ||
    q.includes("what does he do for fun") ||
    q.includes("what does cameron do for fun") ||
    q.includes("what does he have") ||
    q.includes("what does cameron have") ||
    /\bwhat else (does he|does cameron) do\b/.test(q)
  ) {
    return true;
  }

  if (
    q.includes("interests") &&
    (q.includes("outside") || q.includes("personal") || q.includes("cameron") || q.includes("his"))
  ) {
    return true;
  }

  // Specific hobby likes (not service/collaboration asks)
  if (
    (q.includes("like") || q.includes("enjoy") || q.includes("into")) &&
    (q.includes("fishing") || q.includes("photography") || q.includes("pc build") || q.includes("building pcs"))
  ) {
    return true;
  }

  if (
    q.includes("fishing") &&
    (q.includes("does he") || q.includes("does cameron") || q.includes("like") || q.includes("enjoy"))
  ) {
    return true;
  }

  if (
    (q.includes("tell me about cameron") || q.includes("about cameron")) &&
    (q.includes("outside") || q.includes("beyond"))
  ) {
    return true;
  }

  return false;
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

/** First paragraph / block only — keeps answers from dumping multi-section knowledge. */
function firstBlock(text: string): string {
  return (text.split(/\n\n+/)[0] ?? text).trim();
}

function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?[.!?])(\s|$)/);
  return match?.[1] ?? cleaned.slice(0, 160);
}

/**
 * Optional site links — max 2, no “Explore on this site” menu.
 * Prefer follow-up invitations over navigation dumps.
 */
function withLinks(body: string, links: string[] = [], max = 2): string {
  const uniqueLinks = [...new Set(links.filter(Boolean))].slice(0, max);
  if (!uniqueLinks.length) return body;
  return [body, "", ...uniqueLinks.map((l) => `→ ${l}`)].join("\n");
}

function withFollowUp(body: string, followUp: string): string {
  const tip = followUp.trim();
  if (!tip) return body;
  return `${body}\n\n${tip}`;
}

function whyAnswer(topic: "ai" | "robotics" | "technology" | "tuskegee" | "general"): string {
  const whys = cameronKnowledge.story.whys;
  const find = (needle: string) =>
    whys.find((w) => w.question.toLowerCase().includes(needle))?.answer;

  if (topic === "ai")
    return firstBlock(find("why ai") ?? cameronKnowledge.perspective.whyAiAndRobotics);
  if (topic === "robotics")
    return firstBlock(
      find("why robotics") ?? cameronKnowledge.perspective.whyAiAndRobotics,
    );
  if (topic === "tuskegee") return firstBlock(cameronKnowledge.perspective.whyTuskegeeMatters);
  if (topic === "technology") {
    return firstBlock(
      find("computer science") ?? cameronKnowledge.perspective.whyCameronBuilds,
    );
  }
  return firstBlock(cameronKnowledge.perspective.whyCameronBuilds);
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

  // Beyond the Lab / hobbies (before collaboration so interest questions stay on hobbies)
  if (isHobbyInterestQuestion(q)) {
    return "hobby-interest";
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

  // Research overview (not a single named project; not timeline/journey walkthroughs)
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
      // Leave research timeline / research journey to structured timeline mode
      if (
        q.includes("timeline") ||
        q.includes("research journey") ||
        (q.includes("journey") && (q.includes("walk") || q.includes("through")))
      ) {
        return null;
      }
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
    case "hobby-interest":
      return ["beyond"];
    default:
      return [];
  }
}

export function formatIdentityIntroduction(): string {
  const i = cameronKnowledge.identity;
  const projects = ["AI Farms", "Project AEGIS", "ACCESS-CI"].join(", ");

  const body = [
    `I'm ${i.name}, a ${i.major} student at ${i.university}, AI researcher, and robotics engineer focused on building intelligent systems that connect AI with the physical world.`,
    "",
    `My work sits at the intersection of ${joinList(i.researchFocus)} through projects like ${projects}. I started by building computers and exploring technology hands-on, which grew into my current work developing intelligent systems for real-world environments.`,
  ].join("\n");

  return withFollowUp(
    body,
    "I can also share more about my research, experience, or journey into AI.",
  );
}

export function formatResearchOverviewIntent(): string {
  const k = cameronKnowledge;
  const featured = ["ai-farms", "project-aegis", "access-ci"]
    .map((slug) => projectBySlug(slug))
    .filter(Boolean) as CameronResearchEntry[];

  const examples = featured
    .map((r) => `${r.project} (${r.domain}; role: ${r.role})`)
    .join("; ");

  const body = [
    `${k.identity.name} researches ${joinList(k.identity.researchFocus)}, with flagship work in precision agriculture robotics, healthcare digital twins, and AI-powered research infrastructure.`,
    "",
    `Key examples include ${examples}. Impact spans resource-efficient field systems, aging-in-place digital twins, and NLP tooling that speeds research cyberinfrastructure workflows.`,
  ].join("\n");

  return withFollowUp(
    body,
    "I can explain any project in more detail, or walk through Cameron’s research timeline.",
  );
}

export function formatRoboticsExperienceIntent(): string {
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");
  const prairie = projectBySlug("prairie-view-robotics");
  const roboticsIntern = cameronKnowledge.experience.find((e) =>
    e.role.toLowerCase().includes("robotics intern"),
  );
  const tech = roboticsTechnologies().slice(0, 8);

  const examples = [
    farms
      ? `AI Farms (${farms.role}) — field robotics with drones, rovers, and computer vision for precision agriculture`
      : null,
    roboticsIntern
      ? `a Prairie View A&M robotics internship (${roboticsIntern.dates}) focused on autonomous systems and embedded sensing`
      : prairie
        ? `Prairie View robotics work (${prairie.role}) on autonomous systems and embedded sensing`
        : null,
    aegis
      ? `Project AEGIS (${aegis.role}) — assistive robotics concepts inside healthcare digital twin environments`
      : null,
  ].filter(Boolean);

  const body = [
    `Cameron’s robotics experience centers on embodied AI in agriculture and healthcare — not classroom simulation alone.`,
    "",
    `Notable work includes ${examples.join("; ")}. Relevant tools in this stack include ${joinList(tech)}.`,
  ].join("\n");

  return withFollowUp(
    withLinks(body, [
      farms ? `AI Farms → ${portfolioNav.researchProject("ai-farms")}` : "",
      aegis ? `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}` : "",
    ]),
    "Would you like a deeper dive into one of these robotics efforts?",
  );
}

export function formatSkillsIntent(): string {
  const s = cameronKnowledge.technicalSkills;
  const robotics = roboticsTechnologies().slice(0, 8);
  const ai = s.ai.filter((t) => t.toLowerCase() !== "ros").slice(0, 10);

  const body = [
    `Cameron works across AI research software, robotics/embedded systems, and research tooling for physical-world applications.`,
    "",
    `Languages include ${joinList(s.languages)}. AI methods and tools include ${joinList(ai)}. Robotics-related technologies include ${joinList(robotics)}. Frameworks and platforms include ${joinList(s.frameworks)}.`,
    "",
    `His public portfolio emphasizes applied methods — machine learning, computer vision, NLP/LLMs, and simulation (including Unity digital twins) — rather than listing proprietary dataset names.`,
  ].join("\n");

  return withFollowUp(
    body,
    "I can focus on AI tools, robotics tech, or skills used on a specific project.",
  );
}

export function formatCareerInternshipsIntent(): string {
  const appointments = getInternshipAppointments();
  const highlights = appointments.slice(0, 5).map((e) => {
    const brief = firstSentence(e.responsibilities);
    return `• **${e.role}** — ${e.organization} (${e.dates}). ${brief}`;
  });

  const body = [
    `${cameronKnowledge.identity.name} has held research appointments and internships spanning precision agriculture AI, healthcare digital twins, research cyberinfrastructure, embedded robotics, and industry operations.`,
    "",
    ...highlights,
  ].join("\n");

  return withFollowUp(
    withLinks(body, [`Experience → ${portfolioNav.experience}`], 1),
    "I can expand on any appointment or focus on industry vs. research roles.",
  );
}

export function formatFutureDirectionIntent(): string {
  const p = cameronKnowledge.perspective;
  const interests = p.futureResearchInterests.slice(0, 5);

  const body = [
    `I plan to pursue graduate research that advances AI and robotics as intelligent systems for the physical world — especially agriculture, healthcare, and autonomous environments.`,
    "",
    `Areas I want to research include ${interests.join("; ")}. ${firstBlock(p.aiRoboticsVision)}`,
  ].join("\n");

  return withFollowUp(
    body,
    "I can also share more about my current research projects or why I’m drawn to this path.",
  );
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

  const aboutBuilding =
    q.includes("never stopped") ||
    q.includes("building mean") ||
    q.includes("does building mean");
  const aboutPhilosophy = q.includes("philosophy");

  if (aboutBuilding) {
    return withFollowUp(
      [
        q.includes("never stopped")
          ? "I say “Never stopped building” because building is how I learn and how I serve."
          : "Building, for me, is how I learn and how I serve.",
        "",
        "The tools changed — LEGO, PCs, robots, AI — but the purpose stayed the same. I never stopped building; I expanded what I build.",
      ].join("\n"),
      "I can also share how that path led into AI and robotics research.",
    );
  }

  if (aboutPhilosophy) {
    return withFollowUp(
      "I believe intelligence should be embodied. Research matters when it touches soil, clinics, homes, and real constraints — when AI helps people and systems in the physical world.",
      "I can connect that philosophy to specific projects like AI Farms or Project AEGIS if you’d like.",
    );
  }

  if (focus === "tuskegee") {
    return withFollowUp(
      firstBlock(k.perspective.whyTuskegeeMatters),
      "I can also share more about my research or journey into AI.",
    );
  }

  const origin =
    focus === "technology" || focus === "general"
      ? `My journey started with hands-on building — from systems I could rebuild to machines that act in the world. ${firstSentence(k.story.legoStory)} That curiosity became programming, then robotics and AI research.`
      : `My path into ${focus === "ai" ? "AI" : "robotics"} grew from hands-on building into research on intelligent systems in the physical world.`;

  const body = [origin, "", whyAnswer(focus)].join("\n");

  return withFollowUp(
    body,
    focus === "ai" || focus === "robotics"
      ? "Would you like to hear about the research projects that grew from this?"
      : "I can also share more about my research, Tuskegee story, or future goals.",
  );
}

export function formatProjectSimpleIntent(question: string): string {
  const q = question.toLowerCase();
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");

  if (q.includes("aegis")) {
    const body = [
      `Project AEGIS helps older adults stay safer and more independent at home by using digital twins — virtual home models — and robotics ideas before those systems are used in real homes.`,
      "",
      `Imagine a detailed virtual apartment where researchers can test how AI and assistive robots might support aging-in-place. Cameron helps lead the apartment / simulation framework side of that work (${aegis?.role ?? "Apartment Framework Lead"}).`,
    ].join("\n");
    return withFollowUp(
      withLinks(body, [
        `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}`,
      ], 1),
      "I can go deeper on the technology stack or Cameron’s role if you’d like.",
    );
  }

  const body = [
    `AI Farms helps farms work smarter — using AI, robots, drones, and sensors to monitor crops and use water and labor more carefully.`,
    "",
    `Instead of relying only on human eyes across large fields, the project explores machines that can sense plant health and support precision agriculture decisions. Cameron’s role: ${farms?.role ?? "AI Robotics Engineer"}.`,
  ].join("\n");
  return withFollowUp(
    withLinks(body, [`AI Farms → ${portfolioNav.researchProject("ai-farms")}`], 1),
    "I can explain the technical approach or impact metrics next.",
  );
}

export function formatEducationIntent(): string {
  const e = cameronKnowledge.education;
  const i = cameronKnowledge.identity;

  const body = `${i.name} studies ${e.major} at ${e.university} (expected graduation ${e.expectedGraduation}). He is based in ${e.location}; hometown: ${i.hometown}.`;

  return withFollowUp(
    body,
    "I can also share Cameron’s research focus or experience.",
  );
}

/**
 * Beyond the Lab — dedicated hobby/interest formatter (Phase 4A).
 * Returns all hobbies for overview questions; fishing-specific when asked.
 */
export function formatHobbyInterestIntent(question: string): string {
  const q = question.toLowerCase();
  const hobbies = cameronKnowledge.beyondTheLab;
  const fishing = hobbies.find((h) => h.id === "fishing");
  const photo = hobbies.find((h) => h.id === "photography");
  const pc = hobbies.find((h) => h.id === "pc-building");

  if (
    fishing &&
    q.includes("fishing") &&
    (q.includes("like") || q.includes("enjoy") || q.includes("does he") || q.includes("does cameron"))
  ) {
    return withFollowUp(
      "Yes. Fishing is one of Cameron’s ways to disconnect, practice patience, and maintain balance outside technology.",
      "I can also share Cameron’s PC building or photography interests.",
    );
  }

  if (
    photo &&
    q.includes("photography") &&
    (q.includes("like") || q.includes("enjoy") || q.includes("hobby"))
  ) {
    return withFollowUp(
      `Yes. Photography is one of Cameron’s creative outlets — ${firstSentence(photo.description)} Theme: ${photo.theme}.`,
      "I can also share his PC building or fishing interests.",
    );
  }

  if (
    pc &&
    (q.includes("pc build") || q.includes("building pcs") || q.includes("computer building")) &&
    (q.includes("like") || q.includes("enjoy") || q.includes("hobby"))
  ) {
    return withFollowUp(
      `Yes. PC building is a core interest for Cameron — ${firstSentence(pc.description)}`,
      "I can also share his photography or fishing interests.",
    );
  }

  const body = [
    "Cameron’s interests outside research reflect the same curiosity that drives his engineering work. Beyond the lab, he enjoys PC building, photography, and fishing.",
    "",
    "• **PC Building** — Building systems from the hardware up; hardware curiosity that still informs how he engineers.",
    "• **Photography** — Capturing technology, people, and moments through his lens.",
    "• **Fishing** — Time outdoors for patience, perspective, and balance away from screens.",
  ].join("\n");

  return withFollowUp(
    withLinks(body, [`Beyond the Lab → /beyond`], 1),
    "I can tell you more about Cameron’s engineering interests, photography, or hobbies.",
  );
}

export function formatCollaborationServicesIntent(question: string): string {
  const q = question.toLowerCase();
  const c = cameronKnowledge.contact;
  const beyond = cameronKnowledge.beyondTheLab;
  const photo = beyond.find((b) => b.id === "photography");
  const pc = beyond.find((b) => b.id === "pc-building");

  if (q.includes("contact") || q.includes("reach") || q.includes("email")) {
    return withFollowUp(
      withLinks(
        `The best way to reach Cameron is by email at ${c.email}. You can also find him on LinkedIn (${c.linkedin}) and GitHub (${c.github}).`,
        [`Connect → ${portfolioNav.connect}`],
        1,
      ),
      "Happy to point you to research or resume details as well.",
    );
  }

  if (q.includes("website") || q.includes("web")) {
    return withFollowUp(
      `Yes — Cameron builds software and systems, including web and digital projects. The best next step is to email ${c.email} with a short brief of what you need.`,
      "I can also share relevant project examples from his portfolio.",
    );
  }

  if (q.includes("photo")) {
    return withFollowUp(
      `Yes. ${firstSentence(photo?.description ?? "Cameron practices photography as a creative craft.")} Reach out via ${c.email} if you’d like to collaborate.`,
      "",
    );
  }

  if (q.includes("pc") || q.includes("computer build") || q.includes("hardware")) {
    return withFollowUp(
      `Yes. ${firstSentence(pc?.description ?? "Cameron builds systems from the hardware up.")} Contact: ${c.email}.`,
      "",
    );
  }

  if (q.includes("collaborate") || q.includes("collaboration") || q.includes("research")) {
    return withLinks(
      withFollowUp(
        `Yes — Cameron welcomes research collaboration related to AI, robotics, agriculture, and healthcare digital twins. Email ${c.email} with a short note on your interest or project.`,
        "I can also share project overviews that may be relevant.",
      ),
      [`Connect → ${portfolioNav.connect}`],
      1,
    );
  }

  return withLinks(
    withFollowUp(
      `${cameronKnowledge.identity.name} welcomes research collaboration, professional conversations, and thoughtful creative/technical outreach. Email ${c.email}, or connect via LinkedIn (${c.linkedin}).`,
      "What kind of collaboration are you exploring?",
    ),
    [`Connect → ${portfolioNav.connect}`],
    1,
  );
}

export function formatResearchComparisonIntent(question: string): string {
  const q = question.toLowerCase();
  const farms = projectBySlug("ai-farms");
  const aegis = projectBySlug("project-aegis");

  const wantsThemes =
    q.includes("theme") || q.includes("connected") || q.includes("connect");

  if (!farms || !aegis) {
    return formatResearchOverviewIntent();
  }

  const body = wantsThemes
    ? [
        `Cameron’s agriculture and healthcare AI work connects through one idea: intelligent systems that act in the physical world — sensing, deciding, and supporting people and land.`,
        "",
        `AI Farms applies that idea in the field (precision agriculture robotics), while Project AEGIS applies it in the home (healthcare digital twins and assistive robotics for aging-in-place). ACCESS-CI complements both with research cyberinfrastructure and knowledge systems.`,
      ].join("\n")
    : [
        `AI Farms and Project AEGIS show two faces of Cameron’s research: field robotics for agriculture, and healthcare digital twins for aging-in-place.`,
        "",
        `**AI Farms** (${farms.domain}) — ${farms.role}. Focus: ${farms.problem.slice(0, 2).join("; ")}.`,
        `**Project AEGIS** (${aegis.domain}) — ${aegis.role}. Focus: ${aegis.problem.slice(0, 2).join("; ")}.`,
        "",
        `Both emphasize embodied AI — intelligence that has to work outside slides.`,
      ].join("\n");

  return withFollowUp(
    withLinks(body, [
      `AI Farms → ${portfolioNav.researchProject("ai-farms")}`,
      `Project AEGIS → ${portfolioNav.researchProject("project-aegis")}`,
    ]),
    "I can go deeper on either project’s technology or impact.",
  );
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
    case "hobby-interest":
      return formatHobbyInterestIntent(question);
    default:
      return formatIdentityIntroduction();
  }
}
