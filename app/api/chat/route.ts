import { NextRequest, NextResponse } from "next/server";
import { answerLegalQuestion } from "@/lib/ai/groq";
import { retrieveRelevantChunks } from "@/lib/retrieval/rag";
import { DocumentChunk } from "@/types/legal";
import { calcQABudget } from "@/lib/ai/token-budget";
import { resolveUserId, consumeQuota, quotaSnapshot } from "@/lib/ai/user-quota";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    // ── Runtime validation ────────────────────────────────────────────────────
    const { question, chunks, previousMessages, pageCount } = body;

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "question must be a non-empty string" },
        { status: 400 }
      );
    }
    if (!Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json(
        { error: "chunks must be a non-empty array" },
        { status: 400 }
      );
    }
    const safePrevious = Array.isArray(previousMessages)
      ? (previousMessages as { role: string; content: string }[])
      : [];
    const safePageCount =
      typeof pageCount === "number" && pageCount > 0 ? pageCount : 0;
    const safeChunks = chunks as DocumentChunk[];
    // ─────────────────────────────────────────────────────────────────────────

    // ── Dynamic budget based on document size ──
    const budget = calcQABudget(safePageCount, safeChunks.length);

    // ── Per-user quota check ──
    const userId = resolveUserId(req);
    const allowed = consumeQuota(userId, budget.estimatedInputTokens + budget.maxTokensOut);

    // Retrieve top-N chunks according to budget
    const relevantChunks = retrieveRelevantChunks(question, safeChunks, budget.ragChunkCount);

    const result = await answerLegalQuestion(
      question,
      relevantChunks,
      safePrevious,
      allowed ? budget : undefined  // undefined → function uses chunk fallback path
    );

    // If quota was denied, append a polite notice
    const answer = !allowed
      ? result.answer + "\n\n_⚠️ Daily AI quota reached — answers are based on document excerpts only._"
      : result.answer;

    return NextResponse.json({
      success: true,
      answer,
      sources: result.sources,
      suggestedFollowUps: result.suggestedFollowUps,
      meta: { tier: budget.tier, quota: quotaSnapshot(userId) },
    });
  } catch (error: unknown) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: "Failed to answer question with AI", details: String(error) },
      { status: 500 }
    );
  }
}
