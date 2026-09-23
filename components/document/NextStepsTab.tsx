"use client";

import React from "react";
import { LegalDocument, NextStepAction } from "@/types/legal";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  PhoneCall,
  Clock,
  Sparkles,
} from "lucide-react";

interface NextStepsTabProps {
  document: LegalDocument;
  onNavigateToTab: (tab: string) => void;
}

export const NextStepsTab: React.FC<NextStepsTabProps> = ({ document, onNavigateToTab }) => {
  const steps = document.analysis?.nextSteps || [];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Immediate":
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300";
      case "Before Signing":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Strategic Options & Next-Step Guidance
        </h3>
        <p className="text-xs text-slate-500">
          Clear recommendations on what to verify, negotiate, or prepare prior to contract execution
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step, idx) => (
          <div
            key={step.id || idx}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">Step {idx + 1}</span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getUrgencyBadge(
                    step.urgency
                  )}`}
                >
                  {step.urgency}
                </span>
              </div>

              <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {step.title}
              </h4>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Action: {step.actionType}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Decision Tree Helper */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 p-6 dark:border-indigo-900 dark:bg-slate-900">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Recommended Immediate Workflow
        </h4>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl bg-white p-3.5 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">1. Review Risks</span>
            Verify flagged high-risk terms in Section 3 & 6 regarding auto-renewal and liability.
          </div>
          <div className="rounded-xl bg-white p-3.5 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">2. Complete Checklist</span>
            Check off internal finance and data compliance action items before giving approval.
          </div>
          <div className="rounded-xl bg-white p-3.5 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">3. Generate Lawyer Brief</span>
            Export the Lawyer Prep package to share directly with legal counsel to save hours.
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onNavigateToTab("lawyerPrep")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Go to Lawyer Prep Package
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
