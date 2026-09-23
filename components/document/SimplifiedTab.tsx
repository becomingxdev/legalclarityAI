"use client";

import React, { useState } from "react";
import { LegalDocument, SimplifiedSection } from "@/types/legal";
import { BookOpen, CheckCircle, SplitSquareVertical, Search, FileText } from "lucide-react";

interface SimplifiedTabProps {
  document: LegalDocument;
}

export const SimplifiedTab: React.FC<SimplifiedTabProps> = ({ document }) => {
  const sections = document.analysis?.simplifiedSections || [];
  const [activeView, setActiveView] = useState<"side-by-side" | "plain-only">("side-by-side");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = sections.filter(
    (sec) =>
      sec.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.simplifiedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.originalText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Plain-Language Simplifier
          </h3>
          <p className="text-xs text-slate-500">
            Translates complex legalese into clear, understandable language with takeaways
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clauses..."
              className="rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-800">
            <button
              onClick={() => setActiveView("side-by-side")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeView === "side-by-side"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveView("plain-only")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                activeView === "plain-only"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Plain English Only
            </button>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            No sections match your search query.
          </div>
        ) : (
          filtered.map((sec) => (
            <div
              key={sec.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {sec.section}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sec.heading}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Page {sec.pageNumber}</span>
              </div>

              {activeView === "side-by-side" ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Legalese */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Original Legal Text
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                      "{sec.originalText}"
                    </p>
                  </div>

                  {/* Simplified Version */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-2">
                      Plain-English Explanation
                    </span>
                    <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                      {sec.simplifiedText}
                    </p>

                    {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">
                          Key Takeaways:
                        </span>
                        {sec.keyTakeaways.map((takeaway, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Plain English Only */
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                      {sec.simplifiedText}
                    </p>
                  </div>

                  {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sec.keyTakeaways.map((takeaway, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                        >
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          {takeaway}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
