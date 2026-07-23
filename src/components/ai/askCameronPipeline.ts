/**
 * Ask Cameron pipeline (Phase 3A) — architecture ready for LLM swap.
 *
 * Flow:
 *   Question → Retrieval → Context → Response Generator
 *
 * Today the generator is local (`generateLocalAskCameronAnswer`).
 * Later, `generateAskCameronAnswer` can call an LLM with the same context shape.
 *
 * No API keys. No external services in this phase.
 */

import {
  getAskCameronSystemPrompt,
  askCameronAssistantName,
} from "@/data/askCameronSystemPrompt";
import {
  SUGGESTED_QUESTIONS,
  retrieveAskCameronKnowledge,
  generateLocalAskCameronAnswer,
  type AskCameronConfidence,
  type AskCameronRetrievalResult,
} from "@/components/ai/askCameronRetrieval";
import {
  cameronKnowledge,
} from "@/data/cameronKnowledge";
import {
  createEmptyConversationState,
  refineFollowUpFromAnswer,
  resolveFollowUp,
  updateConversationState,
  type AskCameronConversationState,
} from "@/components/ai/askCameronConversation";

export { SUGGESTED_QUESTIONS, createEmptyConversationState };
export type { AskCameronConfidence, AskCameronConversationState };

/** Which backend produced the answer. */
export type AskCameronGeneratorKind = "local" | "llm";

export type AskCameronQuestion = {
  text: string;
};

export type AskCameronContext = {
  question: string;
  /** Original user text before follow-up resolution (if any). */
  originalQuestion: string;
  /** True when a short follow-up was rewritten using conversation state. */
  resolvedFromFollowUp: boolean;
  systemPrompt: string;
  assistantName: string;
  retrieval: AskCameronRetrievalResult;
  /**
   * Flattened retrieval text for a future LLM user/system augmentation.
   * Local generator may ignore this and use structured `retrieval` instead.
   */
  contextBlock: string;
  /** Phase 3G — internal confidence (not shown in public UI). */
  confidence: AskCameronConfidence;
};

export type AskCameronResponse = {
  answer: string;
  context: AskCameronContext;
  generator: AskCameronGeneratorKind;
  /** Phase 3G — mirror of retrieval confidence for future LLM routing. */
  confidence: AskCameronConfidence;
  /** Lightweight continuity memory for the next turn. */
  conversation: AskCameronConversationState;
};

export type AskCameronPipelineOptions = {
  conversation?: AskCameronConversationState;
};

function buildContextBlock(retrieval: AskCameronRetrievalResult): string {
  if (retrieval.mode === "empty") {
    return "(No question provided.)";
  }

  const parts: string[] = [
    `Retrieval mode: ${retrieval.mode}`,
    `Confidence: ${retrieval.confidence}`,
    `Answer voice: ${retrieval.answerVoice}`,
    `Intents: ${retrieval.intents.join(", ") || "none"}`,
  ];

  if (retrieval.matchedProjects.length) {
    parts.push(
      "Matched projects:",
      ...retrieval.matchedProjects.map(
        (p) => `- ${p.project} (${p.slug}) — ${p.domain}`,
      ),
    );
  }

  if (retrieval.documents.length) {
    parts.push("", "Retrieved documents:");
    for (const doc of retrieval.documents) {
      parts.push(
        "",
        `### [${doc.category}] ${doc.title} (score=${doc.score.toFixed(1)})`,
        doc.text,
      );
    }
  } else if (retrieval.mode !== "fallback") {
    parts.push("", "(Structured mode with no ranked document list — generator uses mode handlers.)");
  }

  return parts.join("\n");
}

/** Step 1–2: Question → Retrieval */
export function retrieveForQuestion(question: string): AskCameronRetrievalResult {
  return retrieveAskCameronKnowledge(question);
}

/** Step 3: Retrieval → Context (includes system prompt) */
export function buildAskCameronContext(
  question: string,
  retrieval: AskCameronRetrievalResult,
  options?: {
    originalQuestion?: string;
    resolvedFromFollowUp?: boolean;
  },
): AskCameronContext {
  return {
    question: question.trim(),
    originalQuestion: (options?.originalQuestion ?? question).trim(),
    resolvedFromFollowUp: Boolean(options?.resolvedFromFollowUp),
    systemPrompt: getAskCameronSystemPrompt(),
    assistantName: askCameronAssistantName,
    retrieval,
    contextBlock: buildContextBlock(retrieval),
    confidence: retrieval.confidence,
  };
}

/**
 * Step 4: Context → Response (local generator).
 * Swap this implementation later for an LLM call using `context.systemPrompt` + `context.contextBlock`.
 * Future LLM routing can branch on `context.confidence` (high/medium/low).
 */
export function generateAskCameronAnswer(
  context: AskCameronContext,
  conversation: AskCameronConversationState = createEmptyConversationState(),
): AskCameronResponse {
  const answer = generateLocalAskCameronAnswer(context.retrieval);
  const next = refineFollowUpFromAnswer(
    updateConversationState(conversation, context.question, context.retrieval),
    answer,
  );
  return {
    answer,
    context,
    generator: "local",
    confidence: context.confidence,
    conversation: next,
  };
}

/**
 * Clarification reply when a follow-up is ambiguous across multiple offered topics.
 * Keeps the multi-choice offer active for the next turn.
 */
function buildClarifyResponse(
  original: string,
  answer: string,
  prior: AskCameronConversationState,
  offeredSlugs: string[],
): AskCameronResponse {
  const projects = offeredSlugs
    .map((slug) => cameronKnowledge.research.find((r) => r.slug === slug))
    .filter(Boolean) as NonNullable<(typeof cameronKnowledge.research)[number]>[];

  const retrieval: AskCameronRetrievalResult = {
    question: original,
    mode: "fallback",
    intents: ["clarify", "research"],
    documents: [],
    matchedProjects: projects,
    confidence: "high",
    answerVoice: "third-person",
  };

  const context = buildAskCameronContext(original, retrieval, {
    originalQuestion: original,
    resolvedFromFollowUp: true,
  });

  return {
    answer,
    context,
    generator: "local",
    confidence: "high",
    conversation: {
      ...prior,
      lastIntent: "clarify-choice",
      lastSuggestedFollowUp: { kind: "choose-project", slugs: offeredSlugs },
      lastDiscussedTopic: "comparison",
      lastMatchedProjectSlugs: offeredSlugs,
      lastQuestion: original,
    },
  };
}

/**
 * Full pipeline entry point used by the UI.
 * Optional `conversation` enables follow-up resolution (“please do”, “tell me more”, …).
 */
export function runAskCameronPipeline(
  question: string,
  options: AskCameronPipelineOptions = {},
): AskCameronResponse {
  const prior = options.conversation ?? createEmptyConversationState();
  const original = question.trim();
  const resolution = resolveFollowUp(original, prior);

  if (resolution?.type === "clarify") {
    return buildClarifyResponse(
      original,
      resolution.answer,
      prior,
      resolution.offeredSlugs,
    );
  }

  const effective = resolution?.type === "question" ? resolution.question : original;

  const retrieval = retrieveForQuestion(effective);
  const context = buildAskCameronContext(effective, retrieval, {
    originalQuestion: original,
    resolvedFromFollowUp: resolution?.type === "question",
  });
  return generateAskCameronAnswer(context, prior);
}

/** Back-compat helper — same string answers as Phase 2.75. */
export function answerFromKnowledge(question: string): string {
  return runAskCameronPipeline(question).answer;
}

/**
 * Placeholder for a future LLM generator.
 * Not connected — throws if called so we never silently skip the local path.
 */
export async function generateAskCameronAnswerWithLLM(
  _context: AskCameronContext,
): Promise<AskCameronResponse> {
  throw new Error(
    "LLM generator is not connected yet (Phase 3A). Use generateAskCameronAnswer / runAskCameronPipeline.",
  );
}
