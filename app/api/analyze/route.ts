import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocumentWithAI } from "@/lib/ai/groq";
import { DocumentChunk } from "@/types/legal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, rawText, chunks } = body as {
      title: string;
      rawText: string;
      chunks: DocumentChunk[];
    };

    if (!rawText || !title) {
      return NextResponse.json(
        { error: "Document title and text are required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeLegalDocumentWithAI(title, rawText, chunks || []);
    return NextResponse.json({ success: true, analysis });
  } catch (error: unknown) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document with AI", details: String(error) },
      { status: 500 }
    );
  }
}
