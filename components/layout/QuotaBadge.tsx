"use client";

import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";

interface QuotaData {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
}

export const QuotaBadge: React.FC = () => {
  const { user } = useAuth();
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuota = async () => {
    try {
      const res = await fetch("/api/quota", {
        headers: {
          ...(user?.uid ? { "x-user-id": user.uid } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setQuota(data.quota);
      }
    } catch (err) {
      console.error("Failed to fetch quota", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
    // Refresh quota every 30 seconds to keep it updated as the user takes actions
    const interval = setInterval(fetchQuota, 30000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  if (loading || !quota) return null;

  const percentage = Math.round((quota.used / quota.limit) * 100);
  const isHigh = percentage > 85;

  return (
    <div 
      className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium sm:flex ${
        isHigh 
          ? "bg-red-500/10 text-red-400 border border-red-500/20" 
          : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
      }`}
      title={`${quota.remaining.toLocaleString()} tokens remaining today (Resets at midnight UTC)`}
    >
      <Zap className={`h-3 w-3 ${isHigh ? "text-red-400" : "text-indigo-400"}`} />
      <span>{quota.remaining >= 1000 ? `${(quota.remaining / 1000).toFixed(1)}k` : quota.remaining}</span>
    </div>
  );
};
