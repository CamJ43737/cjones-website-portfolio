/**
 * Ask Cameron — human QA suite (Phase 3G).
 * Realistic visitor questions for voice/precision review. Local only.
 */

export type AskCameronHumanTestCase = {
  id: string;
  category: string;
  question: string;
  expectedCategories: string[];
  expectedDocumentHints?: string[];
};

/**
 * Human-facing QA cases. Integrated into `runAskCameronEvaluation()` alongside
 * the automated intent suite — does not replace the existing automated cases.
 */
export const askCameronHumanTests: AskCameronHumanTestCase[] = [
  // Recruiter
  {
    id: "human-hire",
    category: "recruiter",
    question: "Why should someone hire Cameron?",
    expectedCategories: ["identity", "research", "experience"],
  },
  {
    id: "human-different",
    category: "recruiter",
    question: "What makes Cameron different from other computer science students?",
    expectedCategories: ["identity", "story", "research"],
  },
  {
    id: "human-industry",
    category: "recruiter",
    question: "What industry experience does Cameron have?",
    expectedCategories: ["experience"],
  },
  {
    id: "human-software-projects",
    category: "recruiter",
    question: "What software projects has Cameron built?",
    expectedCategories: ["research"],
  },
  // Graduate research
  {
    id: "human-research-problems",
    category: "graduate research",
    question: "What research problems is Cameron interested in?",
    expectedCategories: ["perspective"],
  },
  {
    id: "human-why-grad-school",
    category: "graduate research",
    question: "Why should Cameron pursue graduate school?",
    expectedCategories: ["perspective"],
  },
  {
    id: "human-phd-areas",
    category: "graduate research",
    question: "What areas does Cameron want to research in a PhD?",
    expectedCategories: ["perspective", "education"],
  },
  {
    id: "human-datasets-models",
    category: "graduate research",
    question: "What datasets or models has Cameron worked with?",
    expectedCategories: ["skills", "research"],
  },
  // Research
  {
    id: "human-aifarms-simple",
    category: "research",
    question: "Explain AI Farms in simple terms",
    expectedCategories: ["research"],
    expectedDocumentHints: ["farms", "ai-farms"],
  },
  {
    id: "human-aegis-simple",
    category: "research",
    question: "Explain Project AEGIS to a non-technical person",
    expectedCategories: ["research"],
    expectedDocumentHints: ["aegis"],
  },
  {
    id: "human-ag-health-connect",
    category: "research",
    question: "How do agriculture AI and healthcare AI connect?",
    expectedCategories: ["research"],
  },
  {
    id: "human-research-philosophy",
    category: "research",
    question: "What is Cameron's research philosophy?",
    expectedCategories: ["perspective", "story"],
  },
  // Personal story
  {
    id: "human-interested-tech",
    category: "personal story",
    question: "How did Cameron get interested in technology?",
    expectedCategories: ["perspective", "story"],
  },
  {
    id: "human-never-stopped",
    category: "personal story",
    question: 'Why does Cameron say "Never stopped building"?',
    expectedCategories: ["perspective", "story"],
  },
  {
    id: "human-building-means",
    category: "personal story",
    question: "What does building mean to Cameron?",
    expectedCategories: ["perspective", "story"],
  },
  // Collaboration
  {
    id: "human-can-websites",
    category: "collaboration",
    question: "Can Cameron build websites?",
    expectedCategories: ["contact", "beyond"],
  },
  {
    id: "human-can-collab-research",
    category: "collaboration",
    question: "Can Cameron collaborate on research?",
    expectedCategories: ["contact", "beyond"],
  },
  {
    id: "human-contact",
    category: "collaboration",
    question: "How can someone contact Cameron?",
    expectedCategories: ["contact"],
  },
];

export const askCameronHumanTestQuestions = askCameronHumanTests.map((t) => t.question);
