# Ask Cameron — AI Knowledge Base (Phase 1)

## What this is for

`cameronKnowledge.ts` is the centralized, structured source of truth for a future **Ask Cameron** AI assistant on this portfolio site.

Phase 1 created **data only**. Phase 2 added the UI. Phase 2.5 added multi-category retrieval. Phase 2.75 expands `cameronKnowledge.perspective` (why build / AI / Tuskegee, future interests, graduate direction) and improves comparisons, research timelines, and internal nav links in answers — still no external AI.

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
| `README-AI-KNOWLEDGE.md` | This guide |

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

## Design rules for Phase 1

1. **Single source of truth** — transform from `content.ts`; do not hand-duplicate long narratives.
2. **Retrieval-friendly** — prefer plain strings and string arrays that flatten cleanly into documents.
3. **Stable IDs** — research uses `slug`; journey uses timeline `id`; experience IDs are derived from role.
4. **No UI imports** — leave this module unused by pages until a later Ask Cameron phase.

---

## Next phases (out of scope here)

- Chat UI (“Ask Cameron” widget)
- LLM provider integration
- Embedding + vector store
- Citation of which knowledge chunks grounded each answer
