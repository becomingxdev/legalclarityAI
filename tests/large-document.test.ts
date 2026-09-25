import test from "node:test";
import assert from "node:assert";
import { chunkLegalDocument } from "../lib/pdf/chunker";
import { extractSourcesFromChunks } from "../lib/retrieval/rag";

test("Large Document: processes >20k characters and represents all chunks and final page", () => {
  // Generate synthetic multi-page document exceeding 25,000 characters across 15 pages
  const pages: string[] = [];
  for (let p = 1; p <= 15; p++) {
    const pageText = `--- Page ${p} ---\nSECTION ${p}.0 CLAUSE PROVISION\n` +
      `This is substantive legal text for page ${p} outlining obligations, covenants, and restrictions. ` +
      `The parties agree to perform all duties faithfully and in accordance with applicable industry standards. `.repeat(15);
    pages.push(pageText);
  }
  const fullRawText = pages.join("\n\n");
  assert.ok(fullRawText.length > 25000, "Text must exceed 25,000 characters");

  const chunks = chunkLegalDocument(fullRawText, "doc-large-test");

  // Verify all chunks are created and last chunk retains page 15
  assert.ok(chunks.length >= 15, `Expected at least 15 chunks, got ${chunks.length}`);
  const lastChunk = chunks[chunks.length - 1];
  assert.strictEqual(lastChunk.pageNumber, 15, "Last chunk must retain exact page 15 without truncation");
});

test("Citation: preserves exact PDF page numbers rather than word-estimated approximations", () => {
  const textWithExplicitPage = `--- Page 17 ---\nSECTION 17.2 INDEMNIFICATION\n` +
    `Provider shall defend and indemnify customer against all third-party patent infringement claims.`;
  
  const chunks = chunkLegalDocument(textWithExplicitPage, "doc-citation-test");
  assert.strictEqual(chunks.length > 0, true);
  assert.strictEqual(chunks[0].pageNumber, 17, "Chunk pageNumber must be 17");

  const sources = extractSourcesFromChunks(chunks);
  assert.strictEqual(sources[0].pageNumber, 17, "Source citation pageNumber must be exactly 17");
});
