import { NextRequest, NextResponse } from "next/server";
import { compareContractsWithAI } from "@/lib/ai/groq";
import { calcComparisonBudget } from "@/lib/ai/token-budget";
import { resolveUserId, consumeQuota, quotaSnapshot } from "@/lib/ai/user-quota";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docA, docB } = body as {
      docA: { id: string; title: string; rawText: string; pageCount?: number };
      docB: { id: string; title: string; rawText: string; pageCount?: number };
    };

    if (!docA?.rawText || !docB?.rawText) {
      return NextResponse.json(
        { error: "Both documents with text are required for comparison" },
        { status: 400 }
      );
    }

    // ── Dynamic budget based on both documents' sizes ──
    const budget = calcComparisonBudget(
      docA.pageCount ?? Math.ceil(docA.rawText.length / 2_000),
      docA.rawText.length,
      docB.pageCount ?? Math.ceil(docB.rawText.length / 2_000),
      docB.rawText.length
    );

    // ── Per-user quota check ──
    const userId  = resolveUserId(req);
    const allowed = consumeQuota(userId, budget.estimatedInputTokens + budget.maxTokensOut);

    if (!allowed) {
      const { generateContractComparison } = await import("@/lib/ai/heuristics");
      const comparison = generateContractComparison(docA, docB);
      return NextResponse.json({
        success: true,
        comparison,
        meta: { source: "heuristics", reason: "quota_exceeded", quota: quotaSnapshot(userId) },
      });
    }

    const comparison = await compareContractsWithAI(docA, docB, budget);
    return NextResponse.json({
      success: true,
      comparison,
      meta: { source: "ai", tier: budget.tier, quota: quotaSnapshot(userId) },
    });
  } catch (error: unknown) {
    console.error("API /api/compare error:", error);
    return NextResponse.json(
      { error: "Failed to compare documents with AI", details: String(error) },
      { status: 500 }
    );
  }
}
