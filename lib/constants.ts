/**
 * constants.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Named constants replacing magic numbers scattered across the codebase.
 * Import from here instead of hardcoding values inline.
 */

/** Estimated number of characters per printed page of a legal document. */
export const CHARS_PER_PAGE = 2_000;

/** Maximum characters stored as rawText in a Firestore document (≈ Firestore 1 MB limit buffer). */
export const FIRESTORE_RAW_TEXT_MAX_CHARS = 300_000;

/** Maximum characters to include when previewing a source quote in chat citations. */
export const CHAT_QUOTE_PREVIEW_CHARS = 140;

/** Maximum characters a user question is capped to before sending to the model. */
export const CHAT_QUESTION_MAX_CHARS = 300;

/** Maximum number of prior chat messages included in Q&A context. */
export const CHAT_HISTORY_WINDOW = 4;

/** Maximum characters of text before the chunker forces a new chunk at a paragraph boundary. */
export const CHUNK_MAX_CHARS = 1_400;

/** Default estimated words per page used by the chunker when no explicit page markers exist. */
export const CHUNK_WORDS_PER_PAGE = 400;

/** Interval in milliseconds between QuotaBadge polls to /api/quota. */
export const QUOTA_POLL_INTERVAL_MS = 30_000;
