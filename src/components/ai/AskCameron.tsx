"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquareText, Send, Sparkles, X } from "lucide-react";
import { cameronKnowledge } from "@/data/cameronKnowledge";
import { cn } from "@/lib/cn";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What research projects has Cameron worked on?",
  "Explain Project AEGIS.",
  "What AI technologies does Cameron use?",
  "Tell me about Cameron's background.",
  "How can I contact Cameron?",
] as const;

function joinList(items: string[]): string {
  return items.length ? items.join(", ") : "None listed";
}

/** Local Phase-2 mock answering — keyword match against cameronKnowledge. */
export function answerFromKnowledge(question: string): string {
  const q = question.toLowerCase().trim();
  const k = cameronKnowledge;

  if (!q) {
    return "Ask about Cameron’s research, experience, technologies, background, or how to get in touch.";
  }

  // Project-specific matches first
  const projectHit = k.research.find((r) => {
    const name = r.project.toLowerCase();
    const slug = r.slug.replace(/-/g, " ");
    return (
      q.includes(name) ||
      q.includes(slug) ||
      (r.slug === "project-aegis" && (q.includes("aegis") || q.includes("digital twin"))) ||
      (r.slug === "ai-farms" &&
        (q.includes("ai farms") || q.includes("precision agriculture") || q.includes("farm"))) ||
      (r.slug === "access-ci" && (q.includes("access") || q.includes("nlp"))) ||
      (r.slug === "prairie-view-robotics" &&
        (q.includes("prairie") || q.includes("pvamu"))) ||
      (r.slug === "cagi-hackathons" && (q.includes("cagi") || q.includes("hackathon")))
    );
  });

  if (
    projectHit &&
    (q.includes("explain") ||
      q.includes("about") ||
      q.includes("what is") ||
      q.includes("tell me") ||
      q.includes("aegis") ||
      q.includes("ai farms") ||
      q.includes("access") ||
      q.includes("prairie") ||
      q.includes("cagi") ||
      q.includes("hackathon") ||
      q.includes("digital twin"))
  ) {
    return [
      `**${projectHit.project}** — ${projectHit.domain}`,
      "",
      projectHit.description,
      "",
      `Role: ${projectHit.role}`,
      `Institutions: ${joinList(projectHit.institution)}`,
      projectHit.award ? `Award: ${projectHit.award}` : "",
      `Technologies: ${joinList(projectHit.technologies)}`,
      `Impact: ${joinList(projectHit.impact)}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (
    q.includes("research") ||
    q.includes("projects") ||
    q.includes("worked on") ||
    q.includes("laboratory")
  ) {
    const lines = k.research.map(
      (r) =>
        `• **${r.project}** (${r.domain}) — ${r.role}. ${r.description.split("\n\n")[0]}`,
    );
    return [
      `${k.identity.name}’s research focuses on ${joinList(k.identity.researchFocus)}.`,
      "",
      "Featured projects:",
      ...lines,
    ].join("\n");
  }

  if (
    q.includes("technolog") ||
    q.includes("skills") ||
    q.includes("stack") ||
    q.includes("tools") ||
    (q.includes("ai") && (q.includes("use") || q.includes("technolog")))
  ) {
    return [
      "Cameron’s technical toolkit includes:",
      "",
      `• AI / research: ${joinList(k.technicalSkills.ai)}`,
      `• Languages: ${joinList(k.technicalSkills.languages)}`,
      `• Frameworks: ${joinList(k.technicalSkills.frameworks)}`,
      `• Robotics: ${joinList(k.technicalSkills.robotics)}`,
      `• Tools: ${joinList(k.technicalSkills.tools)}`,
    ].join("\n");
  }

  if (
    q.includes("background") ||
    q.includes("story") ||
    q.includes("about cameron") ||
    q.includes("who is") ||
    q.includes("lego") ||
    q.includes("builder")
  ) {
    return [
      k.story.headline,
      "",
      k.story.legoStory,
      "",
      k.story.pcBuildingStory,
      "",
      k.identity.statement,
    ].join("\n");
  }

  if (
    q.includes("contact") ||
    q.includes("email") ||
    q.includes("reach") ||
    q.includes("linkedin") ||
    q.includes("github") ||
    q.includes("connect")
  ) {
    return [
      `You can reach ${k.identity.name} here:`,
      "",
      `• Email: ${k.contact.email}`,
      `• LinkedIn: ${k.contact.linkedin}`,
      `• GitHub: ${k.contact.github}`,
    ].join("\n");
  }

  if (q.includes("robot") || q.includes("experience") || q.includes("intern")) {
    const robotics = k.experience.filter(
      (e) =>
        e.role.toLowerCase().includes("robot") ||
        e.technologies.some((t) => t.toLowerCase().includes("robot")) ||
        e.responsibilities.toLowerCase().includes("robot"),
    );
    const list = (robotics.length ? robotics : k.experience).map(
      (e) =>
        `• **${e.role}** @ ${e.organization} (${e.dates}) — ${e.responsibilities}`,
    );
    return [
      q.includes("robot")
        ? "Cameron’s robotics-related experience:"
        : "Selected experience:",
      "",
      ...list,
    ].join("\n");
  }

  if (q.includes("award") || q.includes("scholarship") || q.includes("recognition")) {
    return [
      "Awards and recognition:",
      "",
      ...k.awardsAndRecognition.map(
        (a) => `• **${a.name}** (${a.category}) — ${a.description}`,
      ),
    ].join("\n");
  }

  if (q.includes("education") || q.includes("university") || q.includes("graduate")) {
    return `${k.identity.name} studies ${k.education.major} at ${k.education.university}. Expected graduation: ${k.education.expectedGraduation}. ${k.education.location}.`;
  }

  return [
    "I can answer from Cameron’s portfolio knowledge base — research, Project AEGIS, AI Farms, technologies, background, experience, and contact details.",
    "",
    "Try one of the suggested questions, or ask something more specific like “What is AI Farms?”",
  ].join("\n");
}

function renderMessageText(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-mist">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AskCameron() {
  const reduce = useReducedMotion();
  const panelId = useId();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask about Cameron’s research, technologies, background, or how to connect. Responses are grounded in this portfolio’s local knowledge base.",
    },
  ]);
  const [pending, setPending] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => openButtonRef.current?.focus(), 50);
  }, []);

  const ask = useCallback((question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPending(true);

    window.setTimeout(() => {
      const reply = answerFromKnowledge(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: reply },
      ]);
      setPending(false);
    }, reduce ? 0 : 380);
  }, [reduce]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, pending, reduce]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    ask(input);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="ask-cameron-panel"
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex max-h-[min(36rem,calc(100svh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.35rem] border border-tuskegee-gold/30 bg-obsidian/92 shadow-gold backdrop-blur-xl"
          >
            <header className="shrink-0 border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-tuskegee-gold/35 bg-tuskegee-gold/10 text-tuskegee-gold shadow-gold-sm">
                      <Sparkles size={15} aria-hidden />
                    </span>
                    <div>
                      <h2
                        id={titleId}
                        className="font-display text-base leading-tight text-mist sm:text-lg"
                      >
                        Ask Cameron AI
                      </h2>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-400 sm:text-xs">
                        AI assistant for Cameron Jones&apos; research portfolio.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-white/10 p-2 text-ink-300 transition hover:border-tuskegee-gold/40 hover:text-tuskegee-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold"
                  aria-label="Close Ask Cameron"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            <div
              ref={listRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
              aria-live="polite"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[92%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "border border-tuskegee-gold/35 bg-tuskegee-gold/12 text-mist"
                        : "border border-white/[0.08] bg-charcoal/55 text-ink-200",
                    )}
                  >
                    {renderMessageText(m.content)}
                  </div>
                </div>
              ))}
              {pending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/[0.08] bg-charcoal/55 px-3.5 py-2.5 text-xs text-ink-400">
                    Consulting portfolio knowledge…
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="shrink-0 space-y-2 border-t border-white/[0.06] px-4 py-3 sm:px-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tuskegee-gold/70">
                  Suggested
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={pending}
                      onClick={() => ask(q)}
                      className="rounded-xl border border-white/[0.08] bg-charcoal/40 px-3 py-2 text-left text-[12px] leading-snug text-ink-300 transition hover:border-tuskegee-gold/35 hover:text-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="shrink-0 border-t border-white/[0.08] p-3 sm:p-4"
            >
              <label htmlFor="ask-cameron-input" className="sr-only">
                Ask a question about Cameron Jones
              </label>
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-charcoal/50 px-2 py-1.5 pl-4 focus-within:border-tuskegee-gold/40">
                <input
                  ref={inputRef}
                  id="ask-cameron-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Ask about research, skills, contact…"
                  autoComplete="off"
                  disabled={pending}
                  className="min-w-0 flex-1 bg-transparent text-sm text-mist placeholder:text-ink-500 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tuskegee-gold/40 bg-tuskegee-gold/15 text-tuskegee-gold transition hover:bg-tuskegee-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send question"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-2 px-1 text-[10px] leading-snug text-ink-500">
                Prototype — local knowledge matching only. No external AI.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={openButtonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-tuskegee-gold/40 bg-obsidian/90 px-4 py-3 text-sm font-medium text-mist shadow-gold backdrop-blur-xl transition hover:border-tuskegee-gold/60 hover:text-tuskegee-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold"
        whileHover={reduce ? undefined : { scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tuskegee-gold/15 text-tuskegee-gold">
          {open ? <X size={15} aria-hidden /> : <MessageSquareText size={15} aria-hidden />}
        </span>
        <span className="pr-0.5">{open ? "Close" : "Ask Cameron"}</span>
      </motion.button>
    </div>
  );
}
