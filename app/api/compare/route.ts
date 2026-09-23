import { NextRequest, NextResponse } from "next/server";
import { compareContractsWithAI } from "@/lib/ai/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docA, docB } = body as {
      docA: { id: string; title: string; rawText: string };
      docB: { id: string; title: string; rawText: string };
    };

    if (!docA?.rawText || !docB?.rawText) {
      return NextResponse.json(
        { error: "Both documents with text are required for comparison" },
        { status: 400 }
      );
    }

    const comparison = await compareContractsWithAI(docA, docB);
    return NextResponse.json({ success: true, comparison });
  } catch (error: unknown) {
    console.error("API /api/compare error:", error);
    return NextResponse.json(
      { error: "Failed to compare documents with AI", details: String(error) },
      { status: 500 }
    );
  }
}
