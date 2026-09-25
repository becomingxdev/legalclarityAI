import {
  LegalDocumentAnalysis,
  LawyerPrepBriefing,
  NextStepAction,
  ContractComparisonResult,
  ComparisonDiffItem,
  DocumentChunk,
} from "@/types/legal";
import { matchDocumentChunks, generateRisksFromMatches, generateChecklistFromMatches, generateSimplifiedSections } from "./heuristics/matcher";

/**
 * Intelligent deterministic legal heuristics engine.
 * Scans actual document chunks for patterns rather than using hardcoded responses.
 */
export function generateHeuristicAnalysis(
  title: string,
  rawText: string,
  chunks: DocumentChunk[] = []
): LegalDocumentAnalysis {
  // If no chunks provided, make a quick dummy chunk so the engine has something to read
  const textToScan = chunks.length > 0 ? chunks : [{
    documentId: "temp",
    chunkId: "chunk-1",
    pageNumber: 1,
    section: "General",
    heading: "Document Content",
    content: rawText
  }];

  const matches = matchDocumentChunks(textToScan);
  
  const risks = generateRisksFromMatches(matches);
  const checklist = generateChecklistFromMatches(matches);
  const simplifiedSections = generateSimplifiedSections(textToScan);

  // Extract parties (best effort deterministic)
  const partiesMatch = rawText.match(/between\s+([^,]+?)(?:,|\s+with|\s+a)\s+and\s+([^,.\n]+)/i);
  const parties = partiesMatch
    ? [partiesMatch[1].replace(/["']/g, "").trim(), partiesMatch[2].replace(/["']/g, "").trim()]
    : ["Provider / First Party", "Customer / Second Party"];

  // Detect key dates
  const dates: string[] = [];
  const dateMatches = rawText.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/g);
  if (dateMatches) {
    dates.push(...Array.from(new Set(dateMatches)).slice(0, 3));
  } else {
    dates.push("Date of Execution / Effective Date");
  }

  // Detect fees
  const fees: string[] = [];
  const moneyMatches = rawText.match(/\$\s?[0-9,]+(?:\.\d{2})?/g);
  if (moneyMatches) {
    fees.push(...Array.from(new Set(moneyMatches)).slice(0, 3).map((f) => `Payment: ${f}`));
  }

  // Next Steps
  const nextSteps: NextStepAction[] = [];
  if (risks.some(r => r.riskType === "Renewal Clauses")) {
    nextSteps.push({
      id: "step-renew",
      title: "Negotiate Mutual Notice Periods for Auto-Renewal",
      description: "Ask the vendor to reduce the cancellation window or require them to email a reminder prior to auto-renewing.",
      actionType: "Negotiate",
      urgency: "Before Signing",
    });
  }
  if (risks.some(r => r.riskType === "Liability Clauses")) {
    nextSteps.push({
      id: "step-liability",
      title: "Consult Legal Counsel on Indemnity & Liability",
      description: "Ask your attorney to review the liability caps and indemnity clauses to ensure you are adequately protected.",
      actionType: "Consult Lawyer",
      urgency: "Before Signing",
    });
  }
  if (nextSteps.length === 0) {
    nextSteps.push({
      id: "step-general",
      title: "General Legal Review",
      description: "Have a qualified attorney review the document to ensure all terms align with your business objectives.",
      actionType: "Review",
      urgency: "Before Signing",
    });
  }

  // Lawyer Prep
  const lawyerPrep: LawyerPrepBriefing = {
    documentTitle: title,
    caseSummary: `This agreement is a commercial contract between ${parties[0]} and ${parties[1]}. Key areas of commercial exposure have been flagged in the risks section.`,
    partiesInvolved: parties,
    effectiveDates: {
      startDate: dates[0] || "Upon execution",
      endDate: "See term clause",
      noticeDeadline: "See renewal clause",
    },
    keyFacts: {
      dates: dates.length > 0 ? dates : ["Effective Date"],
      parties: parties,
      obligations: ["See detailed checklist"],
      risks: risks.map(r => r.title),
    },
    suggestedQuestions: [
      "Are the liability caps standard for this type of agreement?",
      "Are there any unusual termination restrictions?",
      "What is our exposure regarding indemnification?",
    ],
    negotiationPoints: [
      "Ensure termination for convenience is mutual if applicable.",
      "Cap our indemnification obligations.",
    ],
  };

  return {
    executiveSummary: {
      documentPurpose: isSaaS
        ? "Commercial Software-as-a-Service Agreement"
        : "Commercial Agreement",
      partiesInvolved: parties,
      importantDates: dates.length > 0 ? dates : ["Not explicitly dated"],
      financialObligations: fees.length > 0 ? fees : ["No explicit high-value fees detected"],
      overallRiskLevel: risks.length > 2 ? "High" : risks.length > 0 ? "Medium" : "Low",
      governingLaw: "Unknown (requires legal review)",
    },
    simplifiedSections,
    risks,
    checklist,
    nextSteps,
    lawyerPrep,
  };
}

/**
 * Compare two legal contracts deterministically by matching sections and detecting diffs.
 */
function getWordTokens(str: string): Set<string> {
  const words = str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 || /\d+/.test(w));
  return new Set(words);
}

function tokenSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function extractHeadingOrTopic(text: string): {
  title: string;
  category: "Payment" | "Liability" | "Deadlines" | "Rights" | "Restrictions" | "General";
} {
  const firstLine = text.split("\n")[0].trim().replace(/^[\d#.\-\s]+/, "").slice(0, 50);
  const lower = text.toLowerCase();
  let category: "Payment" | "Liability" | "Deadlines" | "Rights" | "Restrictions" | "General" = "General";
  let title = firstLine || "Contract Clause";

  if (/payment|fee|invoice|price|rate|cost/i.test(lower)) {
    category = "Payment";
    title = firstLine.length > 5 ? firstLine : "Payment Terms";
  } else if (/term|renewal|expire|termination|cancel/i.test(lower)) {
    category = "Deadlines";
    title = firstLine.length > 5 ? firstLine : "Term & Termination";
  } else if (/liab|indemn|damage|remedy|claim/i.test(lower)) {
    category = "Liability";
    title = firstLine.length > 5 ? firstLine : "Liability & Indemnification";
  } else if (/audit|inspect|access/i.test(lower)) {
    category = "Rights";
    title = firstLine.length > 5 ? firstLine : "Audit & Verification Rights";
  } else if (/confidential|proprietary|disclosure|secret/i.test(lower)) {
    category = "Restrictions";
    title = firstLine.length > 5 ? firstLine : "Confidentiality Covenants";
  } else if (/ip|intellectual property|patent|copyright|ownership/i.test(lower)) {
    category = "Rights";
    title = firstLine.length > 5 ? firstLine : "Intellectual Property";
  }

  return { title, category };
}

/**
 * Compare two arbitrary legal contracts deterministically by matching sections and detecting diffs.
 * Uses token-similarity to classify changes into Added, Removed, and Modified.
 */
export function generateContractComparison(
  docA: { id: string; title: string; rawText: string },
  docB: { id: string; title: string; rawText: string }
): ContractComparisonResult {
  const items: ComparisonDiffItem[] = [];

  // Split into substantive paragraphs / sections
  const aParagraphs = docA.rawText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);

  const bParagraphs = docB.rawText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);

  const aTokens = aParagraphs.map(getWordTokens);
  const bTokens = bParagraphs.map(getWordTokens);

  const matchedBIndices = new Set<number>();
  let idCounter = 1;

  // 1. Scan Doc A paragraphs to find matches or removals in Doc B
  aParagraphs.forEach((aPara, aIdx) => {
    let bestMatchIdx = -1;
    let bestSimilarity = 0;

    bParagraphs.forEach((bPara, bIdx) => {
      if (matchedBIndices.has(bIdx)) return;
      const sim = tokenSimilarity(aTokens[aIdx], bTokens[bIdx]);
      if (sim > bestSimilarity) {
        bestSimilarity = sim;
        bestMatchIdx = bIdx;
      }
    });

    const meta = extractHeadingOrTopic(aPara);

    // If text is verbatim identical, no change
    if (bestMatchIdx !== -1 && aPara.trim() === bParagraphs[bestMatchIdx].trim()) {
      matchedBIndices.add(bestMatchIdx);
      return;
    }

    // If similarity is moderate to high (0.28 to 1.0) but texts differ, it's a MODIFIED clause
    if (bestSimilarity >= 0.28 && bestMatchIdx !== -1) {
      matchedBIndices.add(bestMatchIdx);
      const bPara = bParagraphs[bestMatchIdx];
      const isCritical = /liab|indemn|price|fee|rate|\$|termination|breach|cure|\d+/i.test(aPara + bPara);

      items.push({
        id: `diff-mod-${idCounter++}`,
        type: "modified",
        category: meta.category,
        isCritical,
        clauseTitle: meta.title,
        originalText: aPara.length > 300 ? aPara.slice(0, 300) + "..." : aPara,
        revisedText: bPara.length > 300 ? bPara.slice(0, 300) + "..." : bPara,
        aiExplanation: `Terms regarding ${meta.title.toLowerCase()} were amended between versions (lexical similarity: ${Math.round(bestSimilarity * 100)}%).`,
        impactAssessment: isCritical
          ? "Material change affecting commercial obligations, figures, or liability terms. Detailed legal review advised."
          : "Operational wording adjustment. Review for compliance consistency.",
      });
      return;
    }

    // If no match found in B, it was REMOVED
    const isCritical = /liab|indemn|warranty|ip|patent|defend|hold harmless/i.test(aPara);
    items.push({
      id: `diff-rm-${idCounter++}`,
      type: "removed",
      category: meta.category,
      isCritical,
      clauseTitle: `${meta.title} (Struck Out)`,
      originalText: aPara.length > 300 ? aPara.slice(0, 300) + "..." : aPara,
      revisedText: "[CLAUSE REMOVED ENTIRELY]",
      aiExplanation: `This clause was present in ${docA.title} but omitted from ${docB.title}.`,
      impactAssessment: isCritical
        ? "Critical protective clause removed in revised document. May eliminate key safeguards."
        : "Clause omitted in revised draft. Verify if removal was intentional.",
    });
  });

  // 2. Scan remaining unmatched Doc B paragraphs as ADDED
  bParagraphs.forEach((bPara, bIdx) => {
    if (matchedBIndices.has(bIdx)) return;
    const meta = extractHeadingOrTopic(bPara);
    const isCritical = /liab|penalty|suspend|fee|\$|audit|interest|non-compete/i.test(bPara);

    items.push({
      id: `diff-add-${idCounter++}`,
      type: "added",
      category: meta.category,
      isCritical,
      clauseTitle: `${meta.title} (New Clause)`,
      originalText: "[CLAUSE DID NOT EXIST IN ORIGINAL]",
      revisedText: bPara.length > 300 ? bPara.slice(0, 300) + "..." : bPara,
      aiExplanation: `New clause introduced in ${docB.title} that was not present in ${docA.title}.`,
      impactAssessment: isCritical
        ? "Introduces new legal liabilities, restrictions, or financial commitments."
        : "Standard operational clause added to revised contract.",
    });
  });

  // Prioritize critical items and cap to top 10 for clean UI presentation
  items.sort((a, b) => (b.isCritical ? 1 : 0) - (a.isCritical ? 1 : 0));
  const limitedItems = items.slice(0, 10);

  const addedCount = limitedItems.filter((i) => i.type === "added").length;
  const removedCount = limitedItems.filter((i) => i.type === "removed").length;
  const modifiedCount = limitedItems.filter((i) => i.type === "modified").length;
  const criticalCount = limitedItems.filter((i) => i.isCritical).length;

  return {
    docAId: docA.id,
    docBId: docB.id,
    docATitle: docA.title,
    docBTitle: docB.title,
    executiveComparison: `Contract comparison between "${docA.title}" and "${docB.title}" identified ${limitedItems.length} notable variances (${modifiedCount} modified, ${addedCount} added, ${removedCount} removed), including ${criticalCount} critical risk-affecting changes.`,
    criticalChangeCount: criticalCount,
    addedCount,
    removedCount,
    modifiedCount,
    items: limitedItems,
  };
}
