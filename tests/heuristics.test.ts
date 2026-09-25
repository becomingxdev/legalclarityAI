import test from "node:test";
import assert from "node:assert";
import { matchDocumentChunks, generateRisksFromMatches } from "../lib/ai/heuristics/matcher";

test("Heuristics: detects auto-renewal", () => {
  const chunks = [{
    documentId: "doc1", chunkId: "c1", pageNumber: 1, section: "Term", heading: "Term",
    content: "This Agreement automatically renews for one year unless notice is given."
  }];
  const matches = matchDocumentChunks(chunks);
  const risks = generateRisksFromMatches(matches);
  
  assert.strictEqual(risks.some(r => r.riskType === "Renewal Clauses"), true, "Should detect auto-renewal");
});

test("Heuristics: does not invent auto-renewal", () => {
  const chunks = [{
    documentId: "doc2", chunkId: "c1", pageNumber: 1, section: "Term", heading: "Term",
    content: "This Agreement expires on December 31."
  }];
  const matches = matchDocumentChunks(chunks);
  const risks = generateRisksFromMatches(matches);
  
  assert.strictEqual(risks.some(r => r.riskType === "Renewal Clauses"), false, "Should not hallucinate auto-renewal");
});
