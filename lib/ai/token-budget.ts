/**
 * token-budget.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamically computes per-call token budgets based on document complexity.
 *
 * Groq model hard limits (free tier):
 *   allam-2-7b          : 6 000 TPM
 *   gpt-oss-20b / qwen  : 8 000 TPM
 *   gpt-oss-120b        : 8 000 TPM
 *
 * Token estimation: 1 token ≈ 4 English characters (conservative approximation).
 *
 * Strategy:
 *  - Small docs  (≤10 pages  / ≤10 K chars) → tight budget, fast + cheap
 *  - Medium docs (≤25 pages  / ≤30 K chars) → balanced budget
 *  - Large docs  (≤50 pages  / ≤70 K chars) → generous budget, chunked well
 *  - Huge docs   (>50 pages  / >70 K chars) → max safe budget, heavy chunking
 */

export interface TokenBudget {
  /** Max characters of raw document text to include in the prompt */
  inputCharCap: number;
  /** max_tokens parameter sent to the model (output limit) */
  maxTokensOut: number;
  /** Number of RAG chunks to retrieve for Q&A */
  ragChunkCount: number;
  /** Max chars per individual RAG chunk sent in Q&A prompt */
  chunkCharCap: number;
  /** Approximate input token estimate (for quota accounting) */
  estimatedInputTokens: number;
  /** Human-readable tier label */
  tier: "small" | "medium" | "large" | "huge";
}

/** ~4 chars per English token */
const CHARS_PER_TOKEN = 4;

function estimateTokens(chars: number): number {
  return Math.ceil(chars / CHARS_PER_TOKEN);
}

/**
 * Classify document complexity into a tier.
 * Uses the more constraining of the two signals (pages or chars).
 */
function classifyTier(
  pageCount: number,
  charCount: number
): "small" | "medium" | "large" | "huge" {
  if (pageCount <= 10 && charCount <= 10_000) return "small";
  if (pageCount <= 25 && charCount <= 30_000) return "medium";
  if (pageCount <= 50 && charCount <= 70_000) return "large";
  return "huge";
}

// ─── Analysis budget ─────────────────────────────────────────────────────────
// For analysis we send a representative slice of the full text.
// Larger docs get more text, capped to stay within the 8K TPM window.
const ANALYSIS_CONFIG: Record<
  "small" | "medium" | "large" | "huge",
  { inputCharCap: number; maxTokensOut: number }
> = {
  small:  { inputCharCap:  4_000, maxTokensOut: 1_400 },
  medium: { inputCharCap:  8_000, maxTokensOut: 2_000 },
  large:  { inputCharCap: 14_000, maxTokensOut: 2_800 },
  huge:   { inputCharCap: 20_000, maxTokensOut: 3_600 },
};

export function calcAnalysisBudget(
  pageCount: number,
  rawTextLength: number
): TokenBudget {
  const tier = classifyTier(pageCount, rawTextLength);
  const cfg  = ANALYSIS_CONFIG[tier];
  return {
    ...cfg,
    ragChunkCount: 0, // N/A for analysis
    chunkCharCap:  0,
    estimatedInputTokens: estimateTokens(cfg.inputCharCap) + 400, // +schema overhead
    tier,
  };
}

// ─── Q&A (RAG Chat) budget ───────────────────────────────────────────────────
// For Q&A we only send the top-N retrieved chunks, not the full document.
// More chunks for larger docs (more surface area to search).
const QA_CONFIG: Record<
  "small" | "medium" | "large" | "huge",
  { ragChunkCount: number; chunkCharCap: number; maxTokensOut: number }
> = {
  small:  { ragChunkCount: 3, chunkCharCap:  400, maxTokensOut:  500 },
  medium: { ragChunkCount: 4, chunkCharCap:  500, maxTokensOut:  600 },
  large:  { ragChunkCount: 5, chunkCharCap:  600, maxTokensOut:  700 },
  huge:   { ragChunkCount: 6, chunkCharCap:  700, maxTokensOut:  800 },
};

export function calcQABudget(
  pageCount: number,
  totalChunkCount: number
): TokenBudget {
  // Derive charCount estimate from chunk count (each chunk ≈ 600 chars avg)
  const estimatedChars = totalChunkCount * 600;
  const tier = classifyTier(pageCount, estimatedChars);
  const cfg  = QA_CONFIG[tier];
  const chunkInputChars = cfg.ragChunkCount * cfg.chunkCharCap;
  return {
    inputCharCap: chunkInputChars,
    ...cfg,
    estimatedInputTokens: estimateTokens(chunkInputChars) + 200, // +question + system
    tier,
  };
}

// ─── Comparison budget ───────────────────────────────────────────────────────
// For comparison we send a slice of each document.
// Use the larger of the two documents to set the tier.
const COMPARISON_CONFIG: Record<
  "small" | "medium" | "large" | "huge",
  { inputCharCapPerDoc: number; maxTokensOut: number }
> = {
  small:  { inputCharCapPerDoc:  2_500, maxTokensOut:  900 },
  medium: { inputCharCapPerDoc:  4_000, maxTokensOut: 1_200 },
  large:  { inputCharCapPerDoc:  6_000, maxTokensOut: 1_600 },
  huge:   { inputCharCapPerDoc:  8_000, maxTokensOut: 2_000 },
};

export function calcComparisonBudget(
  docAPages: number,
  docALength: number,
  docBPages: number,
  docBLength: number
): TokenBudget & { inputCharCapPerDoc: number } {
  const tier = classifyTier(
    Math.max(docAPages, docBPages),
    Math.max(docALength, docBLength)
  );
  const cfg = COMPARISON_CONFIG[tier];
  const totalInputChars = cfg.inputCharCapPerDoc * 2;
  return {
    inputCharCap: totalInputChars,
    inputCharCapPerDoc: cfg.inputCharCapPerDoc,
    maxTokensOut: cfg.maxTokensOut,
    ragChunkCount: 0,
    chunkCharCap:  0,
    estimatedInputTokens: estimateTokens(totalInputChars) + 300,
    tier,
  };
}
