"use client";

import React, { useState } from "react";
import { LegalDocument } from "@/types/legal";
import { Search, FileText, Hash, Layers } from "lucide-react";

interface SourcesTabProps {
  document: LegalDocument;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({ document }) => {
  const [search, setSearch] = useState("");
  const chunks = document.chunks || [];

  const filteredChunks = chunks.filter(
    (c) =>
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      c.heading.toLowerCase().includes(search.toLowerCase()) ||
      c.section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Relevant Provisions & Source Chunk Referencing
          </h3>
          <p className="text-xs text-slate-500">
            Transparent breakdown of every ingested section, page number, and chunk metadata used by RAG
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search raw provisions..."
            className="w-full rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredChunks.map((chunk) => (
          <div
            key={chunk.chunkId}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {chunk.section}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {chunk.heading}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <Hash className="h-3 w-3" />
                  {chunk.chunkId}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium dark:bg-slate-800">
                  Page {chunk.pageNumber}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap bg-slate-50/60 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800">
              {chunk.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
