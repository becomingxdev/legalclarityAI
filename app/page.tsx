"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldAlert,
  HelpCircle,
  GitCompare,
  CheckSquare,
  Briefcase,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Lock,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Plain-Language Simplifier",
      desc: "Instantly translate dense legalese into straightforward, plain English with side-by-side section breakdowns and key takeaways.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: ShieldAlert,
      title: "Risk & Clause Detection",
      desc: "Automatically flag high-exposure terms: auto-renewal traps, unilateral suspensions, uncapped liability, non-competes, and indemnities.",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: HelpCircle,
      title: "Document-Grounded Q&A (RAG)",
      desc: "Chat with your agreement without hallucination. Every single answer cites the exact page number, section header, and clause text.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: CheckSquare,
      title: "Actionable Summaries & Checklists",
      desc: "Turn passive 40-page agreements into an organized, step-by-step compliance and operational task list with clear deadlines.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: GitCompare,
      title: "Contract Comparison & Diff",
      desc: "Compare two documents side-by-side. Highlights added clauses, removed clauses, and modified wording with critical risk alerts.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Briefcase,
      title: "Prepare for a Lawyer",
      desc: "Generate a curated legal briefing package complete with case summary, key facts, highlighted risks, and smart questions for your attorney.",
      color: "from-slate-700 to-slate-900",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/50 py-20 dark:border-slate-800/80 dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Generation Legal Intelligence</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
              Understand Legal Documents <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Without the Confusion
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
              Upload any contract, NDA, lease, or policy. Get instant plain-English explanations,
              hidden risk warnings, contract comparisons, and a lawyer-ready briefing packet.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-indigo-600/35"
              >
                Open Workspace & Demo Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compare"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <GitCompare className="h-4 w-4 text-indigo-600" />
                Try Contract Comparison
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-emerald-600" /> 100% Client-Side / Secure Server RAG
              </span>
              <span className="flex items-center gap-1.5">
                <Search className="h-4 w-4 text-indigo-600" /> Source-Linked Clause Citations
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" /> Zero Hallucinations Grounding
              </span>
            </div>
          </div>

          {/* Interactive Document Preview Mockup */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-medium text-slate-500">
                  CloudScale Enterprise SaaS Agreement — Analysis Workspace
                </span>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                2 High Risk Clauses Found
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column: Original vs Plain English */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Plain English Simplifier (Section 3.1)
                    </span>
                    <span className="text-[11px] text-slate-500">Page 2 • Clause 3.1</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-white/80 p-3 border border-slate-200/70 text-xs text-slate-600 dark:bg-slate-800/50 dark:border-slate-700/60 dark:text-slate-300">
                      <span className="font-semibold block text-slate-800 dark:text-slate-200 mb-1">Original Legalese:</span>
                      "UPON EXPIRATION OF THE INITIAL TERM, THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE 12-MONTH PERIODS, UNLESS NOTICE IS GIVEN 60 DAYS PRIOR..."
                    </div>
                    <div className="rounded-lg bg-emerald-50/80 p-3 border border-emerald-200/70 text-xs text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-200">
                      <span className="font-semibold block text-emerald-800 dark:text-emerald-300 mb-1">Plain English:</span>
                      "This agreement automatically locks you into another full year if you don’t cancel in writing at least 60 days before the contract anniversary."
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-950 dark:bg-rose-950/20">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                      High Risk
                    </span>
                    <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                      Vendor Liability Capped at 12 Months ($75,000)
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-rose-900/80 dark:text-rose-300">
                    Why it matters: If the vendor causes massive data loss or breach, your recovery is strictly capped at what you paid them, excluding all consequential damages.
                  </p>
                </div>
              </div>

              {/* Right Column: Q&A Snapshot */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Document Q&A Sample
                    </span>
                  </div>
                  <div className="mt-3 rounded-lg bg-white p-3 text-xs shadow-sm dark:bg-slate-800">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      "Can I terminate this agreement early?"
                    </p>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      Only for cause if Provider materially breaches and fails to cure within 30 days. Pre-paid fees are strictly non-refundable.
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>Source: Page 2, Section 3.2</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/document/saas-master-services-agreement-v1"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Explore Full SaaS Workspace
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Complete Legal Intelligence Suite
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Designed for founders, operators, employees, and individuals who want clarity without spending thousands on routine document reviews.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contract Comparison Highlight */}
      <section className="border-y border-slate-200 bg-indigo-900 py-20 text-white dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-800/80 px-3 py-1 text-xs font-medium text-indigo-200">
                <GitCompare className="h-3.5 w-3.5 text-indigo-300" />
                <span>Side-by-Side Redline Diff</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Spot Counterparty Changes Before You Sign
              </h2>
              <p className="mt-4 text-base text-indigo-200 leading-relaxed">
                When a counterparty sends a revised draft, spotting subtle modifications in 30 pages of text can be nearly impossible. LegalClarity AI pinpoints added obligations, deleted vendor promises, and shifts in liability caps.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Added Clauses & Hidden Surcharges</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <span>Removed Indemnities & Protections</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Modified Payment Terms & Notice Deadlines</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-md transition hover:bg-indigo-50"
                >
                  Test Contract Comparison
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-700/50 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300">Comparison Output Sample</span>
                <span className="rounded bg-rose-900/60 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                  Critical Change Detected
                </span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-lg bg-rose-950/40 p-3 border border-rose-900/60">
                  <span className="font-bold text-rose-300 block">Vendor IP Indemnification Struck Out:</span>
                  <p className="mt-1 text-slate-300">
                    Provider struck out Section 5.3 entirely. If their software infringes a patent, Customer is left with zero legal protection.
                  </p>
                </div>
                <div className="rounded-lg bg-amber-950/40 p-3 border border-amber-900/60">
                  <span className="font-bold text-amber-300 block">Notice Window Widened (60d → 90d):</span>
                  <p className="mt-1 text-slate-300">
                    You must now cancel 90 days before renewal instead of 60 days, giving you less time to evaluate contract alternatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Ready to Take Control of Your Legal Documents?
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            No credit card required. Upload a document or explore our pre-loaded enterprise agreements in seconds.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-500"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
