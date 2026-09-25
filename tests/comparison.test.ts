import test from "node:test";
import assert from "node:assert";
import { generateContractComparison } from "../lib/ai/heuristics";

test("Comparison: detects added clause", () => {
  const docA = { id: "a", title: "A", rawText: "Payment is due in 30 days.\n\nConfidentiality applies." };
  const docB = { id: "b", title: "B", rawText: "Payment is due in 30 days.\n\nConfidentiality applies.\n\nCustomer agrees to an audit provision." };
  
  const result = generateContractComparison(docA, docB);
  assert.strictEqual(result.addedCount > 0, true, "Should detect added clause");
  assert.strictEqual(result.items.some(i => i.type === "added"), true);
});

test("Comparison: detects removed clause", () => {
  const docA = { id: "a", title: "A", rawText: "Payment is due in 30 days.\n\nConfidentiality applies.\n\nTermination clause exists." };
  const docB = { id: "b", title: "B", rawText: "Payment is due in 30 days.\n\nConfidentiality applies." };
  
  const result = generateContractComparison(docA, docB);
  assert.strictEqual(result.removedCount > 0, true, "Should detect removed clause");
  assert.strictEqual(result.items.some(i => i.type === "removed"), true);
});

test("Comparison: detects modified clause when terms change", () => {
  const docA = { id: "a", title: "A", rawText: "Payment shall be made within 30 days of receipt of invoice from supplier." };
  const docB = { id: "b", title: "B", rawText: "Payment shall be made within 15 days of receipt of invoice from supplier." };
  
  const result = generateContractComparison(docA, docB);
  assert.strictEqual(result.modifiedCount > 0, true, "Should detect modified clause");
  assert.strictEqual(result.items.some(i => i.type === "modified"), true);
});
