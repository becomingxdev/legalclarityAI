import test from "node:test";
import assert from "node:assert";
import { retrieveRelevantChunks, extractSourcesFromChunks } from "../lib/retrieval/rag";
import { DocumentChunk } from "../types/legal";

const sampleChunks: DocumentChunk[] = [
  {
    documentId: "doc-rag",
    chunkId: "c-pay",
    pageNumber: 2,
    section: "Section 2.1",
    heading: "Payment Terms & Invoice Schedule",
    content: "Customer shall pay all subscription fees within thirty (30) days from date of invoice. Late fees accrue at 1.5% per month.",
  },
  {
    documentId: "doc-rag",
    chunkId: "c-term",
    pageNumber: 4,
    section: "Section 4.3",
    heading: "Termination Notice Window",
    content: "Either party may terminate this agreement upon sixty (60) days advance written notice of non-renewal prior to term expiration.",
  },
  {
    documentId: "doc-rag",
    chunkId: "c-conf",
    pageNumber: 5,
    section: "Section 5.1",
    heading: "Confidentiality Covenants",
    content: "Both parties agree to hold confidential information in strict confidence and protect it using reasonable care.",
  },
];

test("RAG: retrieves Payment Terms for payment deadline queries", () => {
  const results = retrieveRelevantChunks("What is the payment deadline?", sampleChunks, 2);
  assert.strictEqual(results.length > 0, true, "Should return matching chunks");
  assert.strictEqual(results[0].chunkId, "c-pay", "Top chunk must be Payment Terms");
});

test("RAG: retrieves Termination chunk for notice period queries", () => {
  const results = retrieveRelevantChunks("What is the termination notice period?", sampleChunks, 2);
  assert.strictEqual(results.length > 0, true, "Should return matching chunks");
  assert.strictEqual(results[0].chunkId, "c-term", "Top chunk must be Termination Notice");
});

test("RAG: returns empty array for completely unrelated queries to prevent hallucination", () => {
  const results = retrieveRelevantChunks("How many kilometers from Earth to Mars?", sampleChunks, 2);
  assert.strictEqual(results.length, 0, "Unrelated query must return 0 chunks, preventing hallucination");
});

test("RAG: source citations retain exact page and clause numbers", () => {
  const results = retrieveRelevantChunks("payment fee invoices", sampleChunks, 1);
  const sources = extractSourcesFromChunks(results);
  assert.strictEqual(sources.length, 1);
  assert.strictEqual(sources[0].pageNumber, 2, "Source citation pageNumber must match chunk");
  assert.strictEqual(sources[0].section, "Section 2.1", "Source section must match chunk");
});
