import { DocumentChunk } from "@/types/legal";

/**
 * Clean and normalize legal document text
 */
export function cleanLegalText(text: string): string {
  if (!text) return "";
  return text
    // Replace non-standard whitespace and tabs
    .replace(/[\t\r]+/g, " ")
    // Fix excessive consecutive blank lines
    .replace(/\n{3,}/g, "\n\n")
    // Remove null bytes or bizarre control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize quotes and dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .trim();
}

/**
 * Splits legal text into Markdown structured chunks with page numbers,
 * section headers, and clause boundaries.
 */
export function chunkLegalDocument(
  rawText: string,
  documentId: string,
  estimatedWordsPerPage = 400
): DocumentChunk[] {
  const cleaned = cleanLegalText(rawText);
  if (!cleaned) return [];

  // Detect explicit Page markers if available (e.g. Page 1, [Page 2], --- Page 3 ---)
  // Otherwise estimate page numbers based on word progression
  const lines = cleaned.split("\n");
  const chunks: DocumentChunk[] = [];

  let currentSection = "General";
  let currentHeading = "Preamble & Recitals";
  let currentLines: string[] = [];
  let chunkIndex = 1;
  let wordCountAcc = 0;
  let detectedPage = 1;

  // Regex patterns for legal section headers
  const sectionHeaderRegex = /^(?:ARTICLE|SECTION|\bCLAUSE\b|\bPART\b|\bSCHEDULE\b|\bEXHIBIT\b|\d+\.)\s*([0-9A-Za-z.\s\-:]{3,80})/i;
  const pageMarkerRegex = /(?:---|===|\bPage\b|\bPAGE\b)\s*(\d+)/i;

  const pushChunk = () => {
    if (currentLines.length === 0) return;
    const content = currentLines.join("\n").trim();
    if (!content) return;

    chunks.push({
      documentId,
      chunkId: `chunk-${chunkIndex++}`,
      pageNumber: detectedPage,
      section: currentSection,
      heading: currentHeading,
      content,
    });
    currentLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for explicit page markers
    const pageMatch = trimmed.match(pageMarkerRegex);
    if (pageMatch && pageMatch[1]) {
      const parsedPage = parseInt(pageMatch[1], 10);
      if (!isNaN(parsedPage) && parsedPage > 0 && parsedPage < 500) {
        detectedPage = parsedPage;
      }
    } else {
      // Approximate page based on word volume
      const wordsInLine = trimmed.split(/\s+/).filter(Boolean).length;
      wordCountAcc += wordsInLine;
      if (wordCountAcc >= estimatedWordsPerPage) {
        detectedPage += Math.floor(wordCountAcc / estimatedWordsPerPage);
        wordCountAcc = wordCountAcc % estimatedWordsPerPage;
      }
    }

    // Check if line indicates a major legal section or clause title
    const headerMatch = trimmed.match(sectionHeaderRegex);
    const isAllCapsTitle = trimmed.length > 4 && trimmed.length < 60 && trimmed === trimmed.toUpperCase() && !trimmed.endsWith(".");

    if ((headerMatch || isAllCapsTitle) && currentLines.length > 2) {
      pushChunk();
      currentHeading = trimmed;
      currentSection = headerMatch ? headerMatch[0].trim() : trimmed;
      currentLines.push(trimmed);
      continue;
    }

    currentLines.push(trimmed);

    // If chunk gets too long (~1500 chars), break at natural paragraph boundary
    if (currentLines.join("\n").length > 1400 && trimmed === "") {
      pushChunk();
    }
  }

  // Push remaining lines
  pushChunk();

  // If no chunks were created, fallback to a single chunk
  if (chunks.length === 0) {
    chunks.push({
      documentId,
      chunkId: "chunk-1",
      pageNumber: 1,
      section: "Full Document",
      heading: "Overview",
      content: cleaned.slice(0, 3000),
    });
  }

  return chunks;
}
