import { NextRequest, NextResponse } from "next/server";
import { compareContractsWithAI } from "@/lib/ai/groq";
import { calcComparisonBudget } from "@/lib/ai/token-budget";
import { resolveUserId, consumeQuota, quotaSnapshot } from "@/lib/ai/user-quota";
import { CHARS_PER_PAGE } from "@/lib/constants";

/** Maximum permitted text characters per compared document */
const MAX_DOC_TEXT_CHARS = 500_000;
/** Maximum title length */
const MAX_TITLE_CHARS = 200;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    // ── Runtime validation & DoS Defense ──────────────────────────────────────
    const { docA, docB } = body;

    if (
      !docA || typeof docA !== "object" ||
      typeof (docA as Record<string, unknown>).rawText !== "string" ||
      !(docA as Record<string, unknown>).rawText
    ) {
      return NextResponse.json(
        { error: "docA must be an object with a non-empty rawText string" },
        { status: 400 }
      );
    }
    if (
      !docB || typeof docB !== "object" ||
      typeof (docB as Record<string, unknown>).rawText !== "string" ||
      !(docB as Record<string, unknown>).rawText
    ) {
      return NextResponse.json(
        { error: "docB must be an object with a non-empty rawText string" },
        { status: 400 }
      );
    }

    const safeDocA = docA as { id: string; title: string; rawText: string; pageCount?: number };
    const safeDocB = docB as { id: string; title: string; rawText: string; pageCount?: number };

    if (safeDocA.rawText.length > MAX_DOC_TEXT_CHARS || safeDocB.rawText.length > MAX_DOC_TEXT_CHARS) {
      return NextResponse.json(
        { error: `One or both documents exceed maximum permitted limit of ${MAX_DOC_TEXT_CHARS.toLocaleString()} characters` },
        { status: 413 }
      );
    }

    safeDocA.title = (safeDocA.title || "Document A").slice(0, MAX_TITLE_CHARS);
    safeDocB.title = (safeDocB.title || "Document B").slice(0, MAX_TITLE_CHARS);
    // ─────────────────────────────────────────────────────────────────────────

    // ── Dynamic budget based on both documents' sizes ──
    const budget = calcComparisonBudget(
      safeDocA.pageCount ?? Math.ceil(safeDocA.rawText.length / CHARS_PER_PAGE),
      safeDocA.rawText.length,
      safeDocB.pageCount ?? Math.ceil(safeDocB.rawText.length / CHARS_PER_PAGE),
      safeDocB.rawText.length
    );

    // ── Per-user quota check (asynchronous cryptographic verification) ──
    const userId = await resolveUserId(req);
    const allowed = consumeQuota(userId, budget.estimatedInputTokens + budget.maxTokensOut);

    if (!allowed) {
      const { generateContractComparison } = await import("@/lib/ai/heuristics");
      const comparison = generateContractComparison(safeDocA, safeDocB);
      return NextResponse.json({
        success: true,
        comparison,
        meta: { source: "heuristics", reason: "quota_exceeded", quota: quotaSnapshot(userId) },
      });
    }

    const comparison = await compareContractsWithAI(safeDocA, safeDocB, budget);
    return NextResponse.json({
      success: true,
      comparison,
      meta: { source: "ai", tier: budget.tier, quota: quotaSnapshot(userId) },
    });
  } catch (error: unknown) {
    console.error("API /api/compare error:", error);
    return NextResponse.json(
      { error: "Failed to compare documents with AI" },
      { status: 500 }
    );
  }
}
