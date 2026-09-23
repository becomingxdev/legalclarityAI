"use client";

import React from "react";
import { LegalDocument } from "@/types/legal";
import {
  FileText,
  Calendar,
  DollarSign,
  Users,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
} from "lucide-react";

interface OverviewTabProps {
  document: LegalDocument;
  onNavigateToTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ document, onNavigateToTab }) => {
  const summary = document.analysis?.executiveSummary;
  const risks = document.analysis?.risks || [];
  const highRisks = risks.filter((r) => r.severity === "High");

  return (
    <div className="space-y-6">
      {/* Risk Alert Header */}
      {highRisks.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-900/60 dark:bg-rose-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                  {highRisks.length} High-Risk Legal {highRisks.length === 1 ? "Clause" : "Clauses"} Flagged
                </h4>
                <p className="text-xs text-rose-800/80 dark:text-rose-300">
                  Critical terms regarding automatic renewal deadlines and liability ceilings require review prior to signing.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab("risks")}
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 shrink-0"
            >
              View Flagged Risks
            </button>
          </div>
        </div>
      )}

      {/* Executive Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Executive Summary & Purpose
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {document.pageCount} Pages • {document.chunks.length} Chunks
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-700 leading-relaxed dark:text-slate-300">
          {summary?.documentPurpose || "Commercial legal agreement setting forth binding commitments and operational obligations."}
        </p>

        {/* 4 Pillars Matrix */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Parties Involved</span>
            </div>
            <div className="mt-2 space-y-1">
              {summary?.partiesInvolved?.map((party, idx) => (
                <p key={idx} className="text-xs font-bold text-slate-900 dark:text-white">
                  {party}
                </p>
              )) || <p className="text-xs text-slate-500">Specified in agreement</p>}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Important Dates</span>
            </div>
            <div className="mt-2 space-y-1">
              {summary?.importantDates?.map((date, idx) => (
                <p key={idx} className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {date}
                </p>
              )) || <p className="text-xs text-slate-500">Effective Date</p>}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>Financial Terms</span>
            </div>
            <div className="mt-2 space-y-1">
              {summary?.financialObligations?.map((fee, idx) => (
                <p key={idx} className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {fee}
                </p>
              )) || <p className="text-xs text-slate-500">Payable per schedule</p>}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Scale className="h-4 w-4 text-purple-600" />
              <span>Governing Jurisdiction</span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              {summary?.governingLaw || "Delaware (AAA Arbitration)"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => onNavigateToTab("simplified")}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Plain-English Breakdown
            </h4>
            <p className="mt-1 text-xs text-slate-500">Read simplified sections side-by-side</p>
          </div>
          <span className="text-indigo-600 font-bold">→</span>
        </button>

        <button
          onClick={() => onNavigateToTab("checklist")}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Actionable Checklist
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              {document.analysis?.checklist?.length || 0} tasks to verify before signing
            </p>
          </div>
          <span className="text-indigo-600 font-bold">→</span>
        </button>

        <button
          onClick={() => onNavigateToTab("lawyerPrep")}
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Lawyer Prep Package
            </h4>
            <p className="mt-1 text-xs text-slate-500">Briefing notes and questions for attorney</p>
          </div>
          <span className="text-indigo-600 font-bold">→</span>
        </button>
      </div>
    </div>
  );
};
