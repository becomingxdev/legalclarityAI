"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LegalDocument } from "@/types/legal";
import { loadUserDocuments, getDocumentById } from "@/lib/storage/documentStore";
import {
  FileText,
  BookOpen,
  ShieldAlert,
  CheckSquare,
  HelpCircle,
  Hash,
  Compass,
  Briefcase,
  ArrowLeft,
  GitCompare,
} from "lucide-react";
import { OverviewTab } from "@/components/document/OverviewTab";
import { SimplifiedTab } from "@/components/document/SimplifiedTab";
import { RisksTab } from "@/components/document/RisksTab";
import { ChecklistTab } from "@/components/document/ChecklistTab";
import { SourcesTab } from "@/components/document/SourcesTab";
import { ChatTab } from "@/components/document/ChatTab";
import { NextStepsTab } from "@/components/document/NextStepsTab";
import { LawyerPrepTab } from "@/components/document/LawyerPrepTab";

import { useAuth } from "@/lib/firebase/auth-context";
import { useClientMount } from "@/lib/hooks/useClientMount";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function DocumentWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, loading } = useAuth();
  const isMounted = useClientMount();

  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sourceHighlight, setSourceHighlight] = useState<{
    chunkId?: string;
    page?: number;
    search?: string;
  }>({});

  const handleNavigateToSource = (page?: number, section?: string, chunkId?: string) => {
    setSourceHighlight({ page, chunkId, search: section });
    setActiveTab("sources");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (id) {
      getDocumentById(id, user?.uid).then((doc) => {
        if (doc) {
          setDocument(doc);
        } else {
          loadUserDocuments(user?.uid).then((allDocs) => {
            if (allDocs.length > 0) {
              setDocument(allDocs[0]);
            }
          });
        }
      });
    }
  }, [id, user, loading, router]);

  if (!isMounted) return null;

  if (!document) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Document Not Found
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          The requested document could not be loaded from your local workspace.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "simplified", label: "Simplified Version", icon: BookOpen },
    { id: "risks", label: "Risks & Clauses", icon: ShieldAlert, badge: document.analysis?.risks?.length },
    { id: "checklist", label: "Checklist", icon: CheckSquare, badge: document.analysis?.checklist?.length },
    { id: "sources", label: "Sources", icon: Hash, badge: document.chunks?.length },
    { id: "chat", label: "Ask AI (Chat)", icon: HelpCircle },
    { id: "nextSteps", label: "Next Steps", icon: Compass },
    { id: "lawyerPrep", label: "Lawyer Prep", icon: Briefcase },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Documents
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {document.title}
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Analyzed
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>File: {document.fileName}</span>
            <span>•</span>
            <span>{(document.fileSize / 1024).toFixed(1)} KB</span>
            <span>•</span>
            <span>{document.pageCount} Pages</span>
            <span>•</span>
            <span>Ingested {new Date(document.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/compare?docA=${document.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <GitCompare className="h-3.5 w-3.5 text-indigo-600" />
            Compare Against Another
          </Link>
        </div>
      </div>

      {/* 8-Tab Navigation Bar */}
      <div className="overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-1 sm:space-x-2" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive
                        ? "bg-indigo-700 text-white"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      {/* Kept mounted to retain state, toggled using 'hidden' class */}
      <div className="pt-2">
        <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className={activeTab === "overview" ? "" : "hidden"}>
          <ErrorBoundary label="Overview Tab">
            <OverviewTab document={document} onNavigateToTab={(t) => setActiveTab(t)} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-simplified" aria-labelledby="tab-simplified" className={activeTab === "simplified" ? "" : "hidden"}>
          <ErrorBoundary label="Simplified Version Tab">
            <SimplifiedTab document={document} onNavigateToSource={handleNavigateToSource} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-risks" aria-labelledby="tab-risks" className={activeTab === "risks" ? "" : "hidden"}>
          <ErrorBoundary label="Risks & Clauses Tab">
            <RisksTab document={document} onNavigateToSource={handleNavigateToSource} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-checklist" aria-labelledby="tab-checklist" className={activeTab === "checklist" ? "" : "hidden"}>
          <ErrorBoundary label="Checklist Tab">
            <ChecklistTab document={document} onNavigateToSource={handleNavigateToSource} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-sources" aria-labelledby="tab-sources" className={activeTab === "sources" ? "" : "hidden"}>
          <ErrorBoundary label="Sources Tab">
            <SourcesTab document={document} initialSearch={sourceHighlight.search} highlightChunkId={sourceHighlight.chunkId} highlightPage={sourceHighlight.page} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-chat" aria-labelledby="tab-chat" className={activeTab === "chat" ? "" : "hidden"}>
          <ErrorBoundary label="Chat Tab">
            <ChatTab document={document} onNavigateToChunk={(page, section) => handleNavigateToSource(page, section)} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-nextSteps" aria-labelledby="tab-nextSteps" className={activeTab === "nextSteps" ? "" : "hidden"}>
          <ErrorBoundary label="Next Steps Tab">
            <NextStepsTab document={document} onNavigateToTab={(t) => setActiveTab(t)} />
          </ErrorBoundary>
        </div>
        <div role="tabpanel" id="panel-lawyerPrep" aria-labelledby="tab-lawyerPrep" className={activeTab === "lawyerPrep" ? "" : "hidden"}>
          <ErrorBoundary label="Lawyer Prep Tab">
            <LawyerPrepTab document={document} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
