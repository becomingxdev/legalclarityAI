import { LegalDocument } from "@/types/legal";
import { chunkLegalDocument } from "@/lib/pdf/chunker";
import { generateHeuristicAnalysis } from "@/lib/ai/heuristics";
import { SAMPLE_SAAS_CONTRACT, SAMPLE_REVISED_SAAS_CONTRACT } from "@/lib/sample-data/sampleContracts";

const STORAGE_KEY = "legalclarity_documents_v1";

/**
 * Initialize default sample contracts if none exist in browser storage
 */
export function getInitialDocuments(): LegalDocument[] {
  const saasChunks = chunkLegalDocument(SAMPLE_SAAS_CONTRACT.rawText!, SAMPLE_SAAS_CONTRACT.id!);
  const saasAnalysis = generateHeuristicAnalysis(SAMPLE_SAAS_CONTRACT.title!, SAMPLE_SAAS_CONTRACT.rawText!);

  const saasDoc: LegalDocument = {
    id: SAMPLE_SAAS_CONTRACT.id!,
    userId: "usr-demo-12345",
    title: SAMPLE_SAAS_CONTRACT.title!,
    fileName: SAMPLE_SAAS_CONTRACT.fileName!,
    fileSize: SAMPLE_SAAS_CONTRACT.fileSize!,
    uploadDate: SAMPLE_SAAS_CONTRACT.uploadDate!,
    pageCount: SAMPLE_SAAS_CONTRACT.pageCount!,
    rawText: SAMPLE_SAAS_CONTRACT.rawText!,
    chunks: saasChunks,
    analysis: saasAnalysis,
    status: "ready",
    chatHistory: [
      {
        id: "msg-welcome",
        sender: "ai",
        text: `Hello! I have reviewed **${SAMPLE_SAAS_CONTRACT.title}**. You can ask me any question regarding your obligations, payment terms, auto-renewal deadlines, or liability caps. I will always cite the exact page and clause.`,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: [
          "Can I terminate this agreement early?",
          "What penalties exist for late payments?",
          "Is there an auto-renewal clause?",
          "What is provider's liability cap?",
        ],
      },
    ],
  };

  const redlineChunks = chunkLegalDocument(SAMPLE_REVISED_SAAS_CONTRACT.rawText!, SAMPLE_REVISED_SAAS_CONTRACT.id!);
  const redlineAnalysis = generateHeuristicAnalysis(SAMPLE_REVISED_SAAS_CONTRACT.title!, SAMPLE_REVISED_SAAS_CONTRACT.rawText!);

  const redlineDoc: LegalDocument = {
    id: SAMPLE_REVISED_SAAS_CONTRACT.id!,
    userId: "usr-demo-12345",
    title: SAMPLE_REVISED_SAAS_CONTRACT.title!,
    fileName: SAMPLE_REVISED_SAAS_CONTRACT.fileName!,
    fileSize: SAMPLE_REVISED_SAAS_CONTRACT.fileSize!,
    uploadDate: SAMPLE_REVISED_SAAS_CONTRACT.uploadDate!,
    pageCount: SAMPLE_REVISED_SAAS_CONTRACT.pageCount!,
    rawText: SAMPLE_REVISED_SAAS_CONTRACT.rawText!,
    chunks: redlineChunks,
    analysis: redlineAnalysis,
    status: "ready",
    chatHistory: [
      {
        id: "msg-welcome-2",
        sender: "ai",
        text: `Analysis ready for **${SAMPLE_REVISED_SAAS_CONTRACT.title}**. You can compare this redline against the original agreement in the Compare tab.`,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return [saasDoc, redlineDoc];
}

export function loadUserDocuments(): LegalDocument[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults = getInitialDocuments();
    saveUserDocuments(defaults);
    return defaults;
  }
  try {
    return JSON.parse(stored);
  } catch {
    const defaults = getInitialDocuments();
    saveUserDocuments(defaults);
    return defaults;
  }
}

export function saveUserDocuments(docs: LegalDocument[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function getDocumentById(id: string): LegalDocument | undefined {
  const docs = loadUserDocuments();
  return docs.find((d) => d.id === id);
}

export function saveDocument(doc: LegalDocument): void {
  const docs = loadUserDocuments();
  const index = docs.findIndex((d) => d.id === doc.id);
  if (index >= 0) {
    docs[index] = doc;
  } else {
    docs.unshift(doc);
  }
  saveUserDocuments(docs);
}

export function deleteDocumentById(id: string): void {
  const docs = loadUserDocuments();
  const filtered = docs.filter((d) => d.id !== id);
  saveUserDocuments(filtered);
}
