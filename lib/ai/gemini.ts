import { GoogleGenAI } from "@google/genai";
import { DocumentChunk, LegalDocumentAnalysis, SourceReference } from "@/types/legal";
import { generateHeuristicAnalysis } from "./heuristics";

const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

/**
 * Perform server-side Legal Document Analysis using Gemini.
 * Uses structured JSON prompt engineering and falls back to heuristics if no key is supplied.
 */
export async function analyzeLegalDocumentWithAI(
  title: string,
  rawText: string,
  chunks: DocumentChunk[]
): Promise<LegalDocumentAnalysis> {
  if (!aiClient) {
    // Return high quality heuristic analysis
    return generateHeuristicAnalysis(title, rawText);
  }

  try {
    const prompt = `You are LegalClarity AI, an elite legal document analysis system.
Analyze the following legal contract and return a strict JSON response.
Do NOT hallucinate. Ground your findings strictly in the provided text.

DOCUMENT TITLE: ${title}

DOCUMENT TEXT:
"""
${rawText.slice(0, 16000)}
"""

Return a valid JSON object matching this exact schema:
{
  "executiveSummary": {
    "documentPurpose": string,
    "partiesInvolved": string[],
    "importantDates": string[],
    "financialObligations": string[],
    "overallRiskLevel": "High" | "Medium" | "Low",
    "governingLaw": string
  },
  "simplifiedSections": [
    {
      "id": string,
      "section": string,
      "heading": string,
      "pageNumber": number,
      "originalText": string,
      "simplifiedText": string,
      "keyTakeaways": string[]
    }
  ],
  "risks": [
    {
      "id": string,
      "riskType": "Obligations" | "Payment Terms" | "Termination Clauses" | "Liability Clauses" | "Confidentiality" | "Renewal Clauses" | "Restrictions",
      "title": string,
      "explanation": string,
      "whyItMatters": string,
      "sourceClause": string,
      "pageNumber": number,
      "sectionNumber": string,
      "severity": "High" | "Medium" | "Low",
      "recommendation": string
    }
  ],
  "checklist": [
    {
      "id": string,
      "task": string,
      "category": "Compliance" | "Financial" | "Operational" | "Legal Review" | "Deadline",
      "dueWindow": string,
      "completed": false,
      "sourceRef": string,
      "pageNumber": number
    }
  ],
  "nextSteps": [
    {
      "id": string,
      "title": string,
      "description": string,
      "actionType": "Review" | "Gather Documents" | "Negotiate" | "Verify Payment" | "Consult Lawyer" | "Sign/Reject",
      "urgency": "Immediate" | "Before Signing" | "Ongoing"
    }
  ],
  "lawyerPrep": {
    "documentTitle": string,
    "caseSummary": string,
    "partiesInvolved": string[],
    "effectiveDates": {
      "startDate": string,
      "endDate": string,
      "noticeDeadline": string
    },
    "keyFacts": {
      "dates": string[],
      "parties": string[],
      "obligations": string[],
      "risks": string[]
    },
    "suggestedQuestions": string[],
    "negotiationPoints": string[]
  }
}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText) as LegalDocumentAnalysis;
    return parsed;
  } catch (err) {
    console.warn("AI analysis failed or timed out, falling back to heuristics:", err);
    return generateHeuristicAnalysis(title, rawText);
  }
}

/**
 * Document-grounded Chat Q&A using RAG chunks with source citations
 */
export async function answerLegalQuestion(
  question: string,
  relevantChunks: DocumentChunk[],
  previousMessages: { role: string; content: string }[] = []
): Promise<{
  answer: string;
  sources: SourceReference[];
  suggestedFollowUps: string[];
}> {
  const sources: SourceReference[] = relevantChunks.map((c) => ({
    pageNumber: c.pageNumber,
    section: c.section,
    clause: c.heading,
    quote: c.content.slice(0, 150).replace(/\n+/g, " ") + "...",
  }));

  if (!aiClient) {
    // Deterministic grounded response based on matched chunks
    const chunkSnippets = relevantChunks.map((c) => `[${c.section} / ${c.heading} (Page ${c.pageNumber})]: "${c.content.slice(0, 250)}..."`).join("\n\n");
    return {
      answer: `Based on your document:\n\n${chunkSnippets}\n\nPlease check the cited sections for complete legal terms.`,
      sources,
      suggestedFollowUps: [
        "What are the specific penalties if I terminate early?",
        "Can the counterparty modify fees without my consent?",
        "What are my confidentiality obligations?",
      ],
    };
  }

  try {
    const contextPrompt = `You are LegalClarity AI Assistant. Answer the user's question grounded ONLY in the retrieved document chunks below.
Do NOT extrapolate beyond the facts. Always cite the exact page number and section heading where the information was found.
If the document does not contain the answer, explicitly state: "This document does not specify information regarding that question."

RELEVANT DOCUMENT EXCERPTS:
${relevantChunks.map((c) => `--- PAGE ${c.pageNumber} | ${c.section} - ${c.heading} ---\n${c.content}`).join("\n\n")}

USER QUESTION:
${question}

Return your answer in plain, clear language. At the very end, include 3 relevant follow-up questions formatted as:
FOLLOW_UPS:
- Question 1
- Question 2
- Question 3`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
    });

    const fullText = response.text || "";
    let answerText = fullText;
    let followUps: string[] = [
      "Can we negotiate these terms before signing?",
      "What are the exit obligations?",
      "Are there any liability caps mentioned?",
    ];

    if (fullText.includes("FOLLOW_UPS:")) {
      const parts = fullText.split("FOLLOW_UPS:");
      answerText = parts[0].trim();
      const extracted = parts[1]
        .split("\n")
        .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
        .filter((l) => l.length > 5);
      if (extracted.length > 0) followUps = extracted.slice(0, 3);
    }

    return {
      answer: answerText,
      sources,
      suggestedFollowUps: followUps,
    };
  } catch (err) {
    console.error("Gemini Q&A error, using fallback:", err);
    return {
      answer: `Based on the relevant provisions found in ${relevantChunks[0]?.heading || "the contract"}: ${relevantChunks[0]?.content.slice(0, 220)}...`,
      sources,
      suggestedFollowUps: [
        "What are the termination conditions?",
        "What are the payment deadlines?",
      ],
    };
  }
}
