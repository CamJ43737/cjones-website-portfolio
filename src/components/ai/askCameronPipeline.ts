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
  type AskCameronRetrievalResult,
} from "@/components/ai/askCameronRetrieval";

export { SUGGESTED_QUESTIONS };

/** Which backend produced the answer. */
export type AskCameronGeneratorKind = "local" | "llm";

export type AskCameronQuestion = {
  text: string;
};

export type AskCameronContext = {
  question: string;
  systemPrompt: string;
  assistantName: string;
  retrieval: AskCameronRetrievalResult;
  /**
   * Flattened retrieval text for a future LLM user/system augmentation.
   * Local generator may ignore this and use structured `retrieval` instead.
   */
  contextBlock: string;
};

export type AskCameronResponse = {
  answer: string;
  context: AskCameronContext;
  generator: AskCameronGeneratorKind;
};

function buildContextBlock(retrieval: AskCameronRetrievalResult): string {
  if (retrieval.mode === "empty") {
    return "(No question provided.)";
  }

  const parts: string[] = [
    `Retrieval mode: ${retrieval.mode}`,
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
): AskCameronContext {
  return {
    question: question.trim(),
    systemPrompt: getAskCameronSystemPrompt(),
    assistantName: askCameronAssistantName,
    retrieval,
    contextBlock: buildContextBlock(retrieval),
  };
}

/**
 * Step 4: Context → Response (local generator).
 * Swap this implementation later for an LLM call using `context.systemPrompt` + `context.contextBlock`.
 */
export function generateAskCameronAnswer(context: AskCameronContext): AskCameronResponse {
  const answer = generateLocalAskCameronAnswer(context.retrieval);
  return {
    answer,
    context,
    generator: "local",
  };
}

/**
 * Full pipeline entry point used by the UI.
 * Preserves prior `answerFromKnowledge` behavior via the local generator.
 */
export function runAskCameronPipeline(question: string): AskCameronResponse {
  const retrieval = retrieveForQuestion(question);
  const context = buildAskCameronContext(question, retrieval);
  return generateAskCameronAnswer(context);
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
