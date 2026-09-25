# LegalClarity AI

> **AI-powered legal document assistant that simplifies complex legal documents, answers questions using the document as evidence, identifies important clauses and potential concerns, creates actionable checklists, compares documents, explains possible next steps, and prepares users for conversations with legal professionals.**

---

## Chosen Vertical

**Legal AI — Legal Assistance & Access**

Legal documents are intentionally complex, written for professionals with years of training. Yet everyday people — employees, tenants, freelancers, small-business owners — must sign contracts, NDAs, leases, and employment agreements without expert guidance. LegalClarity AI bridges this gap by acting as an intelligent reading companion: it never gives legal advice, but it ensures users understand _what they are signing_ before they sign it.

---

## Approach & Logic

### Core Architecture

LegalClarity AI is built on a **Retrieval-Augmented Generation (RAG)** pipeline with a deterministic heuristics fallback, ensuring it works correctly even without API connectivity:

```
PDF / Text Upload
       │
       ▼
┌─────────────────────────────┐
│  Text Extraction (pdfjs)    │
│  Legal Chunker (section-    │
│  aware sliding window)      │
└────────────┬────────────────┘
             │ DocumentChunks[]
             ▼
┌────────────────────────────────────────────────┐
│  AI Analysis Layer (lib/ai/groq.ts)            │
│                                                │
│  MODELS.ANALYSIS:                              │
│    1. openai/gpt-oss-20b   (tier B, primary)  │
│    2. qwen/qwen3.8-27b     (tier B, peer)     │
│    3. openai/gpt-oss-120b  (tier C, fallback) │
│    4. allam-2-7b           (tier A, last)     │
│                                                │
│  On any 404 / 429 / 503 → next model tried    │
│  On all models fail      → Heuristics engine  │
└────────────────────────────────────────────────┘
             │ LegalDocumentAnalysis
             ▼
┌─────────────────────────────┐
│  8-Tab Workspace UI         │
│  Overview · Simplified ·    │
│  Risks · Checklist ·        │
│  Sources · Chat · Next ·    │
│  Lawyer Prep                │
└─────────────────────────────┘
```

### Multi-Model Token-Optimised Routing

Each task type has its own model queue, ordered by cost-efficiency with no bias toward any single vendor:

| Task | Queue (in order) | Token budget |
|---|---|---|
| **Q&A** (high frequency) | `allam-2-7b` → `gpt-oss-20b` → `qwen3.8-27b` → `gpt-oss-120b` | 420 max tokens |
| **Full analysis** (heavy) | `gpt-oss-20b` → `qwen3.8-27b` → `gpt-oss-120b` → `allam-2-7b` | 1 200 max tokens |
| **Comparison** (structured) | `qwen3.8-27b` → `gpt-oss-20b` → `gpt-oss-120b` → `allam-2-7b` | 900 max tokens |

- **Tier A** (`allam-2-7b`): 7 K RPD, 500 K TPD — best for short, frequent Q&A.
- **Tier B** (`gpt-oss-20b`, `qwen3.8-27b`): 1 K RPD, 200 K TPD — balanced capability for analysis.
- **Tier C** (`gpt-oss-120b`): 1 K RPD — highest capability, used only when peers fail.

All prompts are hard-truncated before sending (`cap()`) and `max_tokens` is set aggressively to minimise spend.

### Heuristics Fallback Engine

`lib/ai/heuristics.ts` is a fully deterministic legal analysis engine that:
- Pattern-matches 50+ legal clause types (termination, liability, confidentiality, payment, governing law…)
- Detects document type (employment, SaaS, commercial lease…) and applies domain-specific risk scoring
- Produces a complete `LegalDocumentAnalysis` with the same schema as the AI path — the UI is identical regardless of which path ran

This means **the app is fully functional with zero API calls**.

---

## How the Solution Works

### 8-Tab Document Workspace

1. **Overview** — Executive summary: parties, dates, obligations, risk level, governing law
2. **Simplified** — Each section rewritten in plain English with "View Source →" deep-links
3. **Risks** — Categorised risk cards (Obligations, Payment Terms, Termination, Liability, Confidentiality…) with severity levels and "View in Document →" cross-navigation
4. **Checklist** — Interactive to-do list derived from contractual obligations; progress bar; `.txt` export
5. **Sources** — All text chunks with page numbers; searchable; copyable citations; highlight-on-navigate
6. **Chat** — RAG-powered Q&A: top-3 chunks retrieved by keyword and synonym-based relevance, sent to Groq, every answer cites page/section
7. **Next Steps** — Decision-tree guidance on what to verify or negotiate before signing
8. **Lawyer Prep** — Generated briefing pack (case summary, key facts, suggested questions) ready to hand to a solicitor; Markdown copy + print

### Cross-Tab Source Navigation

Any clause, risk, or checklist item that mentions a source can click **"View in Document →"** / **"View Source"** which switches the active tab to Sources and highlights the exact chunk — making it impossible to lose track of where a finding came from.

### Contract Comparison (Redline Diff)

Upload any two related contracts (e.g. original NDA vs vendor's revised draft). The comparison engine:
- Identifies Added, Removed, and Modified clauses
- Flags critical risk escalations
- Produces an executive comparison summary

### Demo Mode

Judges can click **"Load Demo Contracts"** on the dashboard or **"Load Sample Pair"** on the compare page to instantly pre-load three enterprise-grade contracts (Executive Employment Agreement, SaaS MSA v1, SaaS MSA v2 Redline) — no upload required.

---

## Assumptions Made

1. **Network connectivity is optional.** The heuristics engine produces full output without any API calls. This was a design requirement given hackathon environments may have restricted outbound access.

2. **Documents are text-extractable.** Scanned image PDFs are not supported; the system relies on `pdfjs-dist` text layer extraction. If no text is found, the user is prompted to paste text directly.

3. **Users are non-lawyers.** Outputs are tuned for comprehension by a lay person, not legal professionals. The system never uses legal jargon in its simplified sections.

4. **One active document workspace at a time.** The UI is optimised for deep single-document analysis; multi-document chat is out of scope.

5. **Groq free-tier limits.** Token budgets (420 / 900 / 1 200 max tokens per call) were set to stay well within the free-tier TPM caps. For production, these should be raised.

6. **Firebase auth is optional.** The app falls back to IndexedDB-only storage if Firebase is unconfigured, so it runs fully locally without any backend.

---

## Security Considerations

| Area | Implementation |
|---|---|
| **Identity Verification** | Calls Google's official Identity Toolkit API with the public Firebase API key to cryptographically verify ID token signatures server-side — rejecting spoofed `x-user-id` client headers |
| **DoS Defense & Hard Bounds** | Strict limits across all ingress routes: 10MB max upload buffer, 500k max document chars, 1,000 max query chars, 500 max chunk capacity, and 20-message chat history bounds |
| **Prompt firewall** | Every AI call includes a system-level instruction refusing off-topic prompts and instructing the model to never reveal its instructions |
| **No data persistence to third parties** | Document text is sent to Groq only for analysis; it is never logged or stored server-side beyond the Groq API contract |
| **Firebase Firestore rules** | Explicit `firestore.rules` enforces that documents under `/users/{uid}/documents/` can strictly be read/written by the matching authenticated UID |
| **Input sanitisation** | All user-supplied text is validated and bound before being inserted into prompts; prevents prompt injection and buffer exhaustion |
| **No `eval`, no `dangerouslySetInnerHTML`** | UI renders only structured data; no user-supplied HTML is ever injected into the DOM |
| **Environment variables** | API keys are isolated in server-only environment variables; never leaked to client bundles |
| **Automated Verification** | 19 unit & integration tests (`npm test`) covering heuristics, comparison, large docs, RAG grounding, quota security, and DoS limits |

---

## Code Quality

- **TypeScript strict mode** — all files type-checked; no implicit `any`
- **ESLint** with Next.js recommended rules + `react-hooks/immutability`, `react-hooks/purity`, `react-hooks/set-state-in-effect` — **0 errors**
- **Component architecture** — each of the 8 tabs is an independent component receiving typed props; no prop drilling through more than 2 levels
- **Separation of concerns**:
  - `lib/ai/` — AI and heuristics logic only
  - `lib/storage/` — persistence (Firestore + IDB)
  - `lib/pdf/` — extraction and chunking
  - `lib/retrieval/` — RAG chunk retrieval
  - `components/document/` — UI tab components
  - `app/api/` — thin Next.js API routes (≤ 40 lines each)
- **Immutability** — component props are never mutated; all state updates create new object spreads

---

## Efficiency

- **Chunked RAG** — only the top-3 semantically relevant chunks (keyword and synonym-based relevance scored) are sent per Q&A call, not the full document
- **Hard token caps** — `max_tokens` is set per task (420 / 900 / 1 200) to prevent runaway costs
- **Text truncation** — raw document text is capped at 3 000 chars for analysis, 2 000 per contract for comparison
- **Model tier routing** — cheapest model tried first; expensive models only reached on failure
- **Heuristics for analysis** — heavy pattern-matching runs entirely in-process; zero network cost
- **IndexedDB caching** — analysed documents are cached client-side; re-opening a document does not re-run analysis

---

## Setup & Running

### Prerequisites
- Node.js 18+
- A [Groq](https://console.groq.com) API key (free tier is sufficient)
- (Optional) Firebase project for cloud sync

### 1. Install
```bash
npm install
```

### 2. Configure
Create `.env.local`:
```env
# Required for AI features
AI_API_KEY=gsk_your_groq_api_key_here

# Optional — Firebase cloud sync
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> **Note:** The app runs fully without any API keys using its built-in heuristics engine.

### 3. Run
```bash
npm run dev      # development (Turbopack)
npm run build    # production build
npm run lint     # ESLint check
```

Open [http://localhost:3000](http://localhost:3000).

### Quick Demo (No Upload Needed)
1. Click **"Load Demo Contracts"** on the dashboard — three enterprise contracts are pre-loaded and analysed instantly.
2. Open any document to explore all 8 tabs.
3. Go to **Compare** → **"Load Sample Contract Pair"** to see the redline diff in action.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.6 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + Lucide Icons |
| AI / LLM | Groq SDK — `allam-2-7b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`, `openai/gpt-oss-120b` |
| Fallback | Deterministic heuristics engine (zero API cost) |
| PDF | `pdfjs-dist` (text extraction) + custom legal chunker |
| Auth | Firebase Authentication |
| Cloud DB | Firebase Firestore |
| Local DB | IndexedDB (via custom `documentStore`) |
| RAG | keyword and synonym-based relevance chunk retrieval (`lib/retrieval/rag.ts`) |

---

## Important Disclaimer

LegalClarity AI provides **information and educational assistance only**, not professional legal advice. It is not a substitute for consultation with a qualified legal professional. Always seek advice from a licensed attorney for matters with legal consequences.
