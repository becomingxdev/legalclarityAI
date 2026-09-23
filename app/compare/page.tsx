"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LegalDocument, ContractComparisonResult } from "@/types/legal";
import { loadUserDocuments } from "@/lib/storage/documentStore";
import { generateContractComparison } from "@/lib/ai/heuristics";
import {
  GitCompare,
  PlusCircle,
  MinusCircle,
  FileEdit,
  ShieldAlert,
  Loader2,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialDocAId = searchParams.get("docA") || "";

  const [documents, setDocuments] = React.useState<LegalDocument[]>([]);
  const [docAId, setDocAId] = React.useState<string>(initialDocAId);
  const [docBId, setDocBId] = React.useState<string>("");
  const [comparison, setComparison] = React.useState<ContractComparisonResult | null>(null);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const docs = loadUserDocuments();
    setDocuments(docs);

    if (docs.length >= 2) {
      const firstId = initialDocAId || docs[0].id;
      const secondId = docs.find((d) => d.id !== firstId)?.id || docs[1].id;
      setDocAId(firstId);
      setDocBId(secondId);

      const docA = docs.find((d) => d.id === firstId);
      const docB = docs.find((d) => d.id === secondId);
      if (docA && docB) {
        setComparison(generateContractComparison(docA, docB));
      }
    } else if (docs.length === 1) {
      setDocAId(docs[0].id);
    }
  }, [initialDocAId]);

  const handleRunComparison = () => {
    const docA = documents.find((d) => d.id === docAId);
    const docB = documents.find((d) => d.id === docBId);
    if (!docA || !docB) return;

    const result = generateContractComparison(docA, docB);
    setComparison(result);
  };

  if (!mounted) return null;

  const filteredItems = comparison?.items.filter((item) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Critical") return item.isCritical;
    return item.type === selectedFilter.toLowerCase();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <GitCompare className="h-3.5 w-3.5" />
          <span>Redline & Version Difference Engine</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Contract Comparison & Risk Divergence
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Identify added liabilities, removed customer protections, and modified terms between two agreement drafts
        </p>
      </div>

      {/* Selectors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Doc A */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Original Document (Draft A)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Doc B */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Revised / Counterparty Document (Draft B)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleRunComparison}
            disabled={!docAId || !docBId || docAId === docBId}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
          >
            <GitCompare className="h-4 w-4" />
            Compare Contracts
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          {/* Executive Synthesis */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 dark:border-rose-900/60 dark:bg-rose-950/30">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                Comparison Executive Summary & Risk Impact
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-rose-900/90 dark:text-rose-300">
              {comparison.executiveComparison}
            </p>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Critical Changes
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {comparison.criticalChangeCount}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Added Clauses
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {comparison.addedCount}
              </p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Removed Clauses
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {comparison.removedCount}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                Modified Clauses
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {comparison.modifiedCount}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Changes:</span>
            {["All", "Critical", "Added", "Removed", "Modified"].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                  selectedFilter === f
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Diff Cards */}
          <div className="space-y-4">
            {filteredItems?.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
                  item.isCritical
                    ? "border-rose-300 dark:border-rose-900"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {item.type === "added" && (
                      <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase dark:bg-emerald-950 dark:text-emerald-300">
                        <PlusCircle className="h-3 w-3" /> Added
                      </span>
                    )}
                    {item.type === "removed" && (
                      <span className="flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 uppercase dark:bg-rose-950 dark:text-rose-300">
                        <MinusCircle className="h-3 w-3" /> Removed
                      </span>
                    )}
                    {item.type === "modified" && (
                      <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase dark:bg-amber-950 dark:text-amber-300">
                        <FileEdit className="h-3 w-3" /> Modified
                      </span>
                    )}

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.clauseTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Category: {item.category}
                    </span>
                    {item.isCritical && (
                      <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Critical Change
                      </span>
                    )}
                  </div>
                </div>

                {/* Side by side diff snippet */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {item.originalText && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                      <span className="font-sans font-bold block mb-1 text-[10px] text-slate-400 uppercase">
                        Original Provision (Draft A)
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">{item.originalText}</p>
                    </div>
                  )}

                  {item.revisedText && (
                    <div
                      className={`rounded-xl border p-3 ${
                        item.type === "added"
                          ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                          : item.type === "removed"
                          ? "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20"
                          : "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20"
                      }`}
                    >
                      <span className="font-sans font-bold block mb-1 text-[10px] uppercase text-slate-500">
                        Revised Provision (Draft B)
                      </span>
                      <p className="text-slate-900 dark:text-slate-100">{item.revisedText}</p>
                    </div>
                  )}
                </div>

                {/* Plain-Language Impact Explanation */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/40 space-y-1">
                  <p className="text-slate-800 dark:text-slate-200">
                    <strong>AI Explanation:</strong> {item.aiExplanation}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>Business & Legal Impact:</strong> {item.impactAssessment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          Loading contract comparison workspace...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
