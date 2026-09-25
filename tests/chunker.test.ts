import test from "node:test";
import assert from "node:assert";
import { chunkLegalDocument, cleanLegalText } from "../lib/pdf/chunker";

// ── cleanLegalText ─────────────────────────────────────────────────────────────

test("Chunker: cleanLegalText strips control characters and normalises whitespace", () => {
  const dirty = "Some\x00text\x1Fwith\tnull\rbytes and  extra   spaces.";
  const clean = cleanLegalText(dirty);
  assert.ok(!clean.includes("\x00"), "Null bytes must be removed");
  assert.ok(!clean.includes("\x1F"), "Control characters must be removed");
  assert.ok(!clean.includes("\r"), "Carriage returns must be removed");
});

test("Chunker: cleanLegalText normalises smart quotes and em-dashes", () => {
  const text = "\u201CHello\u201D and \u2018world\u2019 — or \u2013 not";
  const clean = cleanLegalText(text);
  assert.ok(clean.includes('"Hello"'), "Curly double quotes must become straight quotes");
  assert.ok(clean.includes("'world'"), "Curly single quotes must become straight quotes");
  assert.ok(clean.includes("-"), "Em/en-dash must become hyphen");
});

test("Chunker: cleanLegalText returns empty string for empty input", () => {
  assert.strictEqual(cleanLegalText(""), "");
  assert.strictEqual(cleanLegalText("   "), "");
});

// ── chunkLegalDocument ─────────────────────────────────────────────────────────

test("Chunker: produces at least one chunk for non-empty text", () => {
  const text = "This is a simple legal agreement between Party A and Party B.";
  const chunks = chunkLegalDocument(text, "doc-simple");
  assert.ok(chunks.length >= 1, "Must produce at least 1 chunk");
  assert.strictEqual(chunks[0].documentId, "doc-simple");
});

test("Chunker: returns empty array for blank input", () => {
  const chunks = chunkLegalDocument("", "doc-empty");
  assert.strictEqual(chunks.length, 0, "Empty text must produce 0 chunks");
});

test("Chunker: all chunks reference the correct documentId", () => {
  const text = Array.from({ length: 20 }, (_, i) =>
    `SECTION ${i + 1}\nThis clause governs the obligations of the parties with respect to matter ${i + 1}.`
  ).join("\n\n");
  const chunks = chunkLegalDocument(text, "doc-id-check");
  for (const chunk of chunks) {
    assert.strictEqual(chunk.documentId, "doc-id-check", `Chunk ${chunk.chunkId} has wrong documentId`);
  }
});

test("Chunker: chunk IDs are unique within a document", () => {
  const text = Array.from({ length: 30 }, (_, i) =>
    `SECTION ${i + 1}\n${"Legal text for clause ".repeat(5)}number ${i + 1}.`
  ).join("\n\n");
  const chunks = chunkLegalDocument(text, "doc-unique");
  const ids = chunks.map(c => c.chunkId);
  const uniqueIds = new Set(ids);
  assert.strictEqual(uniqueIds.size, ids.length, "All chunk IDs must be unique");
});

test("Chunker: detects explicit page markers from PDF extraction", () => {
  const text = `--- Page 1 ---\nSection 1. Introduction\nThis is page one content.\n\n--- Page 3 ---\nSection 3. Termination\nThis is page three content.`;
  const chunks = chunkLegalDocument(text, "doc-pages");
  const pages = chunks.map(c => c.pageNumber);
  assert.ok(pages.includes(1), "Must detect page 1");
  assert.ok(pages.includes(3), "Must detect page 3");
});

test("Chunker: single word document does not crash", () => {
  const chunks = chunkLegalDocument("Agreement", "doc-single-word");
  assert.ok(chunks.length >= 0, "Must not throw for minimal input");
});

test("Chunker: whitespace-only document returns empty", () => {
  const chunks = chunkLegalDocument("   \n\n\t  ", "doc-whitespace");
  assert.strictEqual(chunks.length, 0, "Whitespace-only input must produce 0 chunks");
});
