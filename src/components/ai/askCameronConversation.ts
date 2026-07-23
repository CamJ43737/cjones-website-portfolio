/**
 * Ask Cameron — lightweight conversational continuity (local only).
 * Tracks last intent / suggested follow-up / topic so short replies like
 * “please do” resolve to the previously offered next step.
 *
 * When the prior turn offered multiple topics (e.g. “either project”),
 * ambiguous follow-ups clarify instead of picking the first option.
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
  | { kind: "hobby-interest" }
  | { kind: "project-detail"; slug: string }
  | { kind: "project-role"; slug: string }
  | { kind: "project-simple"; slug: string }
  | { kind: "generic-more" }
  /** Prior turn offered multiple topics — ambiguous “please do” should clarify. */
  | { kind: "choose-project"; slugs: string[] }
  | { kind: "expand-comparison"; slugs: string[] };

export type AskCameronConversationState = {
  lastIntent: string | null;
  lastSuggestedFollowUp: AskCameronFollowUpAction | null;
  lastDiscussedTopic: string | null;
  lastMatchedProjectSlugs: string[];
  lastQuestion: string | null;
};

/** Result of resolving a short follow-up against conversation memory. */
export type AskCameronFollowUpResolution =
  | { type: "question"; question: string }
  | { type: "clarify"; answer: string; offeredSlugs: string[] };

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
  // Prefer a single discussed project over the first of a multi-project list
  if (state.lastDiscussedTopic?.startsWith("project:")) {
    return state.lastDiscussedTopic.replace(/^project:/, "");
  }
  if (state.lastMatchedProjectSlugs.length === 1) {
    return state.lastMatchedProjectSlugs[0];
  }
  return null;
}

function offeredProjectSlugs(state: AskCameronConversationState): string[] {
  const action = state.lastSuggestedFollowUp;
  if (action?.kind === "choose-project" || action?.kind === "expand-comparison") {
    return action.slugs;
  }
  return [];
}

function isMultiTopicOffer(state: AskCameronConversationState): boolean {
  const action = state.lastSuggestedFollowUp;
  if (action?.kind === "choose-project" && action.slugs.length >= 2) return true;
  if (
    (state.lastIntent === "research-comparison" || state.lastIntent === "comparison") &&
    state.lastMatchedProjectSlugs.length >= 2 &&
    action?.kind !== "project-detail"
  ) {
    return true;
  }
  return false;
}

/** True when the utterance continues the prior turn (Phase 4A expansion layer). */
export function isConversationalContinuation(question: string): boolean {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q || q.length > 100) return false;
  return (
    /\bwhat else\b/.test(q) ||
    /^go on\b/.test(q) ||
    /^continue\b/.test(q) ||
    /^(nice|cool|awesome|interesting|great)\b/.test(q) ||
    /\bwhat about\b/.test(q)
  );
}

/** True when the utterance is a short conversational follow-up, not a new question. */
export function isFollowUpUtterance(question: string): boolean {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q || q.length > 100) return false;

  if (isConversationalContinuation(q)) return true;

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
    /^both$/,
    /^either$/,
    /^both of them$/,
    /^either (one|project)$/,
    /^compare (them|both)$/,
    /^the comparison$/,
  ];

  return patterns.some((re) => re.test(q));
}

function followUpKind(question: string): "accept" | "more" | "role" | "both" | "continue" {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (/role/.test(q) && !/\bwhat else\b/.test(q)) return "role";
  if (/^(both|either|both of them|either (one|project)|compare (them|both)|the comparison)$/.test(q)) {
    return "both";
  }
  if (
    /\bwhat else\b/.test(q) ||
    /^go on\b/.test(q) ||
    /^continue\b/.test(q) ||
    /^(nice|cool|awesome|interesting|great)\b/.test(q)
  ) {
    return "continue";
  }
  if (
    /tell me more|go deeper|expand|explain (that|this|it)|explain more|more detail|^more$|\bwhat about\b/.test(
      q,
    )
  ) {
    return "more";
  }
  return "accept";
}

function isHobbyTopic(state: AskCameronConversationState): boolean {
  return (
    state.lastIntent === "hobby-interest" ||
    state.lastIntent === "hobby-overview" ||
    state.lastDiscussedTopic === "beyond" ||
    state.lastSuggestedFollowUp?.kind === "hobby-interest"
  );
}

function isResearchTopic(state: AskCameronConversationState): boolean {
  return (
    state.lastDiscussedTopic === "research" ||
    state.lastDiscussedTopic === "comparison" ||
    state.lastDiscussedTopic?.startsWith("project:") ||
    state.lastIntent === "research-overview" ||
    state.lastIntent === "research-comparison" ||
    state.lastIntent === "robotics-experience" ||
    state.lastSuggestedFollowUp?.kind === "research-overview" ||
    state.lastSuggestedFollowUp?.kind === "research-timeline" ||
    state.lastSuggestedFollowUp?.kind === "choose-project" ||
    state.lastSuggestedFollowUp?.kind === "project-detail"
  );
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
    case "hobby-interest":
      return "What are Cameron's hobbies?";
    case "project-detail":
      return `Explain ${projectTitle(action.slug)}`;
    case "project-simple":
      return `Explain ${projectTitle(action.slug)} in simple terms`;
    case "project-role":
      return `What was Cameron's role on ${projectTitle(action.slug)}?`;
    case "expand-comparison":
      return `Compare ${action.slugs.map(projectTitle).join(" and ")} in more detail`;
    case "choose-project":
      // Should be handled via clarify — fall back to comparison if forced
      return action.slugs.length >= 2
        ? `Compare ${action.slugs.map(projectTitle).join(" and ")}`
        : `Explain ${projectTitle(action.slugs[0] ?? "ai-farms")}`;
    case "generic-more":
      if (state.lastQuestion) {
        return `${state.lastQuestion.replace(/[?.!]+$/g, "")} in more detail`;
      }
      return "Who is Cameron?";
    default:
      return "Who is Cameron?";
  }
}

export function formatProjectChoiceClarification(slugs: string[]): string {
  const names = slugs.map(projectTitle).filter(Boolean);
  if (names.length >= 2) {
    return `Would you like to go deeper into ${names[0]} or ${names[1]}?`;
  }
  if (names.length === 1) {
    return `Would you like to go deeper into ${names[0]}?`;
  }
  return "Which project would you like to explore next?";
}

/** Match a short user reply to one of the offered project slugs. */
export function matchProjectChoice(
  question: string,
  slugs: string[],
): string | null {
  const q = question.toLowerCase().trim().replace(/[?.!]+$/g, "");
  if (!q) return null;

  for (const slug of slugs) {
    const title = projectTitle(slug).toLowerCase();
    const compact = slug.replace(/-/g, " ");
    if (
      q === title ||
      q.includes(title) ||
      q.includes(compact) ||
      (slug.includes("aegis") && q.includes("aegis")) ||
      (slug.includes("farm") && (q.includes("farm") || q.includes("ai farms"))) ||
      (slug.includes("access") && q.includes("access"))
    ) {
      return slug;
    }
  }

  if (/^(the )?first( one)?$/.test(q) && slugs[0]) return slugs[0];
  if (/^(the )?second( one)?$/.test(q) && slugs[1]) return slugs[1];

  return null;
}

/**
 * Resolve a follow-up utterance using conversation state.
 * Returns null when the question should be handled normally.
 */
export function resolveFollowUp(
  question: string,
  state: AskCameronConversationState,
): AskCameronFollowUpResolution | null {
  const trimmed = question.trim();
  const offered = offeredProjectSlugs(state);

  // Pending multi-choice: allow naming a project even without “please do”
  if (offered.length >= 2) {
    const picked = matchProjectChoice(trimmed, offered);
    if (picked) {
      return {
        type: "question",
        question: actionToQuestion({ kind: "project-detail", slug: picked }, state),
      };
    }
  }

  if (!isFollowUpUtterance(trimmed) && !isConversationalContinuation(trimmed)) {
    return null;
  }
  if (!state.lastIntent && !state.lastSuggestedFollowUp && !state.lastDiscussedTopic) {
    return null;
  }

  const kind = followUpKind(trimmed);
  const multi = isMultiTopicOffer(state);
  const slugs =
    offered.length >= 2
      ? offered
      : state.lastMatchedProjectSlugs.slice(0, 2);

  // Phase 4A — continue prior topic (“what else”, “nice”, “go on”)
  if (kind === "continue" || (kind === "more" && /\bwhat else\b|\bwhat about\b/.test(trimmed.toLowerCase()))) {
    if (isHobbyTopic(state)) {
      return {
        type: "question",
        question: "What are Cameron's hobbies?",
      };
    }
    if (isResearchTopic(state) && !multi) {
      return {
        type: "question",
        question: actionToQuestion(
          state.lastSuggestedFollowUp && state.lastSuggestedFollowUp.kind !== "choose-project"
            ? state.lastSuggestedFollowUp
            : { kind: "research-overview" },
          state,
        ),
      };
    }
    if (multi && slugs.length >= 2) {
      return {
        type: "clarify",
        answer: formatProjectChoiceClarification(slugs),
        offeredSlugs: slugs,
      };
    }
    if (isResearchTopic(state)) {
      return {
        type: "question",
        question: "What research projects has Cameron worked on?",
      };
    }
  }

  if (kind === "both" && slugs.length >= 2) {
    return {
      type: "question",
      question: actionToQuestion({ kind: "expand-comparison", slugs }, state),
    };
  }

  // Ambiguous accept/more after a multi-topic offer → clarify
  if (multi && slugs.length >= 2 && (kind === "accept" || kind === "more")) {
    return {
      type: "clarify",
      answer: formatProjectChoiceClarification(slugs),
      offeredSlugs: slugs,
    };
  }

  const slug = primaryProjectSlug(state);

  if (kind === "role") {
    if (slug) {
      return {
        type: "question",
        question: actionToQuestion({ kind: "project-role", slug }, state),
      };
    }
    if (slugs.length >= 2) {
      return {
        type: "clarify",
        answer: `Which project’s role should I expand — ${slugs.map(projectTitle).join(" or ")}?`,
        offeredSlugs: slugs,
      };
    }
    return {
      type: "question",
      question: "What roles has Cameron held on his research projects?",
    };
  }

  if (kind === "more") {
    if (
      slug &&
      (state.lastDiscussedTopic?.startsWith("project:") ||
        state.lastIntent === "project-simple")
    ) {
      return {
        type: "question",
        question: actionToQuestion({ kind: "project-detail", slug }, state),
      };
    }
    if (state.lastSuggestedFollowUp && state.lastSuggestedFollowUp.kind !== "choose-project") {
      return {
        type: "question",
        question: actionToQuestion(state.lastSuggestedFollowUp, state),
      };
    }
    if (slug) {
      return {
        type: "question",
        question: actionToQuestion({ kind: "project-detail", slug }, state),
      };
    }
    if (state.lastDiscussedTopic === "research" || state.lastIntent === "research-overview") {
      return {
        type: "question",
        question: actionToQuestion({ kind: "research-timeline" }, state),
      };
    }
    return {
      type: "question",
      question: actionToQuestion({ kind: "generic-more" }, state),
    };
  }

  // accept offered follow-up ("please do", "yes", "go ahead", …)
  if (state.lastSuggestedFollowUp && state.lastSuggestedFollowUp.kind !== "choose-project") {
    return {
      type: "question",
      question: actionToQuestion(state.lastSuggestedFollowUp, state),
    };
  }
  if (slug) {
    return {
      type: "question",
      question: actionToQuestion({ kind: "project-detail", slug }, state),
    };
  }
  if (state.lastDiscussedTopic === "research") {
    return {
      type: "question",
      question: actionToQuestion({ kind: "research-timeline" }, state),
    };
  }
  return {
    type: "question",
    question: actionToQuestion({ kind: "generic-more" }, state),
  };
}

/** @deprecated Prefer resolveFollowUp — kept for simple string rewrites. */
export function resolveFollowUpQuestion(
  question: string,
  state: AskCameronConversationState,
): string | null {
  const resolved = resolveFollowUp(question, state);
  if (!resolved) return null;
  if (resolved.type === "question") return resolved.question;
  return null;
}

function deriveSuggestedFollowUp(
  retrieval: AskCameronRetrievalResult,
): AskCameronFollowUpAction | null {
  const intent = retrieval.responseIntent;
  const mode = retrieval.mode;
  const projectSlugs = (
    retrieval.comparisonProjects?.length
      ? retrieval.comparisonProjects
      : retrieval.matchedProjects
  ).map((p) => p.slug);
  const firstSlug = projectSlugs[0];

  if (intent === "research-overview" || mode === "research-overview" || mode === "research-index") {
    return { kind: "research-timeline" };
  }
  if (intent === "hobby-interest" || mode === "hobby-overview") {
    return { kind: "hobby-interest" };
  }
  if (intent === "project-simple" && firstSlug) {
    return { kind: "project-detail", slug: firstSlug };
  }
  if (intent === "research-comparison" || mode === "comparison") {
    if (projectSlugs.length >= 2) {
      return { kind: "choose-project", slugs: projectSlugs.slice(0, 2) };
    }
    if (firstSlug) return { kind: "project-detail", slug: firstSlug };
  }
  if (intent === "identity-intro" || mode === "identity-intro") {
    return { kind: "research-overview" };
  }
  if (intent === "robotics-experience" || mode === "robotics-overview") {
    if (projectSlugs.length >= 2) {
      return { kind: "choose-project", slugs: projectSlugs.slice(0, 2) };
    }
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
    return {
      kind: "choose-project",
      slugs: ["ai-farms", "access-ci", "project-aegis"],
    };
  }
  if (mode === "journey-chapter") {
    return firstSlug
      ? { kind: "project-detail", slug: firstSlug }
      : { kind: "journey" };
  }
  if (mode === "perspective") {
    return { kind: "future-direction" };
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
  if (intent === "research-comparison" || retrieval.mode === "comparison") {
    return "comparison";
  }
  if (intent === "hobby-interest" || retrieval.mode === "hobby-overview") {
    return "beyond";
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
  const fromComparison = (retrieval.comparisonProjects ?? []).map((p) => p.slug);
  const slugs = fromComparison.length
    ? fromComparison
    : retrieval.matchedProjects.map((p) => p.slug);

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
  const multiSlugs = state.lastMatchedProjectSlugs.slice(0, 2);

  if (
    closing.includes("expand ai farms") &&
    (closing.includes("access-ci") || closing.includes("project aegis"))
  ) {
    suggested = {
      kind: "choose-project",
      slugs: ["ai-farms", "access-ci", "project-aegis"],
    };
  } else if (
    closing.includes("research timeline") ||
    closing.includes("walk through cameron’s research timeline") ||
    closing.includes("walk through cameron's research timeline")
  ) {
    suggested = { kind: "research-timeline" };
  } else if (
    closing.includes("either project") ||
    closing.includes("either project's") ||
    closing.includes("deeper dive into one of these") ||
    (closing.includes("go deeper on either") && multiSlugs.length >= 2)
  ) {
    if (multiSlugs.length >= 2) {
      suggested = { kind: "choose-project", slugs: multiSlugs };
    }
  } else if (
    closing.includes("engineering interests, photography, or hobbies") ||
    closing.includes("pc building or photography") ||
    closing.includes("photography or fishing")
  ) {
    suggested = { kind: "hobby-interest" };
  } else if (closing.includes("robotics experience")) {
    suggested = { kind: "robotics" };
  } else if (
    closing.includes("any project in more detail") ||
    closing.includes("explain any project")
  ) {
    // Overview offered any project — keep timeline as primary single action if already set;
    // otherwise treat as multi-choice among flagships.
    if (suggested?.kind !== "research-timeline" && multiSlugs.length >= 2) {
      suggested = { kind: "choose-project", slugs: multiSlugs.slice(0, 2) };
    } else if (state.lastMatchedProjectSlugs[0] && suggested?.kind !== "research-timeline") {
      suggested = { kind: "project-detail", slug: state.lastMatchedProjectSlugs[0] };
    }
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
    const slug = primaryProjectSlug(state) ?? state.lastMatchedProjectSlugs[0];
    if (slug && closing.includes("role")) suggested = { kind: "project-role", slug };
    else if (slug) suggested = { kind: "project-detail", slug };
  }

  return { ...state, lastSuggestedFollowUp: suggested };
}

export type { AskCameronResponseIntent };
