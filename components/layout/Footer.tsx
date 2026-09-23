import React from "react";
import { Scale, Shield } from "lucide-react";

export const Footer: React.FC = () => (
  <footer className="border-t border-white/[0.06] bg-[#0d0f13] px-6 py-8">
    <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <Scale className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold text-white/60">LegalClarity AI</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-[11px] text-amber-400/70 max-w-md">
        <Shield className="h-3.5 w-3.5 shrink-0" />
        Informational use only — does not constitute legal advice or replace a licensed attorney.
      </div>

      <p className="text-[11px] text-white/20">© {new Date().getFullYear()} LegalClarity AI</p>
    </div>
  </footer>
);
