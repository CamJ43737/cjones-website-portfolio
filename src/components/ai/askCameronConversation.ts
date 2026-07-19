/**
 * Ask Cameron — lightweight conversational continuity (local only).
 * Tracks last intent / suggested follow-up / topic so short replies like
 * “please do” resolve to the previously offered next step.
 */

import type { AskCameronRetrievalResult } from "@/components/ai/askCameronRetrieval";
import type { AskCameronResponseIntent } from "@/components/ai/askCameronIntentResponses";
import { cameronKnowledge } from "@/data/cameronKnowledge";

export type AskCameronFollowUpAction =
  | { kind: "research-timeline" }
  | { kind: "journey" }
  | { kind: "robotics" }
  | { kind: "skills" }
  | { kind: "research-overview" }
  | { kind: "internships" }
  | { kind: "future-direction" }
  | { kind: "project-detail"; slug: string }
  | { kind: "project-role"; slug: string }
  | { kind: "project-simple"; slug: string }
  | { kind: "generic-more" };

export type AskCameronConversationState = {
  lastIntent: string | null;
  lastSuggestedFollowUp: AskCameronFollowUpAction | null;
  lastDiscussedTopic: string | null;
  lastMatchedProjectSlugs: string[];
  lastQuestion: string | null;
};

export function createEmptyConversationState(): AskCameronConversationState {
  return {
    lastIntent: null,
    lastSuggestedFollowUp: null,
    lastDiscussedTopic: null,
    lastMatchedProjectSlugs: [],
    lastQuestion: null,
  };
}

function projectTitle(slug: string): string {
  return (
    cameronKnowledge.research.find((r) => r.slug === slug)?.project ?? slug
  );
}

function primaryProjectSlug(state: AskCameronConversationState): string | null {
  return state.lastMatchedProjectSlugs[0] ?? null;
}

/** True when the utterance is a short conversational follow-up, not a new question. */
export function isFollowUpUtterance(question: string): boolean {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q || q.length > 80) return false;

  const patterns = [
    /^please do$/,
    /^do (it|that|this)$/,
    /^yes$/,
    /^yeah$/,
    /^yep$/,
    /^sure$/,
    /^ok$/,
    /^okay$/,
    /^please$/,
    /^go ahead$/,
    /^sounds good$/,
    /^tell me more$/,
    /^tell me more about (that|this|it)$/,
    /^more$/,
    /^more detail$/,
    /^more details$/,
    /^go deeper$/,
    /^go deeper on (that|this|it)$/,
    /^expand$/,
    /^expand on (that|this|it)$/,
    /^explain (that|this|it)$/,
    /^explain more$/,
    /^what about (his |cameron'?s )?role$/,
    /^and (his |cameron'?s )?role$/,
    /^his role$/,
    /^cameron'?s role$/,
  ];

  return patterns.some((re) => re.test(q));
}

function followUpKind(question: string): "accept" | "more" | "role" {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (/role/.test(q)) return "role";
  if (
    /tell me more|go deeper|expand|explain (that|this|it)|explain more|more detail|^more$/.test(
      q,
    )
  ) {
    return "more";
  }
  return "accept";
}

export function actionToQuestion(
  action: AskCameronFollowUpAction,
  state: AskCameronConversationState,
): string {
  switch (action.kind) {
    case "research-timeline":
      return "Walk me through Cameron's research timeline";
    case "journey":
      return "Tell me about Cameron's journey";
    case "robotics":
      return "What robotics experience does Cameron have?";
    case "skills":
      return "What technologies does Cameron use?";
    case "research-overview":
      return "What research projects has Cameron worked on?";
    case "internships":
      return "Where has Cameron interned?";
    case "future-direction":
      return "What are Cameron's future goals?";
    case "project-detail":
      return `Explain ${projectTitle(action.slug)}`;
    case "project-simple":
      return `Explain ${projectTitle(action.slug)} in simple terms`;
    case "project-role":
      return `What was Cameron's role on ${projectTitle(action.slug)}?`;
    case "generic-more":
      if (state.lastQuestion) {
        return `${state.lastQuestion.replace(/[?.!]+$/g, "")} in more detail`;
      }
      return "Who is Cameron?";
    default:
      return "Who is Cameron?";
  }
}

/**
 * Rewrite a follow-up utterance into a concrete question using conversation state.
 * Returns null when the question should be handled normally.
 */
export function resolveFollowUpQuestion(
  question: string,
  state: AskCameronConversationState,
): string | null {
  if (!isFollowUpUtterance(question)) return null;
  if (!state.lastIntent && !state.lastSuggestedFollowUp && !state.lastDiscussedTopic) {
    return null;
  }

  const kind = followUpKind(question);
  const slug = primaryProjectSlug(state);

  if (kind === "role") {
    if (slug) return actionToQuestion({ kind: "project-role", slug }, state);
    if (state.lastDiscussedTopic?.startsWith("project:")) {
      const topicSlug = state.lastDiscussedTopic.replace(/^project:/, "");
      return actionToQuestion({ kind: "project-role", slug: topicSlug }, state);
    }
    return "What roles has Cameron held on his research projects?";
  }

  if (kind === "more") {
    if (slug && (state.lastDiscussedTopic?.startsWith("project:") || state.lastIntent === "project-simple")) {
      return actionToQuestion({ kind: "project-detail", slug }, state);
    }
    if (state.lastSuggestedFollowUp) {
      return actionToQuestion(state.lastSuggestedFollowUp, state);
    }
    if (slug) return actionToQuestion({ kind: "project-detail", slug }, state);
    if (state.lastDiscussedTopic === "research" || state.lastIntent === "research-overview") {
      return actionToQuestion({ kind: "research-timeline" }, state);
    }
    return actionToQuestion({ kind: "generic-more" }, state);
  }

  // accept offered follow-up ("please do", "yes", "go ahead", …)
  if (state.lastSuggestedFollowUp) {
    return actionToQuestion(state.lastSuggestedFollowUp, state);
  }
  if (slug) return actionToQuestion({ kind: "project-detail", slug }, state);
  if (state.lastDiscussedTopic === "research") {
    return actionToQuestion({ kind: "research-timeline" }, state);
  }
  return actionToQuestion({ kind: "generic-more" }, state);
}

function deriveSuggestedFollowUp(
  retrieval: AskCameronRetrievalResult,
): AskCameronFollowUpAction | null {
  const intent = retrieval.responseIntent;
  const mode = retrieval.mode;
  const firstSlug = retrieval.matchedProjects[0]?.slug;

  if (intent === "research-overview" || mode === "research-overview" || mode === "research-index") {
    return { kind: "research-timeline" };
  }
  if (intent === "project-simple" && firstSlug) {
    return { kind: "project-detail", slug: firstSlug };
  }
  if (intent === "research-comparison" && firstSlug) {
    return { kind: "project-detail", slug: firstSlug };
  }
  if (intent === "identity-intro" || mode === "identity-intro") {
    return { kind: "research-overview" };
  }
  if (intent === "robotics-experience" || mode === "robotics-overview") {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "skills" };
  }
  if (intent === "skills" || mode === "skills-overview") {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "research-overview" };
  }
  if (intent === "career-internships" || mode === "career-overview") {
    return { kind: "research-overview" };
  }
  if (intent === "future-direction" || mode === "future-direction") {
    return { kind: "research-overview" };
  }
  if (intent === "motivation-origin" || mode === "motivation-origin") {
    return { kind: "research-overview" };
  }
  if (mode === "research-timeline") {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "project-detail", slug: "ai-farms" };
  }
  if (mode === "journey-chapter") {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "journey" };
  }
  if (mode === "perspective") {
    return { kind: "future-direction" };
  }
  if (mode === "comparison" && firstSlug) {
    return { kind: "project-detail", slug: firstSlug };
  }
  if (firstSlug && (mode === "ranked" || mode === "project-simple")) {
    return { kind: "project-role", slug: firstSlug };
  }
  if (isJourneyMode(retrieval)) {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "research-overview" };
  }

  return null;
}

function isJourneyMode(retrieval: AskCameronRetrievalResult): boolean {
  return (
    retrieval.mode === "research-timeline" ||
    retrieval.intents.includes("journey") ||
    /timeline|journey/i.test(retrieval.question)
  );
}

function deriveDiscussedTopic(retrieval: AskCameronRetrievalResult): string | null {
  const intent = retrieval.responseIntent;
  if (intent === "project-simple" && retrieval.matchedProjects[0]) {
    return `project:${retrieval.matchedProjects[0].slug}`;
  }
  if (retrieval.matchedProjects.length === 1) {
    return `project:${retrieval.matchedProjects[0].slug}`;
  }
  if (intent) return intent;
  if (retrieval.mode === "research-timeline") return "research-timeline";
  if (retrieval.mode === "journey-chapter") {
    return retrieval.chapterId ? `chapter:${retrieval.chapterId}` : "journey";
  }
  if (retrieval.mode === "research-overview" || retrieval.mode === "research-index") {
    return "research";
  }
  if (retrieval.mode !== "ranked" && retrieval.mode !== "fallback" && retrieval.mode !== "empty") {
    return retrieval.mode;
  }
  if (retrieval.matchedProjects[0]) return `project:${retrieval.matchedProjects[0].slug}`;
  return retrieval.intents[0] ?? null;
}

function deriveLastIntent(retrieval: AskCameronRetrievalResult): string | null {
  return (
    retrieval.responseIntent ??
    (retrieval.mode !== "ranked" && retrieval.mode !== "fallback" && retrieval.mode !== "empty"
      ? retrieval.mode
      : retrieval.intents[0] ?? null)
  );
}

/** Update conversation memory after a completed turn. */
export function updateConversationState(
  _prev: AskCameronConversationState,
  question: string,
  retrieval: AskCameronRetrievalResult,
): AskCameronConversationState {
  const slugs = retrieval.matchedProjects.map((p) => p.slug);
  // Prefer flagship research set when overview listed them
  const overviewSlugs =
    retrieval.responseIntent === "research-overview" ||
    retrieval.mode === "research-overview" ||
    retrieval.mode === "research-index"
      ? cameronKnowledge.research
          .filter((r) =>
            ["ai-farms", "project-aegis", "access-ci"].includes(r.slug),
          )
          .map((r) => r.slug)
      : slugs;

  return {
    lastIntent: deriveLastIntent(retrieval),
    lastSuggestedFollowUp: deriveSuggestedFollowUp(retrieval),
    lastDiscussedTopic: deriveDiscussedTopic(retrieval),
    lastMatchedProjectSlugs: overviewSlugs.length ? overviewSlugs : slugs,
    lastQuestion: question.trim(),
  };
}

/** Refine suggested follow-up from the assistant’s closing offer (last lines only). */
export function refineFollowUpFromAnswer(
  state: AskCameronConversationState,
  answer: string,
): AskCameronConversationState {
  const closing = answer.trim().split("\n").slice(-5).join("\n").toLowerCase();
  let suggested = state.lastSuggestedFollowUp;

  if (
    closing.includes("research timeline") ||
    closing.includes("walk through cameron’s research timeline") ||
    closing.includes("walk through cameron's research timeline")
  ) {
    suggested = { kind: "research-timeline" };
  } else if (closing.includes("robotics experience")) {
    suggested = { kind: "robotics" };
  } else if (
    closing.includes("any project in more detail") ||
    closing.includes("explain any project")
  ) {
    const slug = state.lastMatchedProjectSlugs[0];
    if (slug) suggested = { kind: "project-detail", slug };
  } else if (
    closing.includes("expand any chapter") ||
    closing.includes("expand another chapter")
  ) {
    suggested = { kind: "journey" };
  } else if (
    closing.includes("go deeper on the technology") ||
    closing.includes("cameron’s role") ||
    closing.includes("cameron's role")
  ) {
    const slug = state.lastMatchedProjectSlugs[0];
    if (slug && closing.includes("role")) suggested = { kind: "project-role", slug };
    else if (slug) suggested = { kind: "project-detail", slug };
  }

  return { ...state, lastSuggestedFollowUp: suggested };
}

export type { AskCameronResponseIntent };
