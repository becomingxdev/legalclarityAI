"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { Scale, LayoutDashboard, GitCompare, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0d0f13]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Scale className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            LegalClarity <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Center Nav — only shown when logged in */}
        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
              { href: "/compare",   label: "Compare",   icon: GitCompare },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive(href)
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right — auth actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/30 text-[11px] font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
              <span className="hidden text-xs text-white/40 sm:block max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white/70"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-white/50 transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
