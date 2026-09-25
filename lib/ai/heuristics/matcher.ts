import { DocumentChunk, RiskCard, ChecklistItem, SimplifiedSection } from "@/types/legal";
import { LEGAL_PATTERNS, LegalPattern } from "./patterns";

export interface MatchResult {
  rule: LegalPattern;
  matchedText: string;
  chunk: DocumentChunk;
}

export function matchDocumentChunks(chunks: DocumentChunk[]): MatchResult[] {
  const results: MatchResult[] = [];
  const foundRuleIds = new Set<string>();

  for (const chunk of chunks) {
    const text = chunk.content;
    
    for (const rule of LEGAL_PATTERNS) {
      if (foundRuleIds.has(rule.id)) continue; // Only report each risk once

      for (const pattern of rule.patterns) {
        const match = pattern.exec(text);
        if (match) {
          // Extract a snippet of context around the match
          const matchIndex = match.index;
          const snippetStart = Math.max(0, matchIndex - 50);
          const snippetEnd = Math.min(text.length, matchIndex + match[0].length + 150);
          let snippet = text.substring(snippetStart, snippetEnd).trim();
          if (snippetStart > 0) snippet = "..." + snippet;
          if (snippetEnd < text.length) snippet = snippet + "...";

          results.push({
            rule,
            matchedText: snippet,
            chunk,
          });
          foundRuleIds.add(rule.id);
          break; // Stop checking patterns for this rule
        }
      }
    }
  }

  return results;
}

export function generateRisksFromMatches(matches: MatchResult[]): RiskCard[] {
  return matches.map((match, idx) => ({
    id: `risk-${match.rule.id}-${idx}`,
    riskType: match.rule.category,
    title: match.rule.title,
    explanation: match.rule.explanation,
    whyItMatters: match.rule.whyItMatters,
    sourceClause: match.matchedText,
    pageNumber: match.chunk.pageNumber,
    sectionNumber: match.chunk.section || "General",
    severity: match.rule.severity,
    recommendation: match.rule.recommendation,
  }));
}

export function generateChecklistFromMatches(matches: MatchResult[]): ChecklistItem[] {
  const checklist: ChecklistItem[] = [];
  
  matches.forEach((match, idx) => {
    const pNum = match.chunk.pageNumber;
    const sRef = match.chunk.section || `Page ${pNum}`;

    switch (match.rule.id) {
      case "auto-renewal":
        checklist.push({
          id: `check-renewal-${idx}`,
          task: "Calendar notice deadline for contract non-renewal (typically 30-90 days prior to term end)",
          category: "Deadline",
          dueWindow: "Prior to renewal window",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "late-payment-interest":
        checklist.push({
          id: `check-latefee-${idx}`,
          task: "Confirm invoice payment turnaround aligns with internal Accounts Payable cycles",
          category: "Financial",
          dueWindow: "Prior to signing",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "service-suspension-nonpayment":
        checklist.push({
          id: `check-suspend-${idx}`,
          task: "Negotiate mandatory 10-day written cure notice before vendor can suspend services for overdue invoices",
          category: "Operational",
          dueWindow: "During negotiation",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "liability-cap":
        checklist.push({
          id: `check-liab-${idx}`,
          task: "Review liability ceiling with legal counsel; negotiate carve-outs for data security breaches and gross negligence",
          category: "Legal Review",
          dueWindow: "Before execution",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "customer-indemnification":
        checklist.push({
          id: `check-indemn-${idx}`,
          task: "Ensure customer indemnification is mutual and limited strictly to verified intentional misconduct",
          category: "Legal Review",
          dueWindow: "Before execution",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "data-breach-notification":
        checklist.push({
          id: `check-breach-${idx}`,
          task: "Verify security incident notification deadline is capped at 24-48 hours maximum",
          category: "Compliance",
          dueWindow: "During negotiation",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "audit-rights":
        checklist.push({
          id: `check-audit-${idx}`,
          task: "Establish audit guardrails: limit inspections to once annually with 30 days prior written notice",
          category: "Compliance",
          dueWindow: "During negotiation",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "data-deletion-return":
        checklist.push({
          id: `check-datadel-${idx}`,
          task: "Obtain written commitment for complete data extraction and certified cryptographic deletion upon exit",
          category: "Compliance",
          dueWindow: "At termination",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      case "termination-convenience":
        checklist.push({
          id: `check-term-${idx}`,
          task: "Confirm termination for convenience requires at least 30-60 days advance written notice",
          category: "Operational",
          dueWindow: "Before signing",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
      default:
        // Generic fallback for any other detected legal risk
        checklist.push({
          id: `check-action-${idx}`,
          task: `Review ${match.rule.title} with legal counsel prior to signing`,
          category: "Legal Review",
          dueWindow: "Before execution",
          completed: false,
          sourceRef: sRef,
          pageNumber: pNum,
        });
        break;
    }
  });

  return checklist;
}

export function generateSimplifiedSections(chunks: DocumentChunk[]): SimplifiedSection[] {
  // Take the top few major chunks and simplify them deterministically
  const simplified: SimplifiedSection[] = [];
  
  // Filter for substantial chunks (at least a few sentences)
  const substantialChunks = chunks.filter(c => c.content.length > 200).slice(0, 5);
  
  substantialChunks.forEach((chunk, idx) => {
    // Very basic deterministic "simplification" for fallback
    let summary = "This section outlines standard provisions regarding " + (chunk.heading || "the agreement") + ".";
    const takeaways = [];
    
    const textLower = chunk.content.toLowerCase();
    if (textLower.includes("pay") || textLower.includes("fee") || textLower.includes("$")) {
      summary = "This section discusses payment terms, fees, and financial obligations.";
      takeaways.push("Review payment deadlines and amounts carefully.");
    }
    if (textLower.includes("terminate") || textLower.includes("cancel")) {
      summary = "This section explains how and when the agreement can be terminated.";
      takeaways.push("Note the required notice periods for termination.");
    }
    if (textLower.includes("warrant") || textLower.includes("liab")) {
      summary = "This section covers warranties, disclaimers, and limits on legal liability.";
      takeaways.push("Check if liability is capped or if warranties are disclaimed.");
    }
    
    if (takeaways.length === 0) {
      takeaways.push(`Key terms regarding ${chunk.heading || "the section"}.`);
    }

    simplified.push({
      id: `sec-${idx}`,
      section: chunk.section || `Section ${idx+1}`,
      heading: chunk.heading || "General Provision",
      pageNumber: chunk.pageNumber,
      originalText: chunk.content.length > 300 ? chunk.content.substring(0, 300) + "..." : chunk.content,
      simplifiedText: summary,
      keyTakeaways: takeaways,
    });
  });

  return simplified;
}
