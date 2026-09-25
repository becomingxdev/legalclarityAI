import test from "node:test";
import assert from "node:assert";
import { generateHeuristicAnalysis } from "../lib/ai/heuristics";

const CONTRACT_TEXT = `
MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is entered into as of January 15, 2024
between Acme Corp ("Provider") and BetaCo ("Customer").

SECTION 1. SERVICES
Provider agrees to deliver cloud-based software services ("Services") as described in
the applicable order form. Provider reserves the right to modify Services at any time.

SECTION 2. PAYMENT TERMS
Customer shall pay all subscription fees within 30 days of invoice. Late payments accrue
interest at 1.5% per month. All amounts are non-refundable.

SECTION 3. TERM AND AUTO-RENEWAL
This Agreement commences on January 15, 2024 and shall automatically renew for successive
one-year periods unless either party provides sixty (60) days written notice of non-renewal
prior to the end of the then-current term.

SECTION 4. CONFIDENTIALITY
Each party agrees to hold the other's Confidential Information in strict confidence using
no less than reasonable care and to not disclose such information to third parties.

SECTION 5. LIMITATION OF LIABILITY
IN NO EVENT SHALL PROVIDER BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
DAMAGES. PROVIDER'S TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID IN THE PRIOR 3 MONTHS.

SECTION 6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of
the State of Delaware.
`.trim();

test("Heuristics: full pipeline returns all required top-level analysis fields", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  assert.ok(result.executiveSummary, "Must have executiveSummary");
  assert.ok(result.risks, "Must have risks");
  assert.ok(result.checklist, "Must have checklist");
  assert.ok(result.simplifiedSections, "Must have simplifiedSections");
  assert.ok(result.nextSteps, "Must have nextSteps");
  assert.ok(result.lawyerPrep, "Must have lawyerPrep");
});

test("Heuristics: executiveSummary contains parties and dates", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  assert.ok(Array.isArray(result.executiveSummary.partiesInvolved), "Parties must be an array");
  assert.ok(result.executiveSummary.partiesInvolved.length >= 1, "Must identify at least one party");
  assert.ok(Array.isArray(result.executiveSummary.importantDates), "importantDates must be an array");
  assert.ok(result.executiveSummary.importantDates.length >= 1, "Must identify at least one date");
});

test("Heuristics: detects auto-renewal risk in full document", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  const renewalRisks = result.risks.filter(r => r.riskType === "Renewal Clauses");
  assert.ok(renewalRisks.length > 0, "Should detect auto-renewal clause from Section 3");
});

test("Heuristics: detects liability limitation clause", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  const liabilityRisks = result.risks.filter(r => r.riskType === "Liability Clauses");
  assert.ok(liabilityRisks.length > 0, "Should detect liability cap from Section 5");
});

test("Heuristics: all risks have required fields", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  for (const risk of result.risks) {
    assert.ok(typeof risk.id === "string" && risk.id, `Risk missing id`);
    assert.ok(typeof risk.title === "string" && risk.title, `Risk missing title`);
    assert.ok(typeof risk.severity === "string", `Risk missing severity`);
    assert.ok(typeof risk.explanation === "string", `Risk missing explanation`);
    assert.ok(typeof risk.riskType === "string", `Risk missing riskType`);
  }
});

test("Heuristics: checklist items all have required fields", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  for (const item of result.checklist) {
    assert.ok(typeof item.id === "string", `Checklist item missing id`);
    assert.ok(typeof item.task === "string" && item.task, `Checklist item missing task`);
    assert.ok(typeof item.completed === "boolean", `Checklist item missing completed flag`);
    assert.ok(typeof item.category === "string" && item.category, `Checklist item missing category`);
  }
});

test("Heuristics: SaaS document is classified as SaaS", () => {
  const result = generateHeuristicAnalysis("SaaS Subscription Agreement", "This is a software-as-a-service agreement.");
  assert.ok(
    result.executiveSummary.documentPurpose.toLowerCase().includes("software") ||
    result.executiveSummary.documentPurpose.toLowerCase().includes("saas"),
    "SaaS document must be classified correctly"
  );
});

test("Heuristics: lawyerPrep contains document title", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  assert.strictEqual(result.lawyerPrep.documentTitle, "Master Services Agreement");
  assert.ok(Array.isArray(result.lawyerPrep.suggestedQuestions), "Must have suggestedQuestions");
  assert.ok(result.lawyerPrep.suggestedQuestions.length > 0, "Must have at least one suggested question");
});

test("Heuristics: overallRiskLevel is High, Medium, or Low", () => {
  const result = generateHeuristicAnalysis("Master Services Agreement", CONTRACT_TEXT);
  const valid = ["High", "Medium", "Low"];
  assert.ok(
    valid.includes(result.executiveSummary.overallRiskLevel),
    `overallRiskLevel must be one of ${valid.join(", ")}, got: ${result.executiveSummary.overallRiskLevel}`
  );
});

test("Heuristics: empty document does not crash and returns Low risk", () => {
  const result = generateHeuristicAnalysis("Unknown", "");
  assert.ok(result.executiveSummary, "Must return valid result for empty text");
  assert.strictEqual(result.executiveSummary.overallRiskLevel, "Low", "Empty doc must be Low risk");
});
