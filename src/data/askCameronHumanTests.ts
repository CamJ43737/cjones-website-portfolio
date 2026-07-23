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
  priorTurns?: string[];
  expectAnswerIncludes?: string[];
  expectAnswerExcludes?: string[];
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
  // Timeline chapter expansion
  {
    id: "human-expand-2018",
    category: "timeline chapter",
    question: "expand chapter 2018",
    expectedCategories: ["journey"],
    expectedDocumentHints: ["2018", "building"],
  },
  {
    id: "human-expand-2022-farms",
    category: "timeline chapter",
    question: "tell me more about 2022 AI Farms",
    expectedCategories: ["journey"],
    expectedDocumentHints: ["ai-farms", "farms"],
  },
  {
    id: "human-explain-2025",
    category: "timeline chapter",
    question: "explain 2025",
    expectedCategories: ["journey"],
    expectedDocumentHints: ["2025", "access"],
  },
  {
    id: "human-access-happened",
    category: "timeline chapter",
    question: "what happened during ACCESS-CI",
    expectedCategories: ["journey"],
    expectedDocumentHints: ["access"],
  },
  // Beyond the Lab / hobbies (Phase 4A)
  {
    id: "human-hobbies-fun",
    category: "hobbies",
    question: "What does Cameron do for fun?",
    expectedCategories: ["beyond"],
    expectedDocumentHints: ["beyond", "fishing", "photo"],
    expectAnswerIncludes: ["PC Building", "Photography", "Fishing"],
    expectAnswerExcludes: ["LEGO", "research timeline", "2018 —"],
  },
  {
    id: "human-hobbies-list",
    category: "hobbies",
    question: "What are Cameron's hobbies?",
    expectedCategories: ["beyond"],
    expectAnswerIncludes: ["PC Building", "Photography", "Fishing"],
  },
  {
    id: "human-hobbies-outside-research",
    category: "hobbies",
    question: "What does he like outside research?",
    expectedCategories: ["beyond"],
    expectAnswerIncludes: ["PC Building", "Photography", "Fishing"],
  },
  {
    id: "human-hobbies-fishing",
    category: "hobbies",
    question: "Does Cameron like fishing?",
    expectedCategories: ["beyond"],
    expectAnswerIncludes: ["Fishing", "patience", "Yes"],
    expectAnswerExcludes: ["LEGO", "research timeline", "2018 —"],
  },
  {
    id: "human-hobbies-outside-lab",
    category: "hobbies",
    question: "Tell me about Cameron outside the lab",
    expectedCategories: ["beyond"],
    expectAnswerIncludes: ["PC Building", "Photography", "Fishing"],
  },
  {
    id: "human-hobbies-what-else",
    category: "hobbies",
    priorTurns: ["What does Cameron do for fun?"],
    question: "what else does he do?",
    expectedCategories: ["beyond"],
    expectAnswerIncludes: ["PC Building", "Photography", "Fishing"],
    expectAnswerExcludes: ["I don't have", "Try asking"],
  },
  // Ambiguous multi-topic follow-ups (conversation continuity)
  {
    id: "human-compare-please-do-clarify",
    category: "conversation",
    priorTurns: ["Compare AI Farms and Project AEGIS"],
    question: "please do",
    expectedCategories: ["clarify", "research"],
    expectAnswerIncludes: ["AI Farms", "Project AEGIS", "Would you like"],
    expectAnswerExcludes: ["Technologies:", "Domain:"],
  },
  {
    id: "human-compare-tell-me-more-clarify",
    category: "conversation",
    priorTurns: ["Compare AI Farms and Project AEGIS"],
    question: "tell me more",
    expectedCategories: ["clarify", "research"],
    expectAnswerIncludes: ["AI Farms", "Project AEGIS"],
  },
  {
    id: "human-compare-please-do-then-pick",
    category: "conversation",
    priorTurns: ["Compare AI Farms and Project AEGIS", "please do"],
    question: "Project AEGIS",
    expectedCategories: ["research"],
    expectedDocumentHints: ["aegis"],
    expectAnswerIncludes: ["AEGIS"],
  },
  {
    id: "human-single-farms-please-do",
    category: "conversation",
    priorTurns: ["Tell me about AI Farms"],
    question: "please do",
    expectedCategories: ["research"],
    expectedDocumentHints: ["farms", "ai-farms"],
    expectAnswerIncludes: ["AI Farms"],
    expectAnswerExcludes: ["Would you like to go deeper into AI Farms or"],
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
