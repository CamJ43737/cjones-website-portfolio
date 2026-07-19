"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FlaskConical, ListChecks, Play, XCircle } from "lucide-react";
import { runAskCameronPipeline } from "@/components/ai/askCameronPipeline";
import {
  askCameronAllTestQuestions,
  askCameronTestQuestions,
  runAskCameronEvaluation,
  type AskCameronEvaluationReport,
} from "@/data/askCameronEvaluation";
import { askCameronHumanTests } from "@/data/askCameronHumanTests";

const EXAMPLE_QUESTIONS = [
  "Explain Project AEGIS",
  "What robotics experience does Cameron have?",
  "Compare AI Farms and Project AEGIS",
  "Why does Cameron want graduate research?",
  "What technologies does Cameron use?",
] as const;

type ViewMode = "single" | "evaluation";

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-charcoal/40 shadow-glass backdrop-blur-xl ${className}`}
    >
      <header className="border-b border-white/[0.08] px-4 py-3 sm:px-5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-tuskegee-gold/80">
          {title}
        </h2>
      </header>
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

function PreBlock({ children }: { children: string }) {
  return (
    <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/[0.06] bg-obsidian/70 p-3 font-mono text-[11px] leading-relaxed text-ink-300 sm:text-xs">
      {children || "—"}
    </pre>
  );
}

function CategoryChips({
  categories,
  variant = "gold",
}: {
  categories: string[];
  variant?: "gold" | "ok" | "missing";
}) {
  const styles =
    variant === "missing"
      ? "border-red-400/40 bg-red-500/10 text-red-300"
      : variant === "ok"
        ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-300"
        : "border-tuskegee-gold/30 bg-tuskegee-gold/10 text-tuskegee-gold";

  if (!categories.length) {
    return <p className="text-sm text-ink-400">None</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <li key={c} className={`rounded-full border px-3 py-1 text-xs ${styles}`}>
          {c}
        </li>
      ))}
    </ul>
  );
}

export function AskCameronTestDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [input, setInput] = useState<string>(EXAMPLE_QUESTIONS[0]);
  const [submitted, setSubmitted] = useState<string>(EXAMPLE_QUESTIONS[0]);
  const [evalReport, setEvalReport] = useState<AskCameronEvaluationReport | null>(null);

  const result = useMemo(() => runAskCameronPipeline(submitted), [submitted]);

  const categories = useMemo(() => {
    const fromDocs = result.context.retrieval.documents.map((d) => d.category);
    const fromIntents = result.context.retrieval.intents;
    const modeHint =
      result.context.retrieval.mode !== "ranked" &&
      result.context.retrieval.mode !== "empty"
        ? [`mode:${result.context.retrieval.mode}`]
        : [];
    return [...new Set([...fromIntents, ...fromDocs, ...modeHint])];
  }, [result]);

  const run = (question: string) => {
    const q = question.trim();
    if (!q) return;
    setViewMode("single");
    setInput(q);
    setSubmitted(q);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
  };

  const onRunEvaluation = () => {
    setViewMode("evaluation");
    setEvalReport(runAskCameronEvaluation(askCameronAllTestQuestions));
  };

  return (
    <main className="pb-28 pt-28">
      <div className="section-pad mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-300 transition hover:text-tuskegee-gold"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="chapter-label">Developer only</p>
            <h1 className="mt-3 font-display text-3xl text-mist sm:text-4xl">
              Ask Cameron — Test Console
            </h1>
            <p className="mt-3 max-w-measure text-sm leading-relaxed text-ink-300 sm:text-base">
              Inspect retrieval quality, context packaging, and the local generator before any
              external LLM is connected. Not linked in site navigation.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-tuskegee-gold/35 bg-tuskegee-gold/10 px-4 py-2 text-xs text-tuskegee-gold">
            <FlaskConical size={14} aria-hidden />
            Local pipeline · no API
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewMode("single")}
            className={`rounded-full border px-4 py-2 text-xs transition ${
              viewMode === "single"
                ? "border-tuskegee-gold/45 bg-tuskegee-gold/15 text-tuskegee-gold"
                : "border-white/12 text-ink-300 hover:border-tuskegee-gold/30"
            }`}
          >
            Single question
          </button>
          <button
            type="button"
            onClick={onRunEvaluation}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition ${
              viewMode === "evaluation"
                ? "border-tuskegee-gold/45 bg-tuskegee-gold/15 text-tuskegee-gold"
                : "border-white/12 text-ink-300 hover:border-tuskegee-gold/30"
            }`}
          >
            <ListChecks size={14} aria-hidden />
            Run Evaluation ({askCameronAllTestQuestions.length})
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Suite: {askCameronTestQuestions.length} automated + {askCameronHumanTests.length} human
          QA (Phase 3G)
        </p>

        {viewMode === "evaluation" && evalReport ? (
          <div className="mt-8 space-y-5">
            <Panel title="Evaluation Summary">
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <p className="font-display text-3xl text-mist">
                    {evalReport.passed}/{evalReport.total}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">cases passed</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-tuskegee-gold">
                    {(evalReport.passRate * 100).toFixed(0)}%
                  </p>
                  <p className="mt-1 text-xs text-ink-400">pass rate</p>
                </div>
                <div>
                  <p className="font-display text-3xl text-ink-200">{evalReport.failed}</p>
                  <p className="mt-1 text-xs text-ink-400">missing matches</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-500">
                A case fails if any expected category is missing, or an expected document hint is
                not found in retrieval.
              </p>
            </Panel>

            {evalReport.results.map((caseResult) => (
              <section
                key={caseResult.test.id}
                className={`overflow-hidden rounded-[1.35rem] border bg-charcoal/40 shadow-glass backdrop-blur-xl ${
                  caseResult.passed
                    ? "border-emerald-400/25"
                    : "border-red-400/35"
                }`}
              >
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {caseResult.test.category} · {caseResult.test.id}
                    </p>
                    <p className="mt-1 text-sm text-mist">{caseResult.test.question}</p>
                    <p className="mt-1 font-mono text-[10px] text-ink-500">
                      mode: {caseResult.response.context.retrieval.mode}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                      caseResult.passed
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                        : "border-red-400/40 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {caseResult.passed ? (
                      <CheckCircle2 size={14} aria-hidden />
                    ) : (
                      <XCircle size={14} aria-hidden />
                    )}
                    {caseResult.passed ? "Pass" : "Missing matches"}
                  </span>
                </header>

                <div className="space-y-4 px-4 py-4 sm:px-5">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      Expected categories
                    </p>
                    <CategoryChips categories={caseResult.test.expectedCategories} />
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      Retrieved categories
                    </p>
                    <CategoryChips
                      categories={caseResult.retrievedCategories}
                      variant="ok"
                    />
                  </div>
                  {caseResult.missingExpected.length > 0 && (
                    <div>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-300/80">
                        Missing categories
                      </p>
                      <CategoryChips
                        categories={caseResult.missingExpected}
                        variant="missing"
                      />
                    </div>
                  )}
                  {caseResult.missingDocumentHints.length > 0 && (
                    <div>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-300/80">
                        Missing document hints
                      </p>
                      <CategoryChips
                        categories={caseResult.missingDocumentHints}
                        variant="missing"
                      />
                    </div>
                  )}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      Top documents
                    </p>
                    {caseResult.topDocuments.length ? (
                      <ul className="space-y-2">
                        {caseResult.topDocuments.map((doc) => (
                          <li
                            key={doc.id}
                            className="rounded-xl border border-white/[0.08] bg-obsidian/50 px-3 py-2 text-xs text-ink-300"
                          >
                            <span className="text-mist">{doc.title}</span>
                            <span className="ml-2 font-mono text-[10px] text-tuskegee-gold/80">
                              {doc.category} · {doc.score.toFixed(1)}
                            </span>
                            <p className="mt-0.5 font-mono text-[10px] text-ink-500">{doc.id}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-ink-400">
                        No ranked documents (structured mode:{" "}
                        {caseResult.response.context.retrieval.mode}
                        {caseResult.response.context.retrieval.matchedProjects.length
                          ? ` · projects: ${caseResult.response.context.retrieval.matchedProjects
                              .map((p) => p.project)
                              .join(", ")}`
                          : ""}
                        ).
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => run(caseResult.test.question)}
                      className="rounded-full border border-white/12 px-3 py-1.5 text-[11px] text-ink-300 transition hover:border-tuskegee-gold/35 hover:text-mist"
                    >
                      Inspect in single mode
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="glass mt-8 rounded-[1.35rem] p-4 sm:p-6">
              <label
                htmlFor="ask-cameron-test-input"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-tuskegee-gold/70"
              >
                Test question
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <input
                  id="ask-cameron-test-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a portfolio question…"
                  className="min-w-0 flex-1 rounded-2xl border border-white/12 bg-obsidian/60 px-4 py-3 text-sm text-mist placeholder:text-ink-500 focus:border-tuskegee-gold/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-tuskegee-gold/45 bg-tuskegee-gold/15 px-6 py-3 text-sm text-tuskegee-gold transition hover:bg-tuskegee-gold/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tuskegee-gold"
                >
                  <Play size={15} aria-hidden />
                  Run pipeline
                </button>
              </div>

              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
                Example questions
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => run(q)}
                    className="rounded-xl border border-white/[0.08] bg-charcoal/40 px-3 py-2 text-left text-[12px] leading-snug text-ink-300 transition hover:border-tuskegee-gold/35 hover:text-mist"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </form>

            <div className="mt-8 grid gap-5">
              <Panel title="Question">
                <p className="text-sm leading-relaxed text-mist sm:text-base">
                  {result.context.question || "—"}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  Mode: {result.context.retrieval.mode} · Generator: {result.generator} ·
                  Confidence: {result.confidence} · Voice:{" "}
                  {result.context.retrieval.answerVoice}
                </p>
                <p className="mt-1 text-[11px] text-ink-500">
                  Confidence is internal only (not shown in the public Ask Cameron UI).
                </p>
              </Panel>

              <Panel title="Retrieved Categories">
                {categories.length ? (
                  <CategoryChips categories={categories} />
                ) : (
                  <p className="text-sm text-ink-400">No categories detected.</p>
                )}
              </Panel>

              <Panel title="Retrieved Documents">
                {result.context.retrieval.documents.length ? (
                  <ul className="space-y-3">
                    {result.context.retrieval.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="rounded-xl border border-white/[0.08] bg-obsidian/50 px-3 py-3"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium text-mist">{doc.title}</p>
                          <p className="font-mono text-[10px] text-tuskegee-gold/80">
                            score {doc.score.toFixed(1)} · {doc.category}
                          </p>
                        </div>
                        <p className="mt-1 font-mono text-[10px] text-ink-500">{doc.id}</p>
                        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-ink-300">
                          {doc.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-ink-400">
                    No ranked documents for this mode. Structured handlers use{" "}
                    <span className="text-mist">{result.context.retrieval.mode}</span>
                    {result.context.retrieval.matchedProjects.length
                      ? ` with matched projects: ${result.context.retrieval.matchedProjects
                          .map((p) => p.project)
                          .join(", ")}`
                      : ""}
                    .
                  </p>
                )}
              </Panel>

              <Panel title="Context Block">
                <p className="mb-3 text-xs text-ink-400">
                  Exact context package that would accompany a future LLM call (with the system
                  prompt).
                </p>
                <PreBlock>{result.context.contextBlock}</PreBlock>
              </Panel>

              <Panel title="System Prompt">
                <PreBlock>{result.context.systemPrompt}</PreBlock>
              </Panel>

              <Panel title="Local Generated Answer">
                <div className="whitespace-pre-wrap rounded-xl border border-tuskegee-gold/20 bg-tuskegee-gold/[0.06] p-4 text-sm leading-relaxed text-ink-200">
                  {result.answer}
                </div>
              </Panel>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
