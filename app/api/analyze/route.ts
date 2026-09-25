import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocumentWithAI } from "@/lib/ai/groq";
import { DocumentChunk } from "@/types/legal";
import { calcAnalysisBudget } from "@/lib/ai/token-budget";
import { resolveUserId, consumeQuota, quotaSnapshot } from "@/lib/ai/user-quota";
import { CHARS_PER_PAGE } from "@/lib/constants";

/** Maximum permitted text characters: 500,000 (prevents memory & token exhaustion) */
const MAX_TEXT_CHARS = 500_000;
/** Maximum title length */
const MAX_TITLE_CHARS = 200;
/** Maximum number of document chunks */
const MAX_CHUNKS = 500;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    // ── Runtime validation & DoS Defense ──────────────────────────────────────
    const { title, rawText, chunks, pageCount } = body;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Document title is required and must be a string" },
        { status: 400 }
      );
    }
    if (title.length > MAX_TITLE_CHARS) {
      return NextResponse.json(
        { error: `Document title exceeds maximum permitted length of ${MAX_TITLE_CHARS} characters` },
        { status: 400 }
      );
    }

    if (typeof rawText !== "string" || !rawText.trim()) {
      return NextResponse.json(
        { error: "Document text is required and must be a string" },
        { status: 400 }
      );
    }
    if (rawText.length > MAX_TEXT_CHARS) {
      return NextResponse.json(
        { error: `Document text exceeds maximum permitted limit of ${MAX_TEXT_CHARS.toLocaleString()} characters` },
        { status: 413 }
      );
    }

    if (!Array.isArray(chunks)) {
      return NextResponse.json(
        { error: "chunks must be an array" },
        { status: 400 }
      );
    }
    if (chunks.length > MAX_CHUNKS) {
      return NextResponse.json(
        { error: `Document chunk count exceeds maximum permitted limit of ${MAX_CHUNKS} chunks` },
        { status: 400 }
      );
    }

    const safePageCount =
      typeof pageCount === "number" && pageCount > 0 ? pageCount : undefined;
    const safeChunks = chunks as DocumentChunk[];
    // ─────────────────────────────────────────────────────────────────────────

    // ── Dynamic budget based on actual document size ──
    const pages  = safePageCount ?? Math.ceil(rawText.length / CHARS_PER_PAGE);
    const budget = calcAnalysisBudget(pages, rawText.length);

    // ── Per-user quota check (asynchronous cryptographic verification) ──
    const userId = await resolveUserId(req);
    const allowed = consumeQuota(userId, budget.estimatedInputTokens + budget.maxTokensOut);

    if (!allowed) {
      // Quota exhausted → return heuristic result without charging tokens
      const { generateHeuristicAnalysis } = await import("@/lib/ai/heuristics");
      const analysis = generateHeuristicAnalysis(title, rawText, safeChunks);
      return NextResponse.json({
        success: true,
        analysis,
        meta: { source: "heuristics", reason: "quota_exceeded", quota: quotaSnapshot(userId) },
      });
    }

    const analysis = await analyzeLegalDocumentWithAI(title, rawText, safeChunks, budget);
    return NextResponse.json({
      success: true,
      analysis,
      meta: { source: "ai", tier: budget.tier, quota: quotaSnapshot(userId) },
    });
  } catch (error: unknown) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document with AI", details: String(error) },
      { status: 500 }
    );
  }
}
