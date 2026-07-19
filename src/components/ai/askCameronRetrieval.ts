/**
 * Ask Cameron — local retrieval + local response composer.
 * Phase 3A: structured retrieval result feeds the pipeline context builder.
 * No external APIs.
 */

import {
  cameronKnowledge,
  getCameronKnowledgeDocuments,
  portfolioNav,
  type CameronKnowledgeDocument,
  type CameronResearchEntry,
} from "@/data/cameronKnowledge";

export type AskCameronRetrievalMode =
  | "empty"
  | "comparison"
  | "research-timeline"
  | "robotics-overview"
  | "perspective"
  | "research-index"
  | "ranked"
  | "fallback";

export type AskCameronScoredDocument = {
  id: string;
  category: string;
  title: string;
  text: string;
  score: number;
  metadata: Record<string, string | string[] | undefined>;
};

export type AskCameronRetrievalResult = {
  question: string;
  mode: AskCameronRetrievalMode;
  intents: string[];
  documents: AskCameronScoredDocument[];
  matchedProjects: CameronResearchEntry[];
  comparisonProjects?: CameronResearchEntry[];
  perspectiveDocId?: string;
  /** For research-index mode extras */
  includeExperience?: boolean;
  includeSkills?: boolean;
};

export const SUGGESTED_QUESTIONS = [
  "What research projects has Cameron worked on?",
  "Compare AI Farms vs Project AEGIS.",
  "What is Cameron's robotics experience overview?",
  "Walk me through Cameron's research timeline.",
  "Why does Cameron build with AI and robotics?",
  "What are Cameron's graduate research goals?",
  "What are Cameron's future research interests?",
  "How can I contact Cameron?",
] as const;

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "about",
  "and",
  "or",
  "but",
  "if",
  "then",
  "so",
  "than",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "his",
  "her",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "how",
  "when",
  "where",
  "can",
  "could",
  "would",
  "should",
  "do",
  "does",
  "did",
  "me",
  "my",
  "i",
  "you",
  "your",
  "tell",
  "please",
  "any",
  "some",
  "has",
  "have",
  "had",
  "cameron",
  "jones",
  "cameron's",
  "camerons",
]);

const INTENT_KEYWORDS: Record<string, string[]> = {
  research: [
    "research",
    "project",
    "projects",
    "lab",
    "laboratory",
    "dossier",
    "aegis",
    "farms",
    "access",
    "cagi",
    "hackathon",
    "prairie",
    "digital",
    "twin",
    "agriculture",
    "healthcare",
    "timeline",
  ],
  experience: [
    "experience",
    "internship",
    "intern",
    "role",
    "roles",
    "work",
    "worked",
    "job",
    "coordinator",
    "industry",
    "overview",
  ],
  skills: [
    "skill",
    "skills",
    "technolog",
    "technologies",
    "tech",
    "stack",
    "tools",
    "language",
    "languages",
    "framework",
    "python",
    "unity",
    "ros",
    "ai",
    "ml",
    "machine",
    "learning",
  ],
  journey: [
    "journey",
    "background",
    "story",
    "timeline",
    "path",
    "history",
    "began",
    "started",
    "lego",
    "builder",
    "tuskegee",
    "who",
  ],
  awards: [
    "award",
    "awards",
    "scholarship",
    "scholarships",
    "recognition",
    "honor",
    "honors",
    "winner",
    "ambassador",
    "nsf",
    "uncf",
    "tmcf",
  ],
  publications: [
    "publication",
    "publications",
    "paper",
    "papers",
    "poster",
    "posters",
    "manuscript",
    "published",
  ],
  contact: ["contact", "email", "linkedin", "github", "reach", "connect", "hire"],
  education: ["education", "university", "major", "graduate", "graduation", "degree", "phd"],
  perspective: [
    "why",
    "builds",
    "building",
    "vision",
    "purpose",
    "motivation",
    "matters",
    "future",
    "goals",
    "interest",
    "interests",
    "direction",
    "graduate",
    "phd",
    "aspir",
  ],
};

type ScoredHit = CameronKnowledgeDocument & { score: number };

function joinList(items: string[]): string {
  return items.length ? items.join(", ") : "None listed";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function detectIntents(query: string): Set<string> {
  const q = query.toLowerCase();
  const intents = new Set<string>();

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((k) => q.includes(k))) intents.add(intent);
  }

  if (q.includes("robot")) {
    intents.add("research");
    intents.add("experience");
    intents.add("skills");
  }

  if (
    q.includes("graduate") ||
    q.includes("phd") ||
    q.includes("future research") ||
    q.includes("research interest") ||
    q.includes("research direction") ||
    q.includes("vision")
  ) {
    intents.add("perspective");
    intents.add("education");
  }

  return intents;
}

function matchResearchInQuery(query: string): CameronResearchEntry[] {
  const q = query.toLowerCase();
  return cameronKnowledge.research.filter((r) => {
    const name = r.project.toLowerCase();
    const slug = r.slug.replace(/-/g, " ");
    return (
      q.includes(name) ||
      q.includes(slug) ||
      (r.slug === "project-aegis" && (q.includes("aegis") || q.includes("digital twin"))) ||
      (r.slug === "ai-farms" &&
        (q.includes("ai farms") ||
          q.includes("aifarms") ||
          (q.includes("farms") && !q.includes("hooks")))) ||
      (r.slug === "access-ci" && q.includes("access")) ||
      (r.slug === "prairie-view-robotics" && (q.includes("prairie") || q.includes("pvamu"))) ||
      (r.slug === "cagi-hackathons" && (q.includes("cagi") || q.includes("hackathon")))
    );
  });
}

function isComparisonQuestion(query: string): boolean {
  const q = query.toLowerCase();
  return (
    q.includes(" vs ") ||
    q.includes(" vs.") ||
    q.includes("versus") ||
    q.includes("compare") ||
    q.includes("comparison") ||
    q.includes("difference") ||
    q.includes("differ") ||
    (q.includes(" between ") && matchResearchInQuery(query).length >= 2)
  );
}

function isResearchTimelineQuestion(query: string): boolean {
  const q = query.toLowerCase();
  return (
    (q.includes("timeline") && (q.includes("research") || q.includes("journey"))) ||
    q.includes("research timeline") ||
    (q.includes("walk") && q.includes("research"))
  );
}

function isRoboticsOverviewQuestion(query: string): boolean {
  const q = query.toLowerCase();
  return (
    q.includes("robot") &&
    (q.includes("overview") ||
      q.includes("experience") ||
      q.includes("background") ||
      q.includes("work"))
  );
}

function aliasBoost(query: string, doc: CameronKnowledgeDocument): number {
  const q = query.toLowerCase();
  let boost = 0;

  const aliases: Record<string, string[]> = {
    "research-project-aegis": ["aegis", "digital twin", "aging", "apartment"],
    "research-ai-farms": ["ai farms", "precision agriculture", "drone", "farmbot"],
    "research-access-ci": ["access", "access-ci", "nlp", "uiuc", "illinois"],
    "research-prairie-view-robotics": ["prairie", "pvamu", "embedded"],
    "research-cagi-hackathons": ["cagi", "hackathon", "auburn"],
    "perspective-why-builds": ["why build", "builds", "builder", "never stopped"],
    "perspective-why-ai-robotics": ["why ai", "why robot", "vision"],
    "perspective-why-tuskegee": ["tuskegee", "hbcu", "legacy"],
    "perspective-future-interests": ["future", "interest", "interests"],
    "perspective-graduate-direction": ["graduate", "phd", "goals", "direction"],
  };

  for (const [id, words] of Object.entries(aliases)) {
    if (doc.id === id && words.some((w) => q.includes(w))) boost += 8;
  }

  if (doc.category === "perspective" && (q.includes("why") || q.includes("graduate"))) {
    boost += 4;
  }

  if (doc.category === "journey" && (q.includes("background") || q.includes("story"))) {
    boost += 2;
  }

  return boost;
}

function scoreDocument(
  query: string,
  tokens: string[],
  intents: Set<string>,
  doc: CameronKnowledgeDocument,
): number {
  const hay = `${doc.title}\n${doc.text}\n${doc.category}\n${doc.id}`.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (hay.includes(token)) score += 2;
    if (doc.title.toLowerCase().includes(token)) score += 2;
    if (doc.id.toLowerCase().includes(token)) score += 1;
  }

  if (doc.category === "research") {
    const project = String(doc.metadata.project ?? doc.title).toLowerCase();
    if (project && query.toLowerCase().includes(project)) score += 10;
  }

  if (intents.has(doc.category)) score += 5;
  if (intents.has("journey") && (doc.category === "story" || doc.category === "journey")) {
    score += 4;
  }
  if (intents.has("perspective") && doc.category === "perspective") score += 6;
  if (intents.has("skills") && doc.category === "skills") score += 3;
  if (intents.has("contact") && doc.category === "contact") score += 8;
  if (intents.has("education") && doc.category === "education") score += 6;

  score += aliasBoost(query, doc);

  if (
    doc.category === "journey" &&
    !intents.has("journey") &&
    !tokens.includes(String(doc.metadata.year ?? "").toLowerCase())
  ) {
    score *= 0.55;
  }

  return score;
}

function retrieve(question: string, limit = 6): ScoredHit[] {
  const tokens = tokenize(question);
  const intents = detectIntents(question);
  const docs = getCameronKnowledgeDocuments();

  const scored = docs
    .map((doc) => ({
      ...doc,
      score: scoreDocument(question, tokens, intents, doc),
    }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: ScoredHit[] = [];

  for (const hit of scored) {
    if (selected.length >= limit) break;
    const sameCat = selected.filter((s) => s.category === hit.category).length;
    const maxPerCat =
      hit.category === "research" ||
      hit.category === "experience" ||
      hit.category === "journey" ||
      hit.category === "perspective"
        ? 2
        : 1;
    if (sameCat >= maxPerCat && intents.size > 1) continue;
    selected.push(hit);
  }

  for (const intent of intents) {
    const cat =
      intent === "journey"
        ? ["journey", "story"]
        : intent === "skills"
          ? ["skills"]
          : [intent];
    if (selected.some((s) => cat.includes(s.category))) continue;
    const best = scored.find((s) => cat.includes(s.category));
    if (best && !selected.some((s) => s.id === best.id)) selected.push(best);
  }

  return selected.sort((a, b) => b.score - a.score).slice(0, limit);
}

function findResearch(slugOrTitle: string): CameronResearchEntry | undefined {
  const key = slugOrTitle.toLowerCase();
  return cameronKnowledge.research.find(
    (r) =>
      r.slug === key ||
      r.project.toLowerCase() === key ||
      `research-${r.slug}` === key,
  );
}

function withNav(body: string, links: string[]): string {
  const unique = [...new Set(links.filter(Boolean))];
  if (!unique.length) return body;
  return [body, "", "**Explore on this site**", ...unique.map((l) => `• ${l}`)].join("\n");
}

function formatResearchBrief(r: CameronResearchEntry): string {
  return [
    `**${r.project}**`,
    `Domain: ${r.domain}`,
    `Role: ${r.role}`,
    `Institutions: ${joinList(r.institution)}`,
    r.award ? `Award / funding: ${r.award}` : "",
    `Technologies: ${joinList(r.technologies)}`,
    `Impact: ${joinList(r.impact)}`,
    "",
    "Overview:",
    r.description,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatResearchIndex(): string {
  const k = cameronKnowledge;
  return [
    `**Research portfolio — ${k.identity.name}**`,
    `Focus areas: ${joinList(k.identity.researchFocus)}`,
    "",
    ...k.research.map((r) =>
      [
        `**${r.project}**`,
        `Role: ${r.role}`,
        `Technologies: ${joinList(r.technologies)}`,
        `Impact: ${joinList(r.impact)}`,
        `Summary: ${r.description.split("\n\n")[0]}`,
        `Dossier: ${portfolioNav.researchProject(r.slug)}`,
        "",
      ].join("\n"),
    ),
  ].join("\n");
}

function formatComparison(projects: CameronResearchEntry[]): string {
  const [a, b, ...rest] = projects;
  if (!a || !b) return formatResearchIndex();

  const pair = [a, b, ...rest.slice(0, 1)];
  const blocks = pair.map((r) =>
    [
      `**${r.project}**`,
      `Domain: ${r.domain}`,
      `Role: ${r.role}`,
      `Problem focus: ${r.problem.slice(0, 2).join("; ")}`,
      `Technologies: ${joinList(r.technologies)}`,
      `Impact: ${joinList(r.impact)}`,
      `Institutions: ${joinList(r.institution)}`,
      `Dossier: ${portfolioNav.researchProject(r.slug)}`,
    ].join("\n"),
  );

  const contrast = [
    "**How they differ**",
    `• **${a.project}** emphasizes ${a.domain.toLowerCase()} — ${a.description.split("\n\n")[0]}`,
    `• **${b.project}** emphasizes ${b.domain.toLowerCase()} — ${b.description.split("\n\n")[0]}`,
    "",
    "Together they show Cameron’s span from field robotics / physical sensing to healthcare digital twins and embodied AI.",
  ].join("\n");

  return [
    `**Comparison — ${a.project} vs ${b.project}**`,
    "",
    blocks.join("\n\n——\n\n"),
    "",
    contrast,
  ].join("\n");
}

function formatResearchTimeline(): string {
  const researchChapters = cameronKnowledge.journey.filter((c) =>
    /ai farms|aegis|access|research|robot|nsf|prairie|cagi|graduate|future/i.test(
      `${c.id} ${c.title} ${c.summary}`,
    ),
  );

  const lines = researchChapters.map(
    (c) => `**${c.year} — ${c.title}**\n${c.summary}\n${c.description}`,
  );

  return [
    "**Research timeline**",
    "",
    "Key chapters where research, robotics, and AI work took shape:",
    "",
    ...lines,
    "",
    "**Active research threads**",
    ...cameronKnowledge.research.map(
      (r) => `• ${r.project} (${r.domain}) — ${portfolioNav.researchProject(r.slug)}`,
    ),
  ].join("\n");
}

function formatRoboticsOverview(): string {
  const research = cameronKnowledge.research.filter((r) =>
    /robot|farm|aegis|prairie|hack/i.test(
      `${r.project} ${r.domain} ${r.technologies.join(" ")}`,
    ),
  );
  const experience = cameronKnowledge.experience.filter(
    (e) =>
      /robot/i.test(e.role) ||
      e.technologies.some((t) => /robot/i.test(t)) ||
      /robot/i.test(e.responsibilities),
  );

  return [
    "**Robotics experience overview**",
    "",
    cameronKnowledge.perspective.aiRoboticsVision,
    "",
    "**Research with robotics**",
    ...research.map(
      (r) =>
        `• **${r.project}** — Role: ${r.role}. Tech: ${joinList(r.technologies)}. Impact: ${joinList(r.impact)}.`,
    ),
    "",
    "**Roles & internships**",
    ...experience.map(
      (e) =>
        `• **${e.role}** @ ${e.organization} (${e.dates}) — ${e.responsibilities}`,
    ),
    "",
    `**Robotics skills:** ${joinList(cameronKnowledge.technicalSkills.robotics)}`,
  ].join("\n");
}

function formatPerspective(hitId?: string): string {
  const p = cameronKnowledge.perspective;

  if (hitId === "perspective-why-builds") {
    return ["**Why Cameron builds**", "", p.whyCameronBuilds].join("\n");
  }
  if (hitId === "perspective-why-ai-robotics") {
    return ["**Why AI and robotics**", "", p.whyAiAndRobotics, "", "**Vision**", p.aiRoboticsVision].join(
      "\n",
    );
  }
  if (hitId === "perspective-why-tuskegee") {
    return ["**Why Tuskegee matters**", "", p.whyTuskegeeMatters].join("\n");
  }
  if (hitId === "perspective-future-interests") {
    return [
      "**Future research interests**",
      "",
      p.researchInterestsSummary,
      "",
      ...p.futureResearchInterests.map((i) => `• ${i}`),
    ].join("\n");
  }
  if (hitId === "perspective-graduate-direction") {
    return [
      "**Graduate research direction**",
      "",
      p.graduateResearchDirection,
      "",
      "**AI + robotics vision**",
      p.aiRoboticsVision,
      "",
      "**Research interests**",
      ...p.futureResearchInterests.map((i) => `• ${i}`),
    ].join("\n");
  }

  return [
    "**Perspective & direction**",
    "",
    "**Why Cameron builds**",
    p.whyCameronBuilds,
    "",
    "**Why AI and robotics**",
    p.whyAiAndRobotics,
    "",
    "**Why Tuskegee matters**",
    p.whyTuskegeeMatters,
    "",
    "**Graduate research direction**",
    p.graduateResearchDirection,
    "",
    "**Future research interests**",
    ...p.futureResearchInterests.map((i) => `• ${i}`),
  ].join("\n");
}

function formatExperienceHits(hits: ScoredHit[], forceRobotics = false): string {
  const k = cameronKnowledge;
  const roboticsFocus =
    forceRobotics ||
    hits.some(
      (h) =>
        h.text.toLowerCase().includes("robot") ||
        h.title.toLowerCase().includes("robot"),
    );
  const rows = roboticsFocus
    ? k.experience.filter(
        (e) =>
          /robot/i.test(e.role) ||
          e.technologies.some((t) => /robot/i.test(t)) ||
          /robot/i.test(e.responsibilities),
      )
    : k.experience;

  const list = (rows.length ? rows : k.experience).map((e) =>
    [
      `**${e.role}**`,
      `Organization: ${e.organization}`,
      `Dates: ${e.dates}`,
      `Impact: ${e.responsibilities}`,
      `Technologies: ${joinList(e.technologies)}`,
    ].join("\n"),
  );

  return [
    roboticsFocus ? "**Robotics-related experience**" : "**Professional experience**",
    "",
    list.join("\n\n"),
  ].join("\n");
}

function formatSkills(): string {
  const s = cameronKnowledge.technicalSkills;
  return [
    "**Technical skills**",
    "",
    `AI / research: ${joinList(s.ai)}`,
    `Languages: ${joinList(s.languages)}`,
    `Frameworks: ${joinList(s.frameworks)}`,
    `Robotics: ${joinList(s.robotics)}`,
    `Tools: ${joinList(s.tools)}`,
  ].join("\n");
}

function formatJourney(hits: ScoredHit[], query: string): string {
  const k = cameronKnowledge;
  const wantsFull =
    /journey|timeline|walk|background|story|path/i.test(query) ||
    hits.some((h) => h.category === "story");

  if (wantsFull) {
    const chapters = k.journey
      .slice(0, 8)
      .map(
        (c) =>
          `**${c.year} — ${c.title}**\n${c.summary}\n${c.description}\nThemes: ${joinList(c.technologies)}`,
      );
    return [
      "**Background & journey**",
      "",
      k.story.headline,
      "",
      k.story.legoStory,
      "",
      ...chapters,
    ].join("\n");
  }

  return hits
    .filter((h) => h.category === "journey" || h.category === "story")
    .map((h) => `**${h.title}**\n${h.text}`)
    .join("\n\n");
}

function formatAwards(): string {
  return [
    "**Awards & recognition**",
    "",
    ...cameronKnowledge.awardsAndRecognition.map(
      (a) => `• **${a.name}** (${a.category}) — ${a.description}`,
    ),
  ].join("\n");
}

function formatPublications(): string {
  return [
    "**Publications & scholarship**",
    "",
    ...cameronKnowledge.publications.map(
      (p) => `• **${p.title}** [${p.type}]\n  ${p.description}`,
    ),
  ].join("\n");
}

function formatContact(): string {
  const c = cameronKnowledge.contact;
  return [
    `**Contact — ${cameronKnowledge.identity.name}**`,
    "",
    `Email: ${c.email}`,
    `LinkedIn: ${c.linkedin}`,
    `GitHub: ${c.github}`,
  ].join("\n");
}

function formatEducation(): string {
  const e = cameronKnowledge.education;
  return [
    "**Education**",
    "",
    `University: ${e.university}`,
    `Major: ${e.major}`,
    `Expected graduation: ${e.expectedGraduation}`,
    `Location: ${e.location}`,
  ].join("\n");
}

function formatHit(hit: ScoredHit, query: string): string | null {
  if (hit.category === "perspective") return formatPerspective(hit.id);
  if (hit.category === "research") {
    const research = findResearch(
      String(hit.metadata.slug ?? hit.id.replace(/^research-/, "")),
    );
    return research ? formatResearchBrief(research) : `**${hit.title}**\n${hit.text}`;
  }
  if (hit.category === "experience") return formatExperienceHits([hit]);
  if (hit.category === "skills") return formatSkills();
  if (hit.category === "journey" || hit.category === "story") {
    return formatJourney([hit], query);
  }
  if (hit.category === "awards") return formatAwards();
  if (hit.category === "publications") return formatPublications();
  if (hit.category === "contact") return formatContact();
  if (hit.category === "education") return formatEducation();
  if (hit.category === "beyond") return `**${hit.title}**\n${hit.text}`;
  if (hit.category === "identity") {
    const i = cameronKnowledge.identity;
    return [
      `**${i.name}**`,
      i.title,
      `Focus: ${joinList(i.researchFocus)}`,
      i.statement,
    ].join("\n");
  }
  return `**${hit.title}**\n${hit.text}`;
}

function navForAnswer(query: string, sections: string[], projects: CameronResearchEntry[]): string[] {
  const q = query.toLowerCase();
  const links: string[] = [];

  for (const r of projects) {
    links.push(`${r.project} dossier → ${portfolioNav.researchProject(r.slug)}`);
  }

  if (
    q.includes("research") ||
    q.includes("project") ||
    q.includes("aegis") ||
    q.includes("farm") ||
    sections.some((s) => s.includes("Research"))
  ) {
    links.push(`All research → ${portfolioNav.research}`);
  }
  if (
    q.includes("journey") ||
    q.includes("timeline") ||
    q.includes("background") ||
    q.includes("tuskegee") ||
    q.includes("graduate")
  ) {
    links.push(`Journey timeline → ${portfolioNav.journey}`);
  }
  if (q.includes("resume") || q.includes("cv") || q.includes("hire") || q.includes("experience")) {
    links.push(`Resume → ${portfolioNav.resume}`);
  }
  if (q.includes("publication") || q.includes("poster") || q.includes("manuscript")) {
    links.push(`Publications archive → ${portfolioNav.publications}`);
  }
  if (q.includes("contact") || q.includes("email") || q.includes("connect")) {
    links.push(`Connect → ${portfolioNav.connect}`);
  }

  // Sensible defaults when answering research-heavy content
  if (!links.length) {
    links.push(`Research → ${portfolioNav.research}`, `Journey → ${portfolioNav.journey}`);
  }

  return links;
}

function gracefulFallback(question: string): string {
  return withNav(
    [
      "I don’t have a confident match for that in the local portfolio knowledge base.",
      "",
      "I can help with:",
      "• Research projects and comparisons (e.g. AI Farms vs Project AEGIS)",
      "• Robotics experience overview and research timeline",
      "• Why Cameron builds, AI/robotics vision, and graduate direction",
      "• Skills, awards, publications, and contact details",
      "",
      `Your question: “${question.trim()}”`,
      "",
      "Try rephrasing, or use one of the suggested questions.",
    ].join("\n"),
    [
      `Research → ${portfolioNav.research}`,
      `Journey → ${portfolioNav.journey}`,
      `Resume → ${portfolioNav.resume}`,
      `Publications → ${portfolioNav.publications}`,
    ],
  );
}

function emptyPromptFallback(): string {
  return [
    "Ask about Cameron’s research, experience, graduate goals, AI + robotics vision, journey, or contact details.",
    "",
    "Tip: try comparisons (“AI Farms vs Project AEGIS”) or direction questions (“graduate research goals”).",
  ].join("\n");
}

function toScoredDocuments(hits: ScoredHit[]): AskCameronScoredDocument[] {
  return hits.map((h) => ({
    id: h.id,
    category: h.category,
    title: h.title,
    text: h.text,
    score: h.score,
    metadata: h.metadata,
  }));
}

/**
 * Step: Question → Retrieval (structured).
 * Detects special modes and ranks documents for the context builder / generator.
 */
export function retrieveAskCameronKnowledge(question: string): AskCameronRetrievalResult {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      question: "",
      mode: "empty",
      intents: [],
      documents: [],
      matchedProjects: [],
    };
  }

  const q = trimmed.toLowerCase();
  const matchedProjects = matchResearchInQuery(trimmed);
  const intents = [...detectIntents(trimmed)];

  if (isComparisonQuestion(trimmed)) {
    let pair = matchedProjects;
    if (pair.length < 2) {
      const farms = findResearch("ai-farms");
      const aegis = findResearch("project-aegis");
      if (farms && aegis && (q.includes("farm") || q.includes("aegis") || q.includes("compare"))) {
        pair = [farms, aegis];
      }
    }
    if (pair.length >= 2) {
      return {
        question: trimmed,
        mode: "comparison",
        intents,
        documents: [],
        matchedProjects: pair,
        comparisonProjects: pair,
      };
    }
  }

  if (isResearchTimelineQuestion(trimmed)) {
    return {
      question: trimmed,
      mode: "research-timeline",
      intents,
      documents: [],
      matchedProjects,
    };
  }

  if (isRoboticsOverviewQuestion(trimmed)) {
    return {
      question: trimmed,
      mode: "robotics-overview",
      intents,
      documents: [],
      matchedProjects,
    };
  }

  if (
    q.includes("graduate") ||
    q.includes("phd") ||
    q.includes("future research") ||
    q.includes("research interest") ||
    q.includes("research goals") ||
    q.includes("research direction")
  ) {
    return {
      question: trimmed,
      mode: "perspective",
      intents,
      documents: [],
      matchedProjects,
      perspectiveDocId: q.includes("interest")
        ? "perspective-future-interests"
        : "perspective-graduate-direction",
    };
  }

  if (
    q.includes("why") &&
    (q.includes("build") || q.includes("ai") || q.includes("robot") || q.includes("tuskegee"))
  ) {
    let id = "perspective-why-builds";
    if (q.includes("tuskegee")) id = "perspective-why-tuskegee";
    else if (q.includes("ai") || q.includes("robot")) id = "perspective-why-ai-robotics";
    return {
      question: trimmed,
      mode: "perspective",
      intents,
      documents: [],
      matchedProjects,
      perspectiveDocId: id,
    };
  }

  const hits = retrieve(trimmed);
  const intentSet = detectIntents(trimmed);

  const asksAllResearch =
    (q.includes("research") || q.includes("projects")) &&
    matchedProjects.length === 0 &&
    !q.includes("interest") &&
    !q.includes("graduate");

  if (
    asksAllResearch &&
    (q.includes("what") || q.includes("which") || q.includes("list") || q.includes("worked"))
  ) {
    return {
      question: trimmed,
      mode: "research-index",
      intents,
      documents: toScoredDocuments(hits),
      matchedProjects: cameronKnowledge.research,
      includeExperience: intentSet.has("experience") || q.includes("robot"),
      includeSkills: intentSet.has("skills"),
    };
  }

  const top = hits[0];
  if (!top || top.score < 4) {
    return {
      question: trimmed,
      mode: "fallback",
      intents,
      documents: toScoredDocuments(hits),
      matchedProjects,
    };
  }

  return {
    question: trimmed,
    mode: "ranked",
    intents,
    documents: toScoredDocuments(hits),
    matchedProjects,
  };
}

/**
 * Step: Context/Retrieval → local Response Generator.
 * Preserves Phase 2.75 answer quality. Replaceable later by an LLM generator.
 */
export function generateLocalAskCameronAnswer(
  retrieval: AskCameronRetrievalResult,
): string {
  const trimmed = retrieval.question;

  if (retrieval.mode === "empty") return emptyPromptFallback();

  if (retrieval.mode === "comparison" && retrieval.comparisonProjects?.length) {
    const pair = retrieval.comparisonProjects;
    return withNav(formatComparison(pair), navForAnswer(trimmed, ["Research"], pair));
  }

  if (retrieval.mode === "research-timeline") {
    return withNav(
      formatResearchTimeline(),
      navForAnswer(trimmed, ["Research", "Journey"], cameronKnowledge.research),
    );
  }

  if (retrieval.mode === "robotics-overview") {
    return withNav(
      formatRoboticsOverview(),
      navForAnswer(trimmed, ["Research", "Experience"], retrieval.matchedProjects),
    );
  }

  if (retrieval.mode === "perspective") {
    return withNav(
      formatPerspective(retrieval.perspectiveDocId),
      navForAnswer(trimmed, ["Journey", "Research"], []),
    );
  }

  if (retrieval.mode === "research-index") {
    const hitsAsScored: ScoredHit[] = retrieval.documents.map((d) => ({
      ...d,
      metadata: d.metadata,
    }));
    const extras: string[] = [];
    if (retrieval.includeExperience) {
      extras.push(
        formatExperienceHits(hitsAsScored.filter((h) => h.category === "experience")),
      );
    }
    if (retrieval.includeSkills) extras.push(formatSkills());
    const body = [formatResearchIndex(), ...extras.filter(Boolean)].join("\n\n——\n\n");
    return withNav(body, navForAnswer(trimmed, ["Research"], cameronKnowledge.research));
  }

  if (retrieval.mode === "fallback") {
    return gracefulFallback(trimmed);
  }

  // ranked
  const hits: ScoredHit[] = retrieval.documents.map((d) => ({
    id: d.id,
    category: d.category,
    title: d.title,
    text: d.text,
    score: d.score,
    metadata: d.metadata,
  }));

  const sections: string[] = [];
  const used = new Set<string>();
  const projectHits: CameronResearchEntry[] = [...retrieval.matchedProjects];

  for (const hit of hits) {
    if (hit.score < 3) continue;

    let key = hit.category;
    if (hit.category === "story") key = "journey";
    if (hit.category === "research") key = hit.id;

    if (
      ["experience", "skills", "awards", "publications", "contact", "education", "journey"].includes(
        key,
      )
    ) {
      if (used.has(key)) continue;
    }
    if (used.has(key) && hit.category !== "research" && hit.category !== "perspective") continue;

    const formatted = formatHit(hit, trimmed);
    if (!formatted) continue;

    if (
      key === "experience" &&
      sections.some((s) => s.startsWith("**Robotics") || s.startsWith("**Professional"))
    ) {
      continue;
    }
    if (
      (key === "journey" || hit.category === "story") &&
      sections.some((s) => s.includes("Background & journey"))
    ) {
      continue;
    }

    if (hit.category === "research") {
      const r = findResearch(String(hit.metadata.slug ?? ""));
      if (r && !projectHits.some((p) => p.slug === r.slug)) projectHits.push(r);
    }

    used.add(key);
    sections.push(formatted);
    if (sections.length >= 4) break;
  }

  if (!sections.length) return gracefulFallback(trimmed);

  const body =
    sections.length === 1
      ? sections[0]
      : [
          "Here’s what I found across Cameron’s portfolio knowledge base:",
          "",
          sections.join("\n\n——\n\n"),
        ].join("\n");

  return withNav(body, navForAnswer(trimmed, sections, projectHits));
}

/** Back-compat — prefer `runAskCameronPipeline` from askCameronPipeline. */
export function answerFromKnowledge(question: string): string {
  return generateLocalAskCameronAnswer(retrieveAskCameronKnowledge(question));
}
