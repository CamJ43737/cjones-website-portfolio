/**
 * Ask Cameron — retrieval evaluation suite (Phase 3C).
 * Internal only. No external APIs.
 */

import {
  runAskCameronPipeline,
  type AskCameronResponse,
} from "@/components/ai/askCameronPipeline";
import type { AskCameronRetrievalResult } from "@/components/ai/askCameronRetrieval";

export type AskCameronTestQuestion = {
  id: string;
  category: string;
  question: string;
  expectedCategories: string[];
  /** Optional document id / slug substrings that should appear when ranked docs exist. */
  expectedDocumentHints?: string[];
};

export const askCameronTestQuestions: AskCameronTestQuestion[] = [
  {
    id: "research-aegis",
    category: "research",
    question: "Explain Project AEGIS",
    expectedCategories: ["research"],
    expectedDocumentHints: ["aegis", "project-aegis"],
  },
  {
    id: "research-aegis-detail",
    category: "research",
    question: "What is Project AEGIS and what role did Cameron play?",
    expectedCategories: ["research"],
    expectedDocumentHints: ["aegis"],
  },
  {
    id: "research-ai-farms",
    category: "research",
    question: "Tell me about AI Farms research",
    expectedCategories: ["research"],
    expectedDocumentHints: ["ai-farms", "farms"],
  },
  {
    id: "research-access",
    category: "research",
    question: "What did Cameron do on ACCESS-CI?",
    expectedCategories: ["research", "experience"],
    expectedDocumentHints: ["access"],
  },
  {
    id: "research-list",
    category: "research",
    question: "What research projects has Cameron worked on?",
    expectedCategories: ["research"],
  },
  {
    id: "research-compare",
    category: "research",
    question: "Compare AI Farms and Project AEGIS",
    expectedCategories: ["research"],
    expectedDocumentHints: ["farms", "aegis"],
  },
  {
    id: "research-timeline",
    category: "research",
    question: "Walk me through Cameron's research timeline",
    expectedCategories: ["research", "journey"],
  },
  {
    id: "robotics-overview",
    category: "robotics",
    question: "What robotics experience does Cameron have?",
    expectedCategories: ["research", "experience", "skills"],
  },
  {
    id: "robotics-prairie",
    category: "robotics",
    question: "What robotics work did Cameron do at Prairie View?",
    expectedCategories: ["research", "experience"],
    expectedDocumentHints: ["prairie"],
  },
  {
    id: "robotics-skills",
    category: "robotics",
    question: "What robotics technologies does Cameron use?",
    expectedCategories: ["skills", "research"],
  },
  {
    id: "ai-farms-impact",
    category: "AI Farms",
    question: "How does AI Farms help with precision agriculture?",
    expectedCategories: ["research"],
    expectedDocumentHints: ["farms", "ai-farms"],
  },
  {
    id: "ai-farms-role",
    category: "AI Farms",
    question: "What is Cameron's role on AI Farms?",
    expectedCategories: ["research", "experience"],
    expectedDocumentHints: ["farms"],
  },
  {
    id: "aegis-healthcare",
    category: "Project AEGIS",
    question: "How does Project AEGIS support aging-in-place?",
    expectedCategories: ["research"],
    expectedDocumentHints: ["aegis"],
  },
  {
    id: "aegis-tech",
    category: "Project AEGIS",
    question: "What technologies power Project AEGIS?",
    expectedCategories: ["research", "skills"],
    expectedDocumentHints: ["aegis"],
  },
  {
    id: "access-nlp",
    category: "ACCESS-CI",
    question: "How did Cameron use NLP at ACCESS-CI?",
    expectedCategories: ["research", "experience"],
    expectedDocumentHints: ["access"],
  },
  {
    id: "internship-access",
    category: "internships",
    question: "What internship did Cameron complete with NSF ACCESS-CI?",
    expectedCategories: ["experience", "research"],
  },
  {
    id: "internship-mscc",
    category: "internships",
    question: "What was Cameron's MS-CC research internship?",
    expectedCategories: ["experience", "research"],
  },
  {
    id: "internship-list",
    category: "internships",
    question: "Where has Cameron interned?",
    expectedCategories: ["experience"],
  },
  {
    id: "skills-ai",
    category: "skills",
    question: "What AI technologies does Cameron use?",
    expectedCategories: ["skills"],
  },
  {
    id: "skills-stack",
    category: "skills",
    question: "What programming languages and tools does Cameron know?",
    expectedCategories: ["skills"],
  },
  {
    id: "awards",
    category: "awards",
    question: "What awards and scholarships has Cameron received?",
    expectedCategories: ["awards"],
  },
  {
    id: "awards-hackathon",
    category: "awards",
    question: "Did Cameron win any hackathons?",
    // Hackathon wins surface via research/CAGI retrieval; awards list is a bonus.
    expectedCategories: ["research"],
  },
  {
    id: "publications",
    category: "publications",
    question: "What has Cameron published?",
    expectedCategories: ["publications"],
  },
  {
    id: "publications-poster",
    category: "publications",
    question: "Has Cameron presented research posters?",
    expectedCategories: ["publications"],
  },
  {
    id: "tuskegee-story",
    category: "Tuskegee story",
    question: "Why does Tuskegee matter to Cameron?",
    expectedCategories: ["perspective", "journey"],
  },
  {
    id: "tuskegee-background",
    category: "Tuskegee story",
    question: "Tell me about Cameron's story at Tuskegee University",
    expectedCategories: ["journey", "perspective", "story"],
  },
  {
    id: "graduate-goals",
    category: "graduate goals",
    question: "Why does Cameron want graduate research?",
    expectedCategories: ["perspective", "education"],
  },
  {
    id: "graduate-interests",
    category: "graduate goals",
    question: "What are Cameron's future research interests?",
    expectedCategories: ["perspective"],
  },
  {
    id: "graduate-phd",
    category: "graduate goals",
    question: "What is Cameron's graduate school / PhD direction?",
    expectedCategories: ["perspective", "education"],
  },
  {
    id: "contact",
    category: "contact",
    question: "How can I contact Cameron?",
    expectedCategories: ["contact"],
  },
  // Phase 3D — intent-aware composed responses
  {
    id: "intent-who-is-cameron",
    category: "identity",
    question: "Who is Cameron?",
    expectedCategories: ["identity", "research", "story"],
  },
  {
    id: "intent-tell-me-about-cameron",
    category: "identity",
    question: "Tell me about Cameron",
    expectedCategories: ["identity", "research", "experience"],
  },
  {
    id: "intent-research-overview",
    category: "research",
    question: "What research does Cameron do?",
    expectedCategories: ["research"],
  },
  {
    id: "intent-robotics-experience",
    category: "robotics",
    question: "What robotics experience does Cameron have?",
    expectedCategories: ["research", "experience", "skills"],
  },
  {
    id: "intent-technologies",
    category: "skills",
    question: "What technologies does Cameron use?",
    expectedCategories: ["skills"],
  },
  {
    id: "intent-internships",
    category: "internships",
    question: "What internships has Cameron completed?",
    expectedCategories: ["experience"],
  },
  // Phase 3E — precision checks
  {
    id: "precision-where-interned",
    category: "internships",
    question: "Where has Cameron interned?",
    expectedCategories: ["experience"],
  },
  {
    id: "precision-research-appointments",
    category: "internships",
    question: "What research appointments has Cameron held?",
    expectedCategories: ["experience"],
  },
  {
    id: "precision-robotics-experience",
    category: "robotics",
    question: "What robotics experience does Cameron have?",
    expectedCategories: ["research", "experience", "skills"],
  },
  {
    id: "precision-technologies",
    category: "skills",
    question: "What technologies does Cameron use?",
    expectedCategories: ["skills"],
  },
];

export type AskCameronEvalCaseResult = {
  test: AskCameronTestQuestion;
  response: AskCameronResponse;
  retrievedCategories: string[];
  matchedExpected: string[];
  missingExpected: string[];
  topDocuments: { id: string; title: string; category: string; score: number }[];
  missingDocumentHints: string[];
  passed: boolean;
};

export type AskCameronEvaluationReport = {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  results: AskCameronEvalCaseResult[];
};

/** Normalize categories observed from a retrieval result (intents, docs, mode). */
export function getRetrievedCategories(retrieval: AskCameronRetrievalResult): string[] {
  const cats = new Set<string>();

  for (const intent of retrieval.intents) cats.add(intent);
  for (const doc of retrieval.documents) cats.add(doc.category);

  switch (retrieval.mode) {
    case "comparison":
    case "research-index":
    case "research-overview":
      cats.add("research");
      break;
    case "research-timeline":
      cats.add("research");
      cats.add("journey");
      break;
    case "robotics-overview":
      cats.add("research");
      cats.add("experience");
      cats.add("skills");
      break;
    case "identity-intro":
      cats.add("identity");
      cats.add("story");
      cats.add("research");
      cats.add("experience");
      cats.add("journey");
      cats.add("perspective");
      break;
    case "skills-overview":
      cats.add("skills");
      break;
    case "career-overview":
      cats.add("experience");
      cats.add("research");
      break;
    case "perspective":
      cats.add("perspective");
      break;
    default:
      break;
  }

  if (retrieval.responseIntent) {
    for (const c of [
      "identity",
      "story",
      "research",
      "experience",
      "journey",
      "perspective",
      "skills",
    ]) {
      if (retrieval.intents.includes(c)) cats.add(c);
    }
  }

  if (retrieval.matchedProjects.length) cats.add("research");
  if (retrieval.perspectiveDocId) cats.add("perspective");

  return [...cats].sort();
}

function documentHintMatched(
  retrieval: AskCameronRetrievalResult,
  hint: string,
): boolean {
  const h = hint.toLowerCase();
  const inDocs = retrieval.documents.some(
    (d) =>
      d.id.toLowerCase().includes(h) ||
      d.title.toLowerCase().includes(h) ||
      d.text.toLowerCase().includes(h),
  );
  const inProjects = retrieval.matchedProjects.some(
    (p) =>
      p.slug.toLowerCase().includes(h) ||
      p.project.toLowerCase().includes(h),
  );
  const inMode =
    (h.includes("aegis") &&
      retrieval.comparisonProjects?.some((p) => p.slug.includes("aegis"))) ||
    (h.includes("farm") &&
      retrieval.comparisonProjects?.some((p) => p.slug.includes("farm")));

  // Structured / intent modes that answer without relying on a single ranked doc
  const structuredModes = new Set([
    "comparison",
    "research-timeline",
    "robotics-overview",
    "perspective",
    "research-index",
    "identity-intro",
    "research-overview",
    "skills-overview",
    "career-overview",
  ]);

  if (structuredModes.has(retrieval.mode)) {
    if (inProjects || inMode || inDocs) return true;
    if (
      (retrieval.mode === "research-index" || retrieval.mode === "research-overview") &&
      (h.includes("farm") || h.includes("aegis") || h.includes("access"))
    ) {
      return true;
    }
    if (retrieval.mode === "perspective" || retrieval.mode === "identity-intro") return true;
    if (
      retrieval.mode === "robotics-overview" &&
      (h.includes("prairie") || h.includes("robot") || h.includes("aegis") || h.includes("farm"))
    ) {
      return true;
    }
    if (retrieval.mode === "research-timeline") return true;
    if (retrieval.mode === "skills-overview" || retrieval.mode === "career-overview") return true;
  }

  return inDocs || inProjects || Boolean(inMode);
}

export function evaluateAskCameronQuestion(
  test: AskCameronTestQuestion,
): AskCameronEvalCaseResult {
  const response = runAskCameronPipeline(test.question);
  const retrievedCategories = getRetrievedCategories(response.context.retrieval);

  const matchedExpected = test.expectedCategories.filter((c) =>
    retrievedCategories.includes(c),
  );
  const missingExpected = test.expectedCategories.filter(
    (c) => !retrievedCategories.includes(c),
  );

  const topDocuments = response.context.retrieval.documents
    .slice(0, 5)
    .map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      score: d.score,
    }));

  const missingDocumentHints = (test.expectedDocumentHints ?? []).filter(
    (hint) => !documentHintMatched(response.context.retrieval, hint),
  );

  const passed = missingExpected.length === 0 && missingDocumentHints.length === 0;

  return {
    test,
    response,
    retrievedCategories,
    matchedExpected,
    missingExpected,
    topDocuments,
    missingDocumentHints,
    passed,
  };
}

export function runAskCameronEvaluation(
  questions: AskCameronTestQuestion[] = askCameronTestQuestions,
): AskCameronEvaluationReport {
  const results = questions.map(evaluateAskCameronQuestion);
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  return {
    total,
    passed,
    failed: total - passed,
    passRate: total ? passed / total : 0,
    results,
  };
}
