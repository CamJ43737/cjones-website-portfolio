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
import {
  categoriesForResponseIntent,
  detectResponseIntent,
  formatCareerInternshipsIntent,
  formatIdentityIntroduction,
  formatRoboticsExperienceIntent,
  formatSkillsIntent,
  generateIntentResponse,
  voiceForIntent,
  type AskCameronAnswerVoice,
  type AskCameronResponseIntent,
} from "@/components/ai/askCameronIntentResponses";

export type AskCameronRetrievalMode =
  | "empty"
  | "identity-intro"
  | "research-overview"
  | "robotics-overview"
  | "skills-overview"
  | "career-overview"
  | "future-direction"
  | "motivation-origin"
  | "education"
  | "collaboration-services"
  | "project-simple"
  | "comparison"
  | "research-timeline"
  | "perspective"
  | "research-index"
  | "ranked"
  | "fallback";

/** Internal confidence for future LLM routing (not shown in public UI). */
export type AskCameronConfidence = "high" | "medium" | "low";

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
  /** Composed response intent (Phase 3D) — bypasses single-doc keyword ranking. */
  responseIntent?: AskCameronResponseIntent;
  /** Phase 3G — internal confidence for future LLM use */
  confidence: AskCameronConfidence;
  /** Phase 3G — answer voice guidance */
  answerVoice: AskCameronAnswerVoice;
  /** For research-index mode extras */
  includeExperience?: boolean;
  includeSkills?: boolean;
};

function modeForResponseIntent(intent: AskCameronResponseIntent): AskCameronRetrievalMode {
  switch (intent) {
    case "identity-intro":
      return "identity-intro";
    case "research-overview":
      return "research-overview";
    case "robotics-experience":
      return "robotics-overview";
    case "skills":
      return "skills-overview";
    case "career-internships":
      return "career-overview";
    case "future-direction":
      return "future-direction";
    case "motivation-origin":
      return "motivation-origin";
    case "education":
      return "education";
    case "collaboration-services":
      return "collaboration-services";
    case "research-comparison":
      return "comparison";
    case "project-simple":
      return "project-simple";
    default:
      return "ranked";
  }
}

function resultBase(
  partial: Omit<AskCameronRetrievalResult, "confidence" | "answerVoice"> & {
    confidence?: AskCameronConfidence;
    answerVoice?: AskCameronAnswerVoice;
  },
): AskCameronRetrievalResult {
  const voice = partial.responseIntent
    ? voiceForIntent(partial.responseIntent)
    : partial.mode === "perspective" ||
        partial.mode === "future-direction" ||
        partial.mode === "motivation-origin" ||
        partial.mode === "identity-intro"
      ? "first-person"
      : "third-person";

  return {
    ...partial,
    confidence: partial.confidence ?? "medium",
    answerVoice: partial.answerVoice ?? voice,
  };
}

function contextDocsForIntent(intent: AskCameronResponseIntent): AskCameronScoredDocument[] {
  const all = getCameronKnowledgeDocuments();
  const wanted = new Set(categoriesForResponseIntent(intent));

  const picked = all
    .filter((d) => wanted.has(d.category) || (intent === "identity-intro" && d.category === "identity"))
    .slice(0, 8)
    .map((d) => ({
      id: d.id,
      category: d.category,
      title: d.title,
      text: d.text,
      score: 10,
      metadata: d.metadata,
    }));

  // Ensure key research projects appear in context for composed intents
  if (
    intent === "identity-intro" ||
    intent === "research-overview" ||
    intent === "robotics-experience" ||
    intent === "research-comparison" ||
    intent === "future-direction" ||
    intent === "project-simple"
  ) {
    for (const slug of ["ai-farms", "project-aegis", "access-ci"]) {
      const doc = all.find((d) => d.id === `research-${slug}`);
      if (doc && !picked.some((p) => p.id === doc.id)) {
        picked.push({
          id: doc.id,
          category: doc.category,
          title: doc.title,
          text: doc.text,
          score: 10,
          metadata: doc.metadata,
        });
      }
    }
  }

  if (intent === "future-direction" || intent === "motivation-origin") {
    for (const id of [
      "perspective-graduate-direction",
      "perspective-future-interests",
      "perspective-why-builds",
      "story",
    ]) {
      const doc = all.find((d) => d.id === id);
      if (doc && !picked.some((p) => p.id === doc.id)) {
        picked.push({
          id: doc.id,
          category: doc.category,
          title: doc.title,
          text: doc.text,
          score: 10,
          metadata: doc.metadata,
        });
      }
    }
  }

  if (intent === "collaboration-services") {
    for (const id of ["contact", "beyond-photography", "beyond-pc-building"]) {
      const doc = all.find((d) => d.id === id);
      if (doc && !picked.some((p) => p.id === doc.id)) {
        picked.push({
          id: doc.id,
          category: doc.category,
          title: doc.title,
          text: doc.text,
          score: 10,
          metadata: doc.metadata,
        });
      }
    }
  }

  return picked;
}

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
  const unique = [...new Set(links.filter(Boolean))].slice(0, 2);
  if (!unique.length) return body;
  return [body, "", ...unique.map((l) => `→ ${l}`)].join("\n");
}

function firstBlock(text: string): string {
  return (text.split(/\n\n+/)[0] ?? text).trim();
}

function firstSentence(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?[.!?])(\s|$)/);
  return match?.[1] ?? cleaned.slice(0, 160);
}

function formatResearchBrief(r: CameronResearchEntry): string {
  return [
    `**${r.project}** (${r.domain}) — Cameron’s role: ${r.role}.`,
    "",
    firstBlock(r.description),
    "",
    `Technologies: ${joinList(r.technologies)}. Impact: ${joinList(r.impact)}.`,
    r.award ? `Recognition: ${r.award}.` : "",
    "",
    "I can go deeper on architecture, role details, or related projects.",
  ]
    .filter(Boolean)
    .join("\n");
}

function formatResearchIndex(): string {
  const k = cameronKnowledge;
  const lines = k.research.map(
    (r) => `• **${r.project}** (${r.domain}) — ${r.role}. ${firstSentence(r.description)}`,
  );
  return [
    `${k.identity.name}’s research focuses on ${joinList(k.identity.researchFocus)}.`,
    "",
    ...lines,
    "",
    "I can explain any project in more detail if you’d like.",
  ].join("\n");
}

function formatComparison(projects: CameronResearchEntry[]): string {
  const [a, b] = projects;
  if (!a || !b) return formatResearchIndex();

  return [
    `${a.project} and ${b.project} highlight complementary sides of Cameron’s research.`,
    "",
    `**${a.project}** (${a.domain}) — ${a.role}. ${firstSentence(a.description)} Focus: ${a.problem.slice(0, 2).join("; ")}.`,
    `**${b.project}** (${b.domain}) — ${b.role}. ${firstSentence(b.description)} Focus: ${b.problem.slice(0, 2).join("; ")}.`,
    "",
    "Together they span field robotics / physical sensing and healthcare digital twins — embodied AI in different real-world settings.",
    "",
    "I can go deeper on either project’s technology or impact.",
  ].join("\n");
}

function formatResearchTimeline(): string {
  const researchChapters = cameronKnowledge.journey.filter((c) =>
    /ai farms|aegis|access|research|robot|nsf|prairie|cagi|graduate|future/i.test(
      `${c.id} ${c.title} ${c.summary}`,
    ),
  );

  const lines = researchChapters.slice(0, 6).map(
    (c) => `• **${c.year} — ${c.title}**: ${c.summary}`,
  );

  return [
    "Here’s a concise research timeline of where Cameron’s AI and robotics work took shape:",
    "",
    ...lines,
    "",
    `Active threads: ${cameronKnowledge.research.map((r) => r.project).join(", ")}.`,
    "",
    "I can expand any chapter or project next.",
  ].join("\n");
}

function formatRoboticsOverview(): string {
  return formatRoboticsExperienceIntent();
}

function formatPerspective(hitId?: string): string {
  const p = cameronKnowledge.perspective;

  if (hitId === "perspective-why-builds") {
    return [
      firstBlock(p.whyCameronBuilds),
      "",
      "I can also share how this led into AI, robotics, or graduate plans.",
    ].join("\n");
  }
  if (hitId === "perspective-why-ai-robotics") {
    return [
      firstBlock(p.whyAiAndRobotics),
      "",
      firstBlock(p.aiRoboticsVision),
      "",
      "Would you like to hear about the projects that grew from this?",
    ].join("\n");
  }
  if (hitId === "perspective-why-tuskegee") {
    return [
      firstBlock(p.whyTuskegeeMatters),
      "",
      "I can also share more about my research or journey into AI.",
    ].join("\n");
  }
  if (hitId === "perspective-future-interests") {
    return [
      firstBlock(p.researchInterestsSummary),
      "",
      ...p.futureResearchInterests.slice(0, 5).map((i) => `• ${i}`),
      "",
      "I can connect these interests to current projects if you’d like.",
    ].join("\n");
  }
  if (hitId === "perspective-graduate-direction") {
    return [
      firstBlock(p.graduateResearchDirection),
      "",
      firstBlock(p.aiRoboticsVision),
      "",
      "I can also outline specific research problems I’m interested in pursuing.",
    ].join("\n");
  }

  return [
    firstBlock(p.whyCameronBuilds),
    "",
    firstBlock(p.whyAiAndRobotics),
    "",
    "I can go deeper on graduate plans, Tuskegee, or specific research interests.",
  ].join("\n");
}

function formatExperienceHits(hits: ScoredHit[], forceRobotics = false): string {
  const roboticsFocus =
    forceRobotics ||
    hits.some(
      (h) =>
        h.text.toLowerCase().includes("robot") ||
        h.title.toLowerCase().includes("robot"),
    );

  if (roboticsFocus) return formatRoboticsExperienceIntent();
  return formatCareerInternshipsIntent();
}

function formatSkills(): string {
  return formatSkillsIntent();
}

function formatJourney(hits: ScoredHit[], query: string): string {
  const k = cameronKnowledge;
  const wantsFull = /journey|timeline|walk|background|story|path/i.test(query);

  if (wantsFull) {
    const chapters = k.journey
      .slice(0, 6)
      .map((c) => `• **${c.year} — ${c.title}**: ${c.summary}`);
    return [
      firstSentence(k.story.legoStory),
      "",
      ...chapters,
      "",
      "I can expand any chapter, or focus on research and robotics milestones.",
    ].join("\n");
  }

  const hit = hits.find((h) => h.category === "journey" || h.category === "story");
  if (!hit) return firstSentence(k.story.legoStory);
  return `${firstBlock(hit.text)}\n\nI can share more of the journey timeline if helpful.`;
}

function formatAwards(): string {
  const top = cameronKnowledge.awardsAndRecognition.slice(0, 6);
  return [
    "Cameron’s recognition includes:",
    "",
    ...top.map((a) => `• **${a.name}** (${a.category}) — ${firstSentence(a.description)}`),
    "",
    "I can list more awards or focus on research-related recognition.",
  ].join("\n");
}

function formatPublications(): string {
  return [
    "Selected publications and scholarship:",
    "",
    ...cameronKnowledge.publications.map(
      (p) => `• **${p.title}** [${p.type}] — ${firstSentence(p.description)}`,
    ),
    "",
    "I can summarize any item in more detail.",
  ].join("\n");
}

function formatContact(): string {
  const c = cameronKnowledge.contact;
  return [
    `Reach Cameron at ${c.email}. LinkedIn: ${c.linkedin}. GitHub: ${c.github}.`,
    "",
    "Happy to point you to research or resume details as well.",
  ].join("\n");
}

function formatEducation(): string {
  const e = cameronKnowledge.education;
  return `${cameronKnowledge.identity.name} studies ${e.major} at ${e.university} (expected graduation ${e.expectedGraduation}), based in ${e.location}.`;
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
  if (hit.category === "beyond") return `${hit.title}: ${firstBlock(hit.text)}`;
  if (hit.category === "identity") {
    return formatIdentityIntroduction();
  }
  return `${hit.title}: ${firstBlock(hit.text)}`;
}

/**
 * Selective links only (max 2). Prefer specific project pages over site-wide menus.
 * Composition layer only — does not affect retrieval.
 */
function navForAnswer(query: string, _sections: string[], projects: CameronResearchEntry[]): string[] {
  const q = query.toLowerCase();
  const links: string[] = [];

  for (const r of projects.slice(0, 2)) {
    links.push(`${r.project} → ${portfolioNav.researchProject(r.slug)}`);
  }

  if (!links.length) {
    if (q.includes("aegis") || q.includes("farm") || q.includes("access")) {
      // project names without matched entries — fall through to research hub
      links.push(`Research → ${portfolioNav.research}`);
    } else if (q.includes("publication") || q.includes("poster") || q.includes("manuscript")) {
      links.push(`Publications → ${portfolioNav.publications}`);
    } else if (q.includes("contact") || q.includes("email") || q.includes("connect")) {
      links.push(`Connect → ${portfolioNav.connect}`);
    } else if (q.includes("resume") || q.includes("cv")) {
      links.push(`Resume → ${portfolioNav.resume}`);
    } else if (q.includes("journey") || q.includes("timeline")) {
      links.push(`Journey → ${portfolioNav.journey}`);
    }
  }

  return [...new Set(links)].slice(0, 2);
}

function gracefulFallback(question: string): string {
  return [
    "I can help with Cameron’s research, projects, experience, skills, journey, awards, publications, or future goals.",
    "",
    "Try asking something like “Who is Cameron?”, “Explain Project AEGIS in simple terms”, or “What robotics experience does Cameron have?”",
    "",
    `Your question: “${question.trim()}”`,
  ].join("\n");
}

function emptyPromptFallback(): string {
  return [
    "I can help with Cameron’s research, projects, experience, skills, journey, awards, publications, or future goals.",
    "",
    "Try asking: “Who is Cameron?”, “What research does Cameron do?”, or “How can I contact Cameron?”",
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
    return resultBase({
      question: "",
      mode: "empty",
      intents: [],
      documents: [],
      matchedProjects: [],
      confidence: "low",
      answerVoice: "third-person",
    });
  }

  const q = trimmed.toLowerCase();
  const matchedProjects = matchResearchInQuery(trimmed);
  const intents = [...detectIntents(trimmed)];

  // Phase 3D/3F/3G — intent-aware composed answers (before keyword doc ranking)
  const responseIntent = detectResponseIntent(trimmed);
  if (responseIntent) {
    const intentCats = categoriesForResponseIntent(responseIntent);
    return resultBase({
      question: trimmed,
      mode: modeForResponseIntent(responseIntent),
      intents: [...new Set([...intents, ...intentCats, responseIntent])],
      documents: contextDocsForIntent(responseIntent),
      matchedProjects:
        responseIntent === "research-overview" ||
        responseIntent === "identity-intro" ||
        responseIntent === "robotics-experience" ||
        responseIntent === "research-comparison" ||
        responseIntent === "project-simple"
          ? cameronKnowledge.research.filter((r) =>
              ["ai-farms", "project-aegis", "access-ci", "prairie-view-robotics"].includes(
                r.slug,
              ),
            )
          : matchedProjects,
      responseIntent,
      confidence: "high",
    });
  }

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
      return resultBase({
        question: trimmed,
        mode: "comparison",
        intents,
        documents: [],
        matchedProjects: pair,
        comparisonProjects: pair,
        confidence: "high",
      });
    }
  }

  if (isResearchTimelineQuestion(trimmed)) {
    return resultBase({
      question: trimmed,
      mode: "research-timeline",
      intents,
      documents: [],
      matchedProjects,
      confidence: "high",
    });
  }

  if (isRoboticsOverviewQuestion(trimmed)) {
    return resultBase({
      question: trimmed,
      mode: "robotics-overview",
      intents,
      documents: [],
      matchedProjects,
      confidence: "high",
    });
  }

  if (
    q.includes("graduate") ||
    q.includes("phd") ||
    q.includes("future research") ||
    q.includes("research interest") ||
    q.includes("research goals") ||
    q.includes("research direction")
  ) {
    return resultBase({
      question: trimmed,
      mode: "perspective",
      intents,
      documents: [],
      matchedProjects,
      perspectiveDocId: q.includes("interest")
        ? "perspective-future-interests"
        : "perspective-graduate-direction",
      confidence: "medium",
      answerVoice: "first-person",
    });
  }

  if (
    q.includes("why") &&
    (q.includes("build") || q.includes("ai") || q.includes("robot") || q.includes("tuskegee"))
  ) {
    let id = "perspective-why-builds";
    if (q.includes("tuskegee")) id = "perspective-why-tuskegee";
    else if (q.includes("ai") || q.includes("robot")) id = "perspective-why-ai-robotics";
    return resultBase({
      question: trimmed,
      mode: "perspective",
      intents,
      documents: [],
      matchedProjects,
      perspectiveDocId: id,
      confidence: "medium",
      answerVoice: "first-person",
    });
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
    return resultBase({
      question: trimmed,
      mode: "research-index",
      intents,
      documents: toScoredDocuments(hits),
      matchedProjects: cameronKnowledge.research,
      includeExperience: intentSet.has("experience") || q.includes("robot"),
      includeSkills: intentSet.has("skills"),
      confidence: "medium",
    });
  }

  const top = hits[0];
  if (!top || top.score < 4) {
    return resultBase({
      question: trimmed,
      mode: "fallback",
      intents,
      documents: toScoredDocuments(hits),
      matchedProjects,
      confidence: "low",
    });
  }

  return resultBase({
    question: trimmed,
    mode: "ranked",
    intents,
    documents: toScoredDocuments(hits),
    matchedProjects,
    confidence: top.score >= 10 ? "high" : "medium",
  });
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

  // Phase 3D/3F — composed intent responses
  if (retrieval.responseIntent) {
    return generateIntentResponse(retrieval.responseIntent, trimmed);
  }

  if (retrieval.mode === "comparison" && retrieval.comparisonProjects?.length) {
    const pair = retrieval.comparisonProjects;
    return withNav(
      formatComparison(pair),
      pair.slice(0, 2).map((p) => `${p.project} → ${portfolioNav.researchProject(p.slug)}`),
    );
  }

  if (retrieval.mode === "research-timeline") {
    return formatResearchTimeline();
  }

  if (retrieval.mode === "robotics-overview") {
    // Intent composer already includes selective links + follow-up
    return formatRoboticsOverview();
  }

  if (retrieval.mode === "perspective") {
    return formatPerspective(retrieval.perspectiveDocId);
  }

  if (retrieval.mode === "research-index") {
    // Keep the index concise — extras tend to re-dump the portfolio
    return withNav(formatResearchIndex(), [`Research → ${portfolioNav.research}`]);
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
    if (sections.length >= 2) break;
  }

  if (!sections.length) return gracefulFallback(trimmed);

  const body =
    sections.length === 1
      ? sections[0]
      : sections.join("\n\n");

  const followUp =
    sections.length === 1
      ? body
      : `${body}\n\nI can go deeper on any of these if you’d like.`;

  return withNav(followUp, navForAnswer(trimmed, sections, projectHits));
}

/** Back-compat — prefer `runAskCameronPipeline` from askCameronPipeline. */
export function answerFromKnowledge(question: string): string {
  return generateLocalAskCameronAnswer(retrieveAskCameronKnowledge(question));
}
