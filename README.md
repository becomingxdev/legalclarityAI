# LegalClarity AI

**AI-Powered Legal Document Understanding, Risk Analysis & Assistance Platform**

LegalClarity AI transforms dense, complex legal documents and agreements into plain-language explanations, actionable checklists, and lawyer-ready briefing packages — all backed by chunk-level source citations and zero hallucination grounding.

---

## 🌟 Key Features

1. **Plain-Language Simplifier**:
   - Converts convoluted legal text into everyday English.
   - Side-by-side legalese vs plain explanation with key takeaways.
2. **Important Clause & Risk Detection**:
   - Categorizes clauses into *Obligations*, *Payment Terms*, *Termination Clauses*, *Liability Clauses*, *Confidentiality*, *Renewal Clauses*, and *Restrictions*.
   - Filterable severity levels (High, Medium, Low) with "Why It Matters" callouts.
3. **Document-Grounded Q&A (RAG)**:
   - ChatGPT-style interactive chat.
   - Every answer cites exact Page Number, Section, and Clause text.
4. **Actionable Summary & Checklist**:
   - Turns contractual duties into an interactive to-do list with due dates and categories.
   - Progress bar, completion confetti, and `.txt` export.
5. **Contract Comparison & Redline Diff**:
   - Compares original agreement vs revised vendor draft.
   - Identifies Added, Removed, and Modified clauses, highlighting critical risk escalations.
6. **Strategic Options & Next-Step Guidance**:
   - Decision-tree recommendations on what to verify or negotiate before signing.
7. **Prepare for a Lawyer**:
   - Generates an executive case summary, key facts, and targeted questions for your attorney.
   - Print/PDF export and one-click Markdown copy.
8. **Multi-Source Provision Referencing**:
   - Inspect all ingested text chunks with page numbers and clause identifiers.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local` to enable remote Gemini AI:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note:* LegalClarity AI runs seamlessly out of the box even without API keys thanks to its built-in deterministic legal heuristics engine and pre-loaded enterprise contracts.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **AI / LLM**: `@google/genai` (Gemini 2.5 Flash) with fallback heuristics engine
- **PDF Extraction**: `pdf-parse` & legal chunking pipeline
- **State & Storage**: Client/Server hybrid persistence with pre-loaded demo agreements