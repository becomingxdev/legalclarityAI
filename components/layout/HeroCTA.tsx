"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { ArrowRight } from "lucide-react";

/**
 * The only part of the landing page that needs auth state —
 * isolated into a tiny client component so the rest of page.tsx
 * can remain a Server Component.
 */
export function HeroCTA() {
  const { user } = useAuth();

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
      >
        Open Your Workspace
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/signup"
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
      >
        Get Started Free
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/10"
      >
        Try Demo Workspace
      </Link>
    </>
  );
}
