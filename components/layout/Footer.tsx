import React from "react";
import Link from "next/link";
import { Scale, Shield, ExternalLink, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">LegalClarity AI</span>
            </div>
            <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
              Transforming complex contracts and legal documents into clear, plain-language insights,
              actionable checklists, and lawyer-ready briefing packages.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              <Shield className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Important Legal Notice:</strong> LegalClarity AI provides informational document
                assistance and educational insights. It does not provide legal advice or replace a licensed attorney.
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Capabilities</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Plain-Language Simplifier</li>
              <li>Risk & Clause Detection</li>
              <li>Document Grounded Q&A (RAG)</li>
              <li>Actionable Checklists</li>
              <li>Contract Comparison Engine</li>
              <li>Lawyer Preparation Package</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Documents Dashboard
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Compare Two Contracts
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Sign In / Demo Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} LegalClarity AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built with Next.js 15, TypeScript & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
};
