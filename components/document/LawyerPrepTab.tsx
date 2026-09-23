"use client";

import React from "react";
import { LegalDocument } from "@/types/legal";
import {
  Briefcase,
  Printer,
  Copy,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Calendar,
  Users,
  Download,
} from "lucide-react";

interface LawyerPrepTabProps {
  document: LegalDocument;
}

export const LawyerPrepTab: React.FC<LawyerPrepTabProps> = ({ document }) => {
  const prep = document.analysis?.lawyerPrep;
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownReport = () => {
    if (!prep) return "";
    return `# LAWYER BRIEFING PACKAGE: ${document.title}
Prepared via LegalClarity AI (${new Date().toLocaleDateString()})

## 1. Case & Executive Summary
${prep.caseSummary}

## 2. Key Parties & Effective Dates
- Parties: ${prep.partiesInvolved.join(" and ")}
- Start Date: ${prep.effectiveDates.startDate || "N/A"}
- Term / End: ${prep.effectiveDates.endDate || "N/A"}
- Critical Notice Deadline: ${prep.effectiveDates.noticeDeadline || "N/A"}

## 3. High-Priority Risk Highlights
${prep.keyFacts.risks.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## 4. Key Client Obligations
${prep.keyFacts.obligations.map((o, i) => `${i + 1}. ${o}`).join("\n")}

## 5. Suggested Clarifying Questions for Legal Counsel
${prep.suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

## 6. Proposed Negotiation / Redline Focus Areas
${prep.negotiationPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

---
DISCLAIMER: LegalClarity AI provides legal information and preparation assistance; it does not replace professional legal advice.`;
  };

  const handleCopy = () => {
    const text = generateMarkdownReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, "_")}_Lawyer_Briefing.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!prep) {
    return <div className="text-xs text-slate-500">No lawyer briefing available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Prepare for a Lawyer (Briefing Package)
          </h3>
          <p className="text-xs text-slate-500">
            Export a high-efficiency briefing document to maximize time and reduce hourly attorney billing costs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Markdown"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <Download className="h-3.5 w-3.5" />
            Download (.md)
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* The Printable Briefing Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Legal Counsel Briefing Packet
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            {prep.documentTitle}
          </h2>
          <p className="text-xs text-slate-400">
            Generated on {new Date().toLocaleDateString()} • Ingested {document.chunks.length} clauses
          </p>
        </div>

        {/* Section 1: Case Summary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Executive & Case Summary
          </h4>
          <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
            {prep.caseSummary}
          </p>
        </div>

        {/* Section 2: Key Facts & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Parties & Term
            </h4>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <strong>Parties:</strong> {prep.partiesInvolved.join(" & ")}
              </li>
              <li>
                <strong>Start Date:</strong> {prep.effectiveDates.startDate || "N/A"}
              </li>
              <li>
                <strong>Duration:</strong> {prep.effectiveDates.endDate || "N/A"}
              </li>
              <li>
                <strong>Notice Deadline:</strong> {prep.effectiveDates.noticeDeadline || "N/A"}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              Primary Risks for Counsel
            </h4>
            <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {prep.keyFacts.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Suggested Questions for Legal Counsel */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. High-Value Questions to Ask Your Lawyer
          </h4>
          <div className="mt-2 space-y-2">
            {prep.suggestedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-xs text-slate-800 dark:border-indigo-950 dark:bg-indigo-950/20 dark:text-slate-200"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  Q{idx + 1}
                </div>
                <p className="font-medium pt-0.5">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Negotiation Points */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Recommended Redline & Negotiation Targets
          </h4>
          <ul className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {prep.negotiationPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/40"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
