"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Search,
  GitCompare,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { LegalDocument } from "@/types/legal";
import { loadUserDocuments, deleteDocumentById } from "@/lib/storage/documentStore";
import { DocumentUploadModal } from "@/components/document/DocumentUploadModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { useClientMount } from "@/lib/hooks/useClientMount";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const isMounted = useClientMount();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadDocs = async () => {
      if (user) {
        const docs = await loadUserDocuments(user.uid);
        setDocuments(docs);
      } else if (!loading) {
        const docs = await loadUserDocuments();
        setDocuments(docs);
      }
    };
    loadDocs();
  }, [user, loading]);

  // ── Extracted seed handler (was duplicated inline on two separate buttons) ──
  const handleSeedDemos = useCallback(async () => {
    const { seedSampleDocuments } = await import("@/lib/storage/documentStore");
    const seeded = await seedSampleDocuments(user?.uid);
    setDocuments(seeded);
  }, [user?.uid]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this document analysis?")) {
      await deleteDocumentById(id, user?.uid);
      const docs = await loadUserDocuments(user?.uid);
      setDocuments(docs);
    }
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Legal Document Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Upload contracts, review plain-English simplifications, and identify legal risks
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDemos}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 shadow-xs transition hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Load Demo Contracts
          </button>
          {documents.length >= 2 && (
            <Link
              href="/compare"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <GitCompare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Compare Contracts
            </Link>
          )}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-500"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Your Documents</span>
            <FileText className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {documents.length}
          </p>
          <span className="text-[11px] text-indigo-600 font-medium">Ready for AI Q&A</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Flagged Risk Clauses</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {documents.reduce((acc, d) => acc + (d.analysis?.risks?.length || 0), 0)}
          </p>
          <span className="text-[11px] text-slate-500">Categorized by severity</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Actionable Tasks</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {documents.reduce((acc, d) => acc + (d.analysis?.checklist?.length || 0), 0)}
          </p>
          <span className="text-[11px] text-slate-500">Generated checklist items</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      {documents.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by name or filename..."
              className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-4 text-xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="mt-6">
        {documents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              No documents uploaded yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              Upload any PDF agreement, employment contract, NDA, or terms of service to start extracting plain-language insights and risk reports with AI.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSeedDemos}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 shadow-xs hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Load 3 Demo Agreements (Instant)
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Your Own Document
              </button>
            </div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
            No documents matched your search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => {
              const highRisks = doc.analysis?.risks?.filter((r) => r.severity === "High").length || 0;

              return (
                <Link
                  key={doc.id}
                  href={`/document/${doc.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        {highRisks > 0 && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            {highRisks} High Risk
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDelete(doc.id, e)}
                          title="Delete document"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 line-clamp-1">
                      {doc.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {doc.analysis?.executiveSummary?.documentPurpose || doc.fileName}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                        Open Workspace
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentAdded={async () => {
          const docs = await loadUserDocuments(user?.uid);
          setDocuments(docs);
        }}
      />
    </div>
  );
}
