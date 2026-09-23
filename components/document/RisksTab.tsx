"use client";

import React, { useState } from "react";
import { LegalDocument, RiskCard, RiskCategory, RiskSeverity } from "@/types/legal";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Filter,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface RisksTabProps {
  document: LegalDocument;
}

export const RisksTab: React.FC<RisksTabProps> = ({ document }) => {
  const risks = document.analysis?.risks || [];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: string[] = [
    "All",
    "Obligations",
    "Payment Terms",
    "Termination Clauses",
    "Liability Clauses",
    "Confidentiality",
    "Renewal Clauses",
    "Restrictions",
  ];

  const filteredRisks = risks.filter((r) => {
    const matchCat = selectedCategory === "All" || r.riskType === selectedCategory;
    const matchSev = selectedSeverity === "All" || r.severity === selectedSeverity;
    return matchCat && matchSev;
  });

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case "High":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900";
      case "Low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category & Severity Filter */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Important Clause & Risk Detection
          </h3>
          <p className="text-xs text-slate-500">
            Automatically flagged provisions that could expose you to financial penalties, automatic lock-ins, or liability
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Badges */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Severity:</span>
            {["All", "High", "Medium", "Low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`rounded-lg px-2 py-0.5 text-xs font-medium transition ${
                  selectedSeverity === sev
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Cards List */}
      <div className="space-y-4">
        {filteredRisks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            No risk clauses found matching the current filter.
          </div>
        ) : (
          filteredRisks.map((risk) => {
            const isExpanded = expandedId === risk.id;

            return (
              <div
                key={risk.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(
                          risk.severity
                        )}`}
                      >
                        {risk.severity} Risk
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {risk.riskType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Page {risk.pageNumber} • {risk.sectionNumber || "Section"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {risk.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Plain Explanation */}
                <p className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {risk.explanation}
                </p>

                {/* Why It Matters Callout */}
                <div className="mt-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                  <span className="font-bold block mb-0.5 text-amber-800 dark:text-amber-300">
                    Why It Matters:
                  </span>
                  {risk.whyItMatters}
                </div>

                {/* Expandable Details: Source Clause & Recommendation */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {risk.recommendation && (
                      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-950 dark:border-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-200">
                        <span className="font-bold block mb-0.5 text-indigo-700 dark:text-indigo-300">
                          Recommended Action / Negotiation Point:
                        </span>
                        {risk.recommendation}
                      </div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                      <span className="font-sans font-bold block mb-1 text-[10px] text-slate-400 uppercase tracking-wider">
                        Source Provision (Page {risk.pageNumber}):
                      </span>
                      "{risk.sourceClause}"
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
