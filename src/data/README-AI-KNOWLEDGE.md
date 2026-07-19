# Ask Cameron — AI Knowledge Base

## What this is for

`cameronKnowledge.ts` is the centralized, structured source of truth for the **Ask Cameron** research portfolio assistant.

**Current state (through Phase 3G):** local-only pipeline — keyword/intent retrieval, composed answers, evaluation suites, and internal confidence. No OpenAI, external APIs, or UI redesign in this phase.

Still not included:

- OpenAI / external AI APIs
- Vector database, embeddings pipeline, or backend services
- Homepage redesign

The knowledge object answers questions such as:

- What research has Cameron done?
- What robotics experience does Cameron have?
- Explain Project AEGIS.
- What technologies does Cameron use?
- What is Cameron’s background?
- How can someone contact Cameron?

---

## Files

| File | Role |
|------|------|
| `cameronKnowledge.ts` | Structured knowledge + retrieval document helper |
| `content.ts` | **Canonical site content** — edit facts here first |
| `askCameronSystemPrompt.ts` | System identity, voice rules, confidence notes for future LLM |
| `askCameronEvaluation.ts` | Automated eval suite + runner |
| `askCameronHumanTests.ts` | Human QA suite (Phase 3G) |
| `README-AI-KNOWLEDGE.md` | This guide |
| `../components/ai/askCameronPipeline.ts` | Question → Retrieval → Context → Generator |
| `../components/ai/askCameronRetrieval.ts` | Retrieval modes + local answer composer |
| `../components/ai/askCameronIntentResponses.ts` | Intent detection + composed answers |

---

## How future AI retrieval will use it

1. **Structured object** — `cameronKnowledge` groups facts by domain (`identity`, `research`, `experience`, etc.) for prompt assembly or tool-style lookup.
2. **Retrieval documents** — call `getCameronKnowledgeDocuments()` to get flat `{ id, category, title, text, metadata }` chunks.
3. **Later phases (not built yet)** can:
   - Embed each document’s `text`
   - Store vectors in a retrieval index
   - On user question: retrieve top-k chunks → pass into an LLM with a system prompt
   - Or answer simpler lookups by reading fields directly (e.g. `cameronKnowledge.contact.email`)

Example (future):

```ts
import { cameronKnowledge, getCameronKnowledgeDocuments } from "@/data/cameronKnowledge";

// Direct field lookup
const email = cameronKnowledge.contact.email;

// RAG-ready chunks
const docs = getCameronKnowledgeDocuments();
// → embed docs[].text, retrieve by similarity, ground the model answer
```

---

## Where to add new information

**Prefer editing `content.ts`** (or other existing content modules), then ensuring `cameronKnowledge.ts` still maps the new fields.

| Kind of update | Edit first | Knowledge mapping |
|----------------|------------|-------------------|
| Name, school, contact, graduation | `site` in `content.ts` | `identity`, `education`, `contact` |
| Bio / LEGO / builder story | `aboutStory` | `story` |
| Research projects | `researchProjects` | `research` |
| Jobs / internships | `experiences` | `experience` |
| Awards | `awards` | `awardsAndRecognition` |
| Leadership roles | `leadership` | `leadership` |
| Pubs / posters | `publications` | `publications` |
| Skills | `skillCategories` | `technicalSkills` |
| Hobbies (PC, photo, fishing) | `beyondHobbies` | `beyondTheLab` |
| Timeline chapters | `timeline` | `journey` |

Only add **AI-only** fields inside `cameronKnowledge.ts` when the website does not (and should not) display that fact.

After changing source content, run `npm run build` to confirm types still compile.

---

## What information should NOT be stored

Do **not** put the following in this knowledge base:

- API keys, secrets, or credentials
- Private addresses, phone numbers, or non-public personal data
- Family members’ private details beyond what is already intentionally public on the site
- Raw media binaries or large image/video payloads (use paths/captions from media modules if needed later)
- Scraped third-party content Cameron did not author or approve
- Speculative claims not backed by site content or verified CV facts
- Temporary draft notes or unverified accomplishments

Keep the knowledge base **public-portfolio aligned**: if it should not appear on the website, it generally should not be in Ask Cameron’s training/retrieval set.

---

## Design rules

1. **Single source of truth** — transform from `content.ts`; do not hand-duplicate long narratives.
2. **Retrieval-friendly** — prefer plain strings and string arrays that flatten cleanly into documents.
3. **Stable IDs** — research uses `slug`; journey uses timeline `id`; experience IDs are derived from role.
4. **No invented facts** — do not add technologies, datasets, or claims that are not evidenced in portfolio content.
5. **Local-first** — keep Ask Cameron working without network or API keys until an LLM phase is explicitly started.

---

## Phase 3G — Human QA, voice, confidence

Phase 3G polishes Ask Cameron as a professional research assistant **before** connecting an LLM.

### Human QA testing

- Suite file: `askCameronHumanTests.ts`
- Categories: recruiter, graduate research, research explainers, personal story, collaboration
- Integrated into `runAskCameronEvaluation()` via `askCameronAllTestQuestions` (automated suite + human suite)
- Existing automated cases (~60) are **not** removed
- Dev console: `/ask-cameron-test` → “Run Evaluation” runs the full combined suite

### Voice consistency

| Question type | Voice | Examples |
|---------------|-------|----------|
| Personal / story | First-person (“My journey…”, “I started…”, “I believe…”) | Who is Cameron?, Why AI?, Why Tuskegee?, future goals, building philosophy |
| Research / factual | Third-person (“Cameron has…”, “Cameron’s research includes…”) | Projects, internships, awards, publications, skills, contact |

Rules are encoded in `voiceForIntent()`, retrieval `answerVoice`, and `askCameronSystemPrompt.ts` (`askCameronVoiceRules`).

### Fallback behavior

Unclear questions use a professional redirect (not a weak timeline latch):

> I can help with Cameron’s research, projects, experience, skills, journey, awards, publications, or future goals. Try asking…

### Internal confidence (not shown in public UI)

Retrieval attaches `confidence: "high" | "medium" | "low"`:

| Level | Meaning |
|-------|---------|
| **high** | Strong intent match and/or solid retrieved context |
| **medium** | Related category / perspective match |
| **low** | Weak or no match → graceful fallback |

Also available on `AskCameronResponse.confidence` and in the context block for a future LLM. The public Ask Cameron widget does **not** display it; the test console may show it for debugging.

### Preparation for future LLM integration

When an LLM is connected later:

1. Use the same pipeline: Question → Retrieval → Context → Generator
2. Pass `systemPrompt` + `contextBlock` (includes mode, confidence, answerVoice, documents)
3. Route or style answers using `confidence` (e.g. low → shorter / suggestion-only)
4. Keep local generator as fallback

Do **not** start OpenAI / provider work in Phase 3G.

---

## Next phases (out of scope here)

- LLM provider integration (OpenAI or other)
- Embedding + vector store
- Citation of which knowledge chunks grounded each answer
- Optional confidence display for operators only (still not for public visitors)
