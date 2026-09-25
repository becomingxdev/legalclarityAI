import { DocumentChunk, SourceReference } from "@/types/legal";

/**
 * Perform hybrid keyword and section retrieval across indexed chunks.
 * Grounds AI answers and links back to exact page numbers and clauses.
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 5
): DocumentChunk[] {
  if (!chunks || chunks.length === 0) return [];
  if (!query) return chunks.slice(0, topK);

  const cleanQuery = query.toLowerCase();
  const STOPWORDS = new Set([
    "the", "and", "for", "with", "from", "that", "this", "what", "which",
    "when", "where", "how", "many", "much", "does", "will", "shall",
    "into", "about", "than", "then", "there", "their", "they", "been", "have", "were", "are"
  ]);
  const queryTerms = cleanQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));

  // Legal domain query expansion
  const termExpansions: Record<string, string[]> = {
    terminate: ["termination", "cancel", "breach", "notice", "expire", "exit"],
    penalty: ["penalties", "fine", "fee", "liquidated damages", "interest", "charge"],
    renew: ["renewal", "auto-renew", "term", "extension", "subsequent"],
    liable: ["liability", "indemnify", "indemnification", "hold harmless", "damages", "cap"],
    pay: ["payment", "fee", "invoice", "due", "refund", "deposit", "compensation"],
    secret: ["confidential", "confidentiality", "proprietary", "trade secret", "disclosure"],
    restrict: ["restriction", "non-compete", "non-solicitation", "exclusivity", "limitation"],
  };

  const expandedTerms = new Set<string>(queryTerms);
  for (const term of queryTerms) {
    for (const [key, synonyms] of Object.entries(termExpansions)) {
      if (term.includes(key) || key.includes(term)) {
        synonyms.forEach((syn) => expandedTerms.add(syn));
      }
    }
  }

  // Score each chunk
  const scored = chunks.map((chunk) => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const headingLower = chunk.heading.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();

    for (const term of expandedTerms) {
      if (headingLower.includes(term)) score += 8;
      if (sectionLower.includes(term)) score += 6;

      // Count term occurrences in content
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      const matches = contentLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 2, 10);
      } else if (contentLower.includes(term)) {
        score += 1;
      }
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.filter((s) => s.score > 0).slice(0, topK);
  return topResults.map((s) => s.chunk);
}

/**
 * Format retrieved chunks into clean citations for chat and analysis
 */
export function extractSourcesFromChunks(chunks: DocumentChunk[]): SourceReference[] {
  return chunks.map((c) => ({
    pageNumber: c.pageNumber,
    section: c.section || "General",
    clause: c.heading || "Clause",
    quote: c.content.slice(0, 160).replace(/\n+/g, " ") + (c.content.length > 160 ? "..." : ""),
  }));
}
