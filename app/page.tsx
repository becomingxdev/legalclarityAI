// Server Component — no "use client" needed
// The only client-interactive part (auth-conditional CTA) is in <HeroCTA />.

import React from "react";
import Link from "next/link";
import { HeroCTA } from "@/components/layout/HeroCTA";
import {
  Scale,
  FileText,
  ShieldAlert,
  MessageSquare,
  GitCompare,
  CheckSquare,
  Briefcase,
  ArrowRight,
  Lock,
  Sparkles,
  Compass,
  Hash,
  AlertTriangle,
  FileSearch,
} from "lucide-react";

const allEightFeatures = [
  {
    icon: FileText,
    title: "1. Legal Document Simplifier",
    desc: "Converts difficult legal language into clear, understandable language while preserving important conditions, exceptions, amounts, and dates.",
  },
  {
    icon: MessageSquare,
    title: "2. Ask Questions About Document",
    desc: "Grounded Q&A interface citing exact pages and clauses. Anti-hallucination engine admits when information is absent.",
  },
  {
    icon: ShieldAlert,
    title: "3. Important Clause & Risk Detection",
    desc: "Flags automatic renewals, strict deadlines, unilateral termination, uncapped liability, and restrictive covenants.",
  },
  {
    icon: CheckSquare,
    title: "4. Actionable Summary & Checklist",
    desc: "Turns complex contractual obligations into interactive task lists with completion tracking, due dates, and source references.",
  },
  {
    icon: GitCompare,
    title: "5. Document & Contract Comparison",
    desc: "Redline diff comparing original vs. counterparty drafts, highlighting critical changes in payments, liabilities, and terms.",
  },
  {
    icon: Compass,
    title: "6. Options & Next-Step Guidance",
    desc: "Contextual advice categorizing recommendations into immediate, pre-signing, and ongoing negotiation actions.",
  },
  {
    icon: Briefcase,
    title: "7. Prepare for a Lawyer",
    desc: "Generates an attorney-ready briefing packet with executive summary, key facts, and curated clarifying questions.",
  },
  {
    icon: Hash,
    title: "8. Relevant Provision & Source Linking",
    desc: "Every answer, simplified clause, and flagged risk is strictly traceable to its underlying page number and raw text chunk.",
  },
];

const principles = [
  { title: "Clarity", desc: "Plain language without stripping legal nuance or exceptions." },
  { title: "Grounding", desc: "Answers derived strictly from the uploaded document evidence." },
  { title: "Traceability", desc: "Every insight cites its page, section, and exact clause text." },
  { title: "Actionability", desc: "Turns passive legalese into checklists, deadlines, and next steps." },
  { title: "Safety", desc: "Clearly distinguishes document facts from guidance, never pretending to be a lawyer." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-[#0d0f13] text-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[520px] w-[520px] rounded-full bg-indigo-600/15 blur-3xl" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Source-Grounded GenAI Legal Intelligence
        </span>

        {/* Headline */}
        <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Understand Your Legal Documents
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            With Uncompromised Clarity
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/60 leading-relaxed">
          Upload any contract, agreement, or lease. Get plain-language explanations, identify potential concerns, question the document with cited evidence, and prepare for legal review.
        </p>

        {/* CTA Buttons — auth-conditional, isolated client component */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <HeroCTA />
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            Zero-Leakage Privacy Architecture
          </span>
          <span className="flex items-center gap-1.5">
            <FileSearch className="h-3.5 w-3.5 text-indigo-400" />
            Source-Linked Clause Citations
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-purple-400" />
            Anti-Hallucination Evidence First
          </span>
        </div>
      </section>

      {/* ── Interactive Example Analysis Preview ── */}
      <section className="px-6 py-12 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
              Interactive Example Analysis
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold">
              Turning Complex Legalese Into Grounded Clarity
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#12151b] p-6 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300">
                  Section 8.2 • Termination Notice
                </span>
                <span className="text-xs text-white/50">Employment Agreement</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                Grounded • Page 7
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                  Original Legal Text (Page 7)
                </span>
                <p className="text-xs font-mono text-white/70 leading-relaxed">
                  &ldquo;In the event of voluntary resignation, Executive shall provide not less than thirty (30) days&apos; prior written notice to the Company, during which period all ongoing confidentiality covenants remain strictly enforceable.&rdquo;
                </p>
              </div>

              {/* Simplified & Impact */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Plain-English Explanation
                </span>
                <p className="text-xs font-medium text-emerald-100 leading-relaxed">
                  You must give formal written notice at least 30 days before leaving your job. Your obligation to keep company trade secrets safe continues even after your departure.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-amber-300/90 pt-1">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span><strong>Why it matters:</strong> Missing the 30-day window could risk forfeiture of accrued bonus or severance.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8 Core Features ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Complete Feature Suite
            </p>
            <h2 className="mt-2 text-3xl font-bold">The 8 Core Capabilities of LegalClarity AI</h2>
            <p className="mt-2 text-xs text-white/50 max-w-xl mx-auto">
              Everything you need to navigate, interrogate, compare, and act on legal agreements
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {allEightFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-indigo-500/30 hover:bg-white/[0.06]"
                >
                  <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Product Principles ── */}
      <section className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Guiding Architecture
            </p>
            <h2 className="mt-2 text-3xl font-bold">Built on Five Core Principles</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center space-y-1.5"
              >
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-300 mb-2">
                  {idx + 1}
                </div>
                <h4 className="text-sm font-bold text-white">{p.title}</h4>
                <p className="text-[11px] text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Intelligent Processing Pipeline
          </p>
          <h2 className="mt-2 text-3xl font-bold">From Raw PDF to Structured Action</h2>

          <div className="mt-12 space-y-6 text-left">
            {[
              {
                step: "1. Extraction & Markdown Structuring",
                desc: "PDFs are cleaned, boundary-checked, and converted into Markdown preserving headers, tables, and page metadata.",
              },
              {
                step: "2. Clause-Aware Hierarchical Chunking",
                desc: "Never arbitrary character cuts: documents are partitioned along legal sections and paragraph boundaries with page coordinates.",
              },
              {
                step: "3. Grounded AI Analysis & Risk Extraction",
                desc: "AI identifies obligations, penalties, payment windows, auto-renewals, and liability ceilings without hallucinating.",
              },
              {
                step: "4. Multi-Dimensional Synthesis",
                desc: "Results populate the 8-tab workspace: plain summaries, risk cards, interactive checklists, lawyer briefs, and comparison diffs.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{s.step}</h4>
                  <p className="mt-1 text-xs text-white/50 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Start Exploring Documents <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Responsible Legal AI Disclaimer ── */}
      <section className="border-t border-white/[0.06] bg-amber-500/[0.03] px-6 py-8">
        <div className="mx-auto max-w-4xl text-center text-xs text-amber-200/80 leading-relaxed space-y-2">
          <p className="font-semibold text-amber-300 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Product Boundary & Responsible AI Notice
          </p>
          <p>
            <strong>Important:</strong> LegalClarity AI provides informational document assistance based on the materials you provide. It does not provide professional legal advice and does not replace a qualified legal professional. For important legal decisions or situations with significant consequences, always consult with licensed legal counsel.
          </p>
        </div>
      </section>
    </div>
  );
}
