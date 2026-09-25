/**
 * AI Orchestrator & Multi-Model Routing Architecture
 * ─────────────────────────────────────────────────────────────────────────────
 * Central legal AI orchestrator managing model routing, token budgeting,
 * rate limit resilience, and deterministic fallback.
 *
 * Primary Provider: Groq API (Ultra-low latency open-weight models)
 * Routing Topology:
 *   - Q&A Queue:        allam-2-7b → gpt-oss-20b → qwen3.8-27b → gpt-oss-120b
 *   - Analysis Queue:   gpt-oss-20b → qwen3.8-27b → gpt-oss-120b → allam-2-7b
 *   - Comparison Queue: qwen3.8-27b → gpt-oss-20b → gpt-oss-120b → allam-2-7b
 *
 * Deterministic Safety Layer:
 *   - Pure TypeScript rule matcher in lib/ai/heuristics/
 *   - 100% grounded in document text with exact quotes and page numbers
 *   - Zero external dependencies; operates fully offline when API keys or quotas expire
 */

export {
  analyzeLegalDocumentWithAI,
  answerLegalQuestion,
  compareContractsWithAI,
} from "./groq";

export {
  generateHeuristicAnalysis,
  generateContractComparison,
} from "./heuristics";

export {
  calcAnalysisBudget,
  calcQABudget,
  calcComparisonBudget,
} from "./token-budget";

export {
  resolveUserId,
  consumeQuota,
  quotaSnapshot,
  getRemainingQuota,
} from "./user-quota";
