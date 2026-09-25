import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocumentWithAI } from "@/lib/ai/groq";
import { DocumentChunk } from "@/types/legal";
import { calcAnalysisBudget } from "@/lib/ai/token-budget";
import { resolveUserId, consumeQuota, quotaSnapshot } from "@/lib/ai/user-quota";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, rawText, chunks, pageCount } = body as {
      title: string;
      rawText: string;
      chunks: DocumentChunk[];
      pageCount?: number;
    };

    if (!rawText || !title) {
      return NextResponse.json(
        { error: "Document title and text are required" },
        { status: 400 }
      );
    }

    // ── Dynamic budget based on actual document size ──
    const pages  = pageCount ?? Math.ceil(rawText.length / 2_000); // ~2 000 chars/page estimate
    const budget = calcAnalysisBudget(pages, rawText.length);

    // ── Per-user quota check ──
    const userId = resolveUserId(req);
    const allowed = consumeQuota(userId, budget.estimatedInputTokens + budget.maxTokensOut);

    if (!allowed) {
      // Quota exhausted → return heuristic result without charging tokens
      const { generateHeuristicAnalysis } = await import("@/lib/ai/heuristics");
      const analysis = generateHeuristicAnalysis(title, rawText);
      return NextResponse.json({
        success: true,
        analysis,
        meta: { source: "heuristics", reason: "quota_exceeded", quota: quotaSnapshot(userId) },
      });
    }

    const analysis = await analyzeLegalDocumentWithAI(title, rawText, chunks || [], budget);
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
