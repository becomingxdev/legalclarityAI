"use client";

import React, { useState } from "react";
import { LegalDocument } from "@/types/legal";
import { Search, FileText, Hash, Layers } from "lucide-react";

interface SourcesTabProps {
  document: LegalDocument;
  initialSearch?: string;
  highlightChunkId?: string;
  highlightPage?: number;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({
  document,
  initialSearch = "",
  highlightChunkId,
  highlightPage,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const chunks = document.chunks || [];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredChunks = chunks.filter((c) => {
    if (highlightPage && !search) {
      return c.pageNumber === highlightPage;
    }
    const q = search.toLowerCase();
    return (
      c.content.toLowerCase().includes(q) ||
      c.heading.toLowerCase().includes(q) ||
      c.section.toLowerCase().includes(q) ||
      c.chunkId.toLowerCase().includes(q)
    );
  });

  const handleCopyCitation = (chunk: (typeof chunks)[0]) => {
    const citation = `Source: ${document.title}, ${chunk.section} - ${chunk.heading} (Page ${chunk.pageNumber}, ${chunk.chunkId})\n"${chunk.content}"`;
    navigator.clipboard.writeText(citation);
    setCopiedId(chunk.chunkId);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

        <div className="flex items-center gap-2">
          {highlightPage && (
            <button
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg dark:bg-indigo-950 dark:text-indigo-300"
            >
              Filtered: Page {highlightPage} (Clear)
            </button>
          )}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search raw provisions..."
              className="w-full rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredChunks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            No source provisions matched your filter or search query.
          </div>
        ) : (
          filteredChunks.map((chunk) => {
            const isTarget = highlightChunkId === chunk.chunkId || (highlightPage && chunk.pageNumber === highlightPage);

            return (
              <div
                key={chunk.chunkId}
                id={chunk.chunkId}
                className={`rounded-2xl border p-5 shadow-sm transition ${
                  isTarget
                    ? "border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
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
                    <button
                      onClick={() => handleCopyCitation(chunk)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      {copiedId === chunk.chunkId ? "Copied!" : "Copy Citation"}
                    </button>
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
            );
          })
        )}
      </div>
    </div>
  );
};
