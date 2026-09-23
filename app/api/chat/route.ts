import { NextRequest, NextResponse } from "next/server";
import { answerLegalQuestion } from "@/lib/ai/gemini";
import { retrieveRelevantChunks } from "@/lib/retrieval/rag";
import { DocumentChunk } from "@/types/legal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, chunks, previousMessages } = body as {
      question: string;
      chunks: DocumentChunk[];
      previousMessages?: { role: string; content: string }[];
    };

    if (!question || !chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: "Question and document chunks are required" },
        { status: 400 }
      );
    }

    // Retrieve the top grounded chunks for this specific question
    const relevantChunks = retrieveRelevantChunks(question, chunks, 4);

    const result = await answerLegalQuestion(question, relevantChunks, previousMessages);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      suggestedFollowUps: result.suggestedFollowUps,
    });
  } catch (error: unknown) {
    console.error("API /api/chat error:", error);
    return NextResponse.json(
      { error: "Failed to answer question", details: String(error) },
      { status: 500 }
    );
  }
}
