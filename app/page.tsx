"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
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
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Plain-Language Simplifier",
    desc: "Dense legal text converted into clear, section-by-section plain English.",
  },
  {
    icon: ShieldAlert,
    title: "Risk & Clause Detection",
    desc: "Auto-flag auto-renewals, uncapped liability, non-competes & indemnity traps.",
  },
  {
    icon: MessageSquare,
    title: "Document Q&A",
    desc: "Chat with your contract — every answer cites the exact page and clause.",
  },
  {
    icon: CheckSquare,
    title: "Actionable Checklists",
    desc: "Turn passive agreements into step-by-step compliance task lists with deadlines.",
  },
  {
    icon: GitCompare,
    title: "Contract Comparison",
    desc: "Side-by-side redline diff — highlights added, removed and modified clauses.",
  },
  {
    icon: Briefcase,
    title: "Lawyer Prep Package",
    desc: "Generate a curated legal briefing with key facts and suggested questions.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col bg-[#0d0f13] text-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-24 text-center overflow-hidden">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[480px] w-[480px] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          AI-Powered Legal Intelligence
        </span>

        {/* Headline */}
        <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Understand Any Legal Document
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            In Minutes, Not Days
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-white/50 leading-relaxed">
          Upload a contract, NDA, lease or policy. Get plain-English explanations, risk warnings,
          contract comparisons and a lawyer-ready briefing — powered by AI.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Open Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Trust chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/35">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            Server-Side RAG
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-indigo-400" />
            Source-Linked Clause Citations
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            AI Firewall Protected
          </span>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-white/30">
            What LegalClarity AI Can Do
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition hover:border-indigo-500/30 hover:bg-white/[0.05]"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/45">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
            Three Simple Steps
          </p>
          <h2 className="text-3xl font-bold">From Upload to Insight in Seconds</h2>
          <div className="mt-12 space-y-8 text-left">
            {[
              { n: "01", t: "Upload Your Document", d: "PDF, TXT or paste text directly — contracts, NDAs, leases, policies, anything legal." },
              { n: "02", t: "AI Analyses the Full Text", d: "The document is chunked, embedded and analysed. Risks, clauses, dates and obligations are extracted automatically." },
              { n: "03", t: "Explore Insights & Ask Questions", d: "Browse the risk report, checklist, comparison diff, or chat directly with your document using the built-in Q&A assistant." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-5">
                <span className="shrink-0 text-4xl font-black text-white/[0.07]">{s.n}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{s.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
              >
                Go to Workspace <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Legal notice ── */}
      <div className="px-6 py-8 text-center text-[11px] text-white/25">
        <Lock className="mb-1 inline h-3 w-3" /> LegalClarity AI provides informational document
        assistance only. It does&nbsp;not constitute legal advice or replace a licensed attorney.
      </div>
    </div>
  );
}
