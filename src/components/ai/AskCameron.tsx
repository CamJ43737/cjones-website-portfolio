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
import {
  SUGGESTED_QUESTIONS,
  createEmptyConversationState,
  runAskCameronPipeline,
  type AskCameronConversationState,
} from "@/components/ai/askCameronPipeline";
import { cn } from "@/lib/cn";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

function renderMessageText(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*|\/(?:research(?:\/[\w-]+)?|journey|resume|publications|experience|#connect))/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-mist">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("/") || part.startsWith("#")) {
      const href = part.startsWith("#") ? `/${part}` : part;
      return (
        <a
          key={i}
          href={href}
          className="text-tuskegee-gold underline decoration-tuskegee-gold/40 underline-offset-2 transition hover:decoration-tuskegee-gold"
        >
          {part}
        </a>
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
        "Ask about Cameron’s research, experience, skills, journey, awards, publications, or contact details. I retrieve answers locally from this portfolio’s knowledge base.",
    },
  ]);
  const [pending, setPending] = useState(false);
  const conversationRef = useRef<AskCameronConversationState>(
    createEmptyConversationState(),
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => openButtonRef.current?.focus(), 50);
  }, []);

  const ask = useCallback(
    (question: string) => {
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
        const result = runAskCameronPipeline(trimmed, {
          conversation: conversationRef.current,
        });
        conversationRef.current = result.conversation;
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", content: result.answer },
        ]);
        setPending(false);
      }, reduce ? 0 : 380);
    },
    [reduce],
  );

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
                <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-0.5 sm:max-h-44">
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
                  placeholder="Ask about research, skills, journey…"
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
                Local multi-category retrieval — no external AI.
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

/** Re-export for tests / future tooling. */
export { answerFromKnowledge, runAskCameronPipeline } from "@/components/ai/askCameronPipeline";
