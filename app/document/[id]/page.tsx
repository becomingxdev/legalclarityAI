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
  Download,
  Share2,
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

export default function DocumentWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) {
      getDocumentById(id).then((doc) => {
        if (doc) {
          setDocument(doc);
        } else {
          loadUserDocuments().then((allDocs) => {
            if (allDocs.length > 0) {
              setDocument(allDocs[0]);
            }
          });
        }
      });
    }
  }, [id]);

  if (!mounted) return null;

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
        <nav className="flex space-x-1 sm:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
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
      <div className="pt-2">
        {activeTab === "overview" && (
          <OverviewTab document={document} onNavigateToTab={(t) => setActiveTab(t)} />
        )}
        {activeTab === "simplified" && <SimplifiedTab document={document} />}
        {activeTab === "risks" && <RisksTab document={document} />}
        {activeTab === "checklist" && <ChecklistTab document={document} />}
        {activeTab === "sources" && <SourcesTab document={document} />}
        {activeTab === "chat" && <ChatTab document={document} />}
        {activeTab === "nextSteps" && (
          <NextStepsTab document={document} onNavigateToTab={(t) => setActiveTab(t)} />
        )}
        {activeTab === "lawyerPrep" && <LawyerPrepTab document={document} />}
      </div>
    </div>
  );
}
